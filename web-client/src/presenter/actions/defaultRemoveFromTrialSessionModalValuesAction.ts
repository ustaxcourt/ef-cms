import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * defaults the update case modal values from state.caseDetail
 * @param {object} providers the providers object
 * @param {object} providers.get the get function to retrieve values from state
 * @param {object} providers.store the cerebral store object used for setting showModal
 */
export const defaultRemoveFromTrialSessionModalValuesAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { STATUS_TYPES } = applicationContext.getConstants();

  const { trialSessionId } = props;
  const associatedJudge = cloneDeep(get(state.caseDetail.associatedJudge));
  const associatedJudgeId = cloneDeep(get(state.caseDetail.associatedJudgeId));

  store.set(state.modal.associatedJudge, associatedJudge);
  store.set(state.modal.associatedJudgeId, associatedJudgeId);
  store.set(state.modal.trialSessionId, trialSessionId);
  store.set(state.modal.caseStatus, STATUS_TYPES.generalDocketReadyForTrial);
};
