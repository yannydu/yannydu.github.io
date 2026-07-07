// shared layout for dev.typ and qa.typ
// compile: typst compile dev.typ Danny_Yu_Resume.pdf

#let accent = rgb("#2b7a4b")

#let resume(name: [], role: "", contacts: (), body) = {
  set page(paper: "us-letter", margin: (x: 1.5cm, y: 1.0cm))
  set text(size: 10pt)
  set par(justify: true, leading: 0.5em)
  set list(indent: 0.5em, spacing: 0.45em, body-indent: 0.5em)

  align(center)[
    #text(size: 23pt, name)
    #v(-6pt)
    #smallcaps(text(size: 10.5pt, tracking: 0.6pt, fill: accent, role))
    #v(-4pt)
    #text(size: 9pt, contacts.join([#h(5pt)·#h(5pt)]))
  ]
  body
}

#let section(title) = {
  v(5pt)
  block(
    text(size: 11.5pt, weight: "bold", smallcaps(title)) +
    v(-8pt) +
    line(length: 100%, stroke: 0.6pt + luma(120)),
  )
  v(-2pt)
}

// org + role heading with right-aligned location / dates
#let entry(org, role, location, dates) = {
  v(2pt)
  grid(
    columns: (1fr, auto),
    row-gutter: 4pt,
    text(size: 10.5pt, weight: "bold", org),
    align(right, text(size: 9pt, style: "italic", fill: accent, location)),
    smallcaps(text(size: 9.5pt, role)),
    align(right, text(size: 9pt, style: "italic", dates)),
  )
  v(-1pt)
}

// rows: array of (label, items) pairs
#let skills(rows) = grid(
  columns: (auto, 1fr),
  column-gutter: 12pt,
  row-gutter: 6pt,
  ..rows
    .map(((label, items)) => (
      align(right, text(size: 9.5pt, weight: "bold", label)),
      text(size: 9.5pt, items),
    ))
    .flatten(),
)
