import { state } from 'cerebral';

/**
 * defaults the update case modal values from state.caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the get function to retrieve values from state
 * @param {object} providers.store the cerebral store object used for setting showModal
 */
export const defaultRemoveFromTrialSessionModalValuesAction = ({
  get,
  props,
  store,
}) => {
  const { trialSessionId } = props;
  const caseDetail = get(state.caseDetail);
  let { associatedJudge, status } = caseDetail;

  store.set(state.modal.caseStatus, status);
  store.set(state.modal.associatedJudge, associatedJudge);
  store.set(state.modal.trialSessionId, trialSessionId);
};
