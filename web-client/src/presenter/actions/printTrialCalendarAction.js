import { state } from 'cerebral';
import printTrialCalendarTemplate from '../../views/TrialSessionDetail/printTrialCalendarTemplate.html';

/**
 * Prints the trial calendar
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.store the cerebral store object
 * @returns {object} the docket number and stringified docketRecordHtml
 */
export const printTrialCalendarAction = ({ get }) => {
  const caseDetail = get(state.formattedCaseDetail);

  return {
    docketNumber: caseDetail.docketNumberWithSuffix,
    docketRecordHtml: printTrialCalendarTemplate,
  };
};
