import { filter, flow, map } from 'lodash/fp';
import { state } from 'cerebral';
import { submitCourtIssuedDocketEntryActionHelper } from './submitCourtIssuedDocketEntryActionHelper';

/**
 * saves the court issued docket entry on all of the checked consolidated cases of the group.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitCourtIssuedDocketEntryToConsolidatedGroupAction = async ({
  applicationContext,
  get,
}) => {
  await submitCourtIssuedDocketEntryActionHelper({
    applicationContext,
    get,
    getDocketNumbers: () => {
      return flow(
        filter('checked'),
        map('docketNumber'),
      )(get(state.caseDetail.consolidatedCases));
    },
    subjectDocketNumber: get(state.caseDetail.docketNumber),
  });
};
