import { state } from 'cerebral';

/**
 * sets the state.opinionTypes which is used for displaying the opinion document types on the advanced search form.
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.caseDetail
 */
export const setOpinionTypesAction = ({ props, store }) => {
  store.set(state.opinionDocumentTypes, props.opinionDocumentTypes);
};
