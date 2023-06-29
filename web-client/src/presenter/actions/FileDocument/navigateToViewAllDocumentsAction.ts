import { state } from '@web-client/presenter/app.cerebral';

/**
 * changes the route to view the view all documents page
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.docketNumber
 */
export const navigateToViewAllDocumentsAction = async ({
  get,
  router,
  store,
}: ActionProps) => {
  store.set(state.wizardStep, 'ViewAllDocuments');
  const { docketNumber } = get(state.caseDetail);
  await router.route(
    `/case-detail/${docketNumber}/file-a-document/all-document-categories`,
  );
};
