/**
 * preparePrintableFormattedCasesAction
 *
 * @param {object} providers.props the cerebral props object
 * @returns {Object} formattedCases
 */

export const preparePrintableFormattedCasesAction = ({ props }) => {
  let { formattedCases } = props;
  let temporaryFormattedCases = [];

  formattedCases.forEach(formattedCase => {
    temporaryFormattedCases.push(formattedCase);
    if (formattedCase.leadCase) {
      temporaryFormattedCases = temporaryFormattedCases.concat(
        formattedCase.consolidatedCases,
      );
    }
  });

  formattedCases = temporaryFormattedCases;
  return { formattedCases };
};
