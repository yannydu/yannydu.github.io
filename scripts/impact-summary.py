#!/usr/bin/env python3
"""Summarize the Science Alive impact-log CSV into a public, privacy-safe JSON blob.

Disclosure rules (intentional — do not "fix" these without re-checking with
whoever owns the impact-log source data):

  - Rows with source == "manual" are dropped entirely. Those rows carry
    money/registration figures that must never be published on a public site.
  - Workers whose name ends in "-staging", "-sandbox" or "-cron" are dropped entirely
    (from every source), since they're test deployments, not real usage.
  - Only cumulative totals are ever emitted. No per-dimension breakdown
    (e.g. which page, which project) is included anywhere in the output —
    the "dimension" column of the source CSV is never surfaced.
  - Aggregation is across every week_ending seen in the file, not just the
    latest one.
  - Only a fixed allow-list of (source, worker, event) combinations feeds the
    output: workers requests/errors, hellowattson page_view, and spark-gallery
    page_view/project_view/issue_open (gallery pages) and sponsor_view
    (sponsor pages). Anything else in the CSV (upload, gate_fail,
    module_unlock, ...) is ignored on purpose — it's either not meaningful
    publicly or not yet cleared for disclosure.
  - Large counts are rounded to 2 significant figures before publishing, so
    the public number is an approximation rather than an exact operational
    figure.
"""

import csv
import json
import math
import sys


def round_sig2(value):
    """Round to 2 significant figures, returned as an int.

    0 stays 0. Values under 100 are returned exact (nothing to round off at
    that scale).
    """
    x = float(value)
    if x == 0:
        return 0
    if abs(x) < 100:
        return int(round(x))
    digits = math.ceil(math.log10(abs(x)))
    power = digits - 2
    factor = 10**power
    return int(round(x / factor) * factor)


def summarize(csv_path):
    weeks = set()
    event_weeks = set()
    workers_seen = set()
    total_requests = 0.0
    total_errors = 0.0
    lessons = 0.0
    gallery_pages = 0.0
    sponsor_pages = 0.0

    with open(csv_path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            week_ending = row.get("week_ending")
            source = row.get("source")
            worker = row.get("worker")
            event = row.get("event")
            if not week_ending or not source or not worker:
                continue
            if source == "manual":
                continue
            # -cron: helper Workers (nightly rebuild) are not apps.
            if worker.endswith(("-staging", "-sandbox", "-cron")):
                continue

            weeks.add(week_ending)
            count = int(float(row.get("count") or 0))

            if source == "workers":
                workers_seen.add(worker)
                if event == "requests":
                    total_requests += count
                elif event == "errors":
                    total_errors += count
            elif source == "analytics_engine":
                event_weeks.add(week_ending)
                if worker == "hellowattson" and event == "page_view":
                    lessons += count
                elif worker == "spark-gallery" and event in (
                    "page_view",
                    "project_view",
                    "issue_open",
                ):
                    gallery_pages += count
                elif worker == "spark-gallery" and event == "sponsor_view":
                    sponsor_pages += count

    if not weeks:
        raise SystemExit(f"no usable rows found in {csv_path}")

    error_rate_pct = (
        round((total_errors / total_requests) * 100, 2) if total_requests else 0.0
    )

    return {
        "since": min(weeks),
        "updated": max(weeks),
        "weeks_logged": len(weeks),
        "event_weeks_logged": len(event_weeks),
        "apps_in_production": len(workers_seen),
        "requests_served": round_sig2(total_requests),
        "error_rate_pct": error_rate_pct,
        "lessons_served": round_sig2(lessons),
        "gallery_pages_viewed": round_sig2(gallery_pages),
        "sponsor_pages_viewed": round_sig2(sponsor_pages),
    }


def main():
    if len(sys.argv) != 2:
        print("usage: impact-summary.py <csv-path>", file=sys.stderr)
        sys.exit(1)
    summary = summarize(sys.argv[1])
    print(json.dumps(summary, sort_keys=True, indent=2))


if __name__ == "__main__":
    main()
