import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.opinionDocumentTypes which is used for displaying the opinion document types on the advanced search form.
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.opinionDocumentTypes
 * @param {object} providers.store the cerebral store used for setting the state.opinionDocumentTypes
 */
export const setOpinionTypesAction = ({ props, store }: ActionProps) => {
  store.set(state.opinionDocumentTypes, props.opinionDocumentTypes);
};
