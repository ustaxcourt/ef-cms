import { state } from 'cerebral';

/**
 * changes the route to view the file-a-document of the docketNUmber
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.router the riot.router object that is used for changing the route
 * @param {Object} providers.props the cerebral props that contain the props.caseId
 */
export const navigateToFileADocumentAction = async ({ store }) => {
  store.set(state.wizardStep, 'FileDocument');
};
