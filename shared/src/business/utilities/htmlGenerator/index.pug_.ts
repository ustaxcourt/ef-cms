// This is a generated file, do not edit
module.exports =
  `doctype html
html(lang="en")
  head
    title
      if options.title
        | #{options.title}
      else
        | U.S. Tax Court
    meta(charset='utf-8')
    style !{css}
    if options.styles
      style !{options.styles}

  body
    .main
      | !{content}`;
