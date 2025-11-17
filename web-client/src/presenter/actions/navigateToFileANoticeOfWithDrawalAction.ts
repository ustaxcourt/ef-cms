import { state } from '@web-client/presenter/app.cerebral';

export const navigateToFileANoticeOfWithdrawalAction = ({
  get,
  router,
  store,
}) => {
  console.log('Navigating to FileNoticeOfWithdrawal action');
  store.set(state.wizardStep, 'FileNoticeOfWithdrawal');
  const { docketNumber } = get(state.caseDetail);
  router.route(`/case-detail/${docketNumber}/file-a-document/details`);
};
