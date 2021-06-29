import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { defaultRemoveFromTrialSessionModalValuesAction } from '../actions/defaultRemoveFromTrialSessionModalValuesAction';
import { getFilterCurrentJudgeUsersAction } from '../actions/getFilterCurrentJudgeUsersAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';

export const openRemoveFromTrialSessionModalSequence = [
  clearAlertsAction,
  clearModalStateAction,
  defaultRemoveFromTrialSessionModalValuesAction,
  getUsersInSectionAction({ section: 'judge' }),
  getFilterCurrentJudgeUsersAction,
  setUsersByKeyAction('modal.judges'),
  setShowModalFactoryAction('RemoveFromTrialSessionModal'),
];
