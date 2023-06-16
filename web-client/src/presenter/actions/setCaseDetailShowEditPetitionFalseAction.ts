import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.currentViewMetadata.caseDetail.showEditPetition to false
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.currentViewMetadata.caseDetail.showEditPetition
 */
export const setCaseDetailShowEditPetitionFalseAction = ({
  store,
}: ActionProps) => {
  store.set(state.currentViewMetadata.caseDetail.showEditPetition, false);
};
