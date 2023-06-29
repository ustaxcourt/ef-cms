import { state } from '@web-client/presenter/app.cerebral';

/**
 * changes the route to view the file-a-document of the docketNUmber
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.store the cerebral store that contain the caseDetail.docketNumber
 */
export const navigateToFileADocumentAction = async ({
  get,
  router,
  store,
}: ActionProps) => {
  store.set(state.wizardStep, 'FileDocument');
  const { docketNumber } = get(state.caseDetail);
  await router.route(`/case-detail/${docketNumber}/file-a-document/details`);
};
