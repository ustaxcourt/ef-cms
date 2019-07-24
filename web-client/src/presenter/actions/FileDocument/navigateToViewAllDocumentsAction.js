import { state } from 'cerebral';

/**
 * changes the route to view the view all documents page
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.caseId
 */
export const navigateToViewAllDocumentsAction = ({ store }) => {
  store.set(state.wizardStep, 'ViewAllDocuments');
};
