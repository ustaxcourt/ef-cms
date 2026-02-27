/**
 * preparePrintableFormattedCasesAction
 *
 * @param {object} providers.props the cerebral props object
 * @returns {Object} formattedCases
 */

import { TrialSessionWorkingCopyCase } from "@web-client/presenter/computeds/trialSessionWorkingCopyHelper";

export const preparePrintableFormattedCasesAction = ({
  props,
}: ActionProps) => {
  let { formattedCases } = props;
  let temporaryFormattedCases: TrialSessionWorkingCopyCase[] = [];

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
