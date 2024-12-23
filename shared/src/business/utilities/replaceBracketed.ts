export const replaceBracketed = (
  template: string,
  ...values: string[]
): string => {
  const bracketsMatcher = /\[.*?\]/;
  while (bracketsMatcher.test(template)) {
    template = template.replace(bracketsMatcher, values.shift() || '');
  }
  template = template.replace(/\s+\./g, '.');
  template = template.trim();
  return template;
};
