import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * defaults the update case modal values from state.caseDetail
 * @param {object} providers the providers object
 * @param {object} providers.get the get function to retrieve values from state
 * @param {object} providers.store the cerebral store object used for setting showModal
 */
export const defaultUpdateCaseModalValuesAction = ({
  get,
  store,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  let { associatedJudge, caseCaption, status } = cloneDeep(caseDetail);

  store.set(state.modal.caseCaption, caseCaption);
  store.set(state.modal.caseStatus, status);
  store.set(state.modal.associatedJudge, associatedJudge);
};
