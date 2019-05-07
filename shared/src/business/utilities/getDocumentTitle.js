const replaceBracketed = (template, ...values) => {
  var bracketsMatcher = /\[.*?\]/;
  while (bracketsMatcher.test(template)) {
    template = template.replace(bracketsMatcher, values.shift() || '');
  }
  return template;
};
exports.replaceBracketed = replaceBracketed;
