import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets currentViewMetadata.caseDetail.frozen to false (enables caseDetail tabs to be set again, or "unfreezes" them)
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store function
 */
export const setCaseDetailPageTabUnfrozenAction = ({ store }: ActionProps) => {
  store.unset(state.currentViewMetadata.caseDetail.frozen);
};
