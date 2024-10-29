import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { clearModalStateAction } from '@web-client/presenter/actions/clearModalStateAction';
import { setShowModalFactoryAction } from '@web-client/presenter/actions/setShowModalFactoryAction';
import { setTodaysDateAction } from '@web-client/presenter/actions/setTodaysDateAction';

export const openCreateTermModalSequence = [
  clearAlertsAction,
  clearModalStateAction,
  setTodaysDateAction,
  setShowModalFactoryAction('CreateTermModal'),
];
