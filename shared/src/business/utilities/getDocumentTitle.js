const replaceBracketed = (template, ...values) => {
  var bracketsMatcher = /\[.*?\]/;
  while (bracketsMatcher.test(template)) {
    template = template.replace(bracketsMatcher, values.shift() || '');
  }
  return template;
};
exports.replaceBracketed = replaceBracketed;

/**
 * a function used for getting the document title of a filing event
 *
 * @param filingEvent the type of filing event selected
 * @param relatedInfo the ordinal value, document title, and user-provided data related to the filing event
 */
exports.getDocumentTitle = ({ filingEvent, relatedInfo }) => {
  const scenario = filingEvent.scenario.toLowerCase().trim();
  switch (scenario) {
    case 'nonstandard a': // fall-through
    case 'nonstandard h':
      return replaceBracketed(
        filingEvent.documentTitle,
        relatedInfo.documentName,
      );
    case 'nonstandard b': // fall-through
    case 'nonstandard e':
      return replaceBracketed(filingEvent.documentTitle, relatedInfo.userText);
    case 'nonstandard c':
      return replaceBracketed(
        filingEvent.documentTitle,
        relatedInfo.userText,
        relatedInfo.documentName,
      );
    case 'nonstandard d':
      return replaceBracketed(
        filingEvent.documentTitle,
        relatedInfo.documentName,
        relatedInfo.userText,
      );
    case 'nonstandard f':
      return replaceBracketed(
        filingEvent.documentTitle,
        relatedInfo.ordinal,
        relatedInfo.documentName,
      );
    case 'nonstandard g':
      return replaceBracketed(filingEvent.documentTitle, relatedInfo.ordinal);
    case 'standard': // fall-through
      return filingEvent.documentTitle;
    default:
      return filingEvent.documentTitle;
  }
};
