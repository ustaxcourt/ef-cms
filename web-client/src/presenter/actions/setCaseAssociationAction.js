import { state } from 'cerebral';

/**
 * sets the screen metadata props which are used for displaying the association UI
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.caseDetail
 */
export const setCaseAssociationAction = ({ store, props }) => {
  store.set(state.screenMetadata.associated, props.associated);
  store.set(state.screenMetadata.pendingAssociation, props.pendingAssociation);
};
