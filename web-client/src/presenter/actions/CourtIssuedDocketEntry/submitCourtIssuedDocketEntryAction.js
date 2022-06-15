import { state } from 'cerebral';
import { submitCourtIssuedDocketEntryActionHelper } from './submitCourtIssuedDocketEntryToConsolidatedGroupAction';

/**
 * creates a docket entry with the given court-issued document
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitCourtIssuedDocketEntryAction = async ({
  applicationContext,
  get,
}) => {
  const { docketNumber } = get(state.caseDetail);
  await submitCourtIssuedDocketEntryActionHelper({
    applicationContext,
    get,
    getDocketNumbers: () => {
      return [docketNumber];
    },
    subjectDocketNumber: docketNumber,
  });
};
