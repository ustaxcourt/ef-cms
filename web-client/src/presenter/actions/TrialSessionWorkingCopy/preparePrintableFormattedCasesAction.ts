/**
 * preparePrintableFormattedCasesAction
 *
 * @param {object} providers.props the cerebral props object
 * @returns {Object} formattedCases
 */

export const preparePrintableFormattedCasesAction = ({
  props,
}: ActionProps) => {
  let { formattedCases } = props;
  let temporaryFormattedCases = [];

  formattedCases.forEach(formattedCase => {
    temporaryFormattedCases.push(formattedCase);
    if (formattedCase.isLeadCase) {
      temporaryFormattedCases = temporaryFormattedCases.concat(
        formattedCase.nestedConsolidatedCases,
      );
    }
  });

  formattedCases = temporaryFormattedCases;
  return { formattedCases };
};
