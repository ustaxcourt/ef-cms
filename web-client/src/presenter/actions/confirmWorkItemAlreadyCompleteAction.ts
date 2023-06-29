import { state } from '@web-client/presenter/app.cerebral';

/**
 * navigate the user back to the proper page depending on where they original came from
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the state.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.form
 */
export const confirmWorkItemAlreadyCompleteAction = async ({
  get,
  router,
}: ActionProps) => {
  const fromPage = get(state.fromPage);
  const caseDetail = get(state.caseDetail);
  const { FROM_PAGES } = get(state.constants);

  switch (fromPage) {
    case FROM_PAGES.qcSectionInbox:
      await router.route('/document-qc/section/inbox');
      break;
    case FROM_PAGES.qcMyInbox:
      await router.route('/document-qc/my/inbox');
      break;
    case FROM_PAGES.qcMyInProgress:
      await router.route('/document-qc/my/inProgress');
      break;
    case FROM_PAGES.qcSectionInProgress:
      await router.route('/document-qc/section/inProgress');
      break;
    default:
      await router.route(`/case-detail/${caseDetail.docketNumber}`);
      break;
  }
};
