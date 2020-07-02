/**
 * changes the route to view the document-detail of the documentId
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.caseId
 * @returns {Promise} async action
 */
export const navigateToDocumentDetailAction = async ({ props, router }) => {
  if (props.docketNumber && props.documentId) {
    await router.route(
      `/case-detail/${props.docketNumber}/documents/${props.documentId}`,
    );
  }
};
