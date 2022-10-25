import { state } from 'cerebral';

/**
 * sets the state.practitionerDocuments
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.practitionerDocuments
 * @param {object} providers.store the cerebral store used for setting the state.practitionerDocuments
 */
export const setPractitionerDocumentsAction = ({ props, store }) => {
  store.set(state.practitionerDocuments, props.practitionerDocuments);
};
