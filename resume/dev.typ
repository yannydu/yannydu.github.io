// all text comes from resume.json (Typst markup; backslash-escape _ @ # $ < * when literal)
#import "template.typ": *

#let r = json("resume.json")
#let md(s) = eval(s, mode: "markup")

#show: resume.with(
  name: md(r.name),
  role: r.role,
  contacts: r.contacts.map(c => link(c.url, c.label)),
)

#section("Summary")
#md(r.summary)

#section("Skills")
#skills(r.skills.filter(s => s.at("pdf", default: true)).map(s => (s.label, s.items)))

#section("Work Experience")
#for e in r.experience { entry-from(e) }

#section("Projects")
#for e in r.projects { entry-from(e) }

#section("Education")
#for e in r.education { entry-from(e) }
