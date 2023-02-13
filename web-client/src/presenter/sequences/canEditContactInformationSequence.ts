import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getCanEditContactInformationAction } from '../actions/getCanEditContactInformationAction';
import { getUserAction } from '../actions/getUserAction';
import { navigateToEditUserContactAction } from '../actions/navigateToEditUserContactAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';

export const canEditContactInformationSequence = [
  getUserAction,
  getCanEditContactInformationAction,
  {
    no: [setAlertErrorAction],
    yes: [
      clearAlertsAction,
      clearErrorAlertsAction,
      navigateToEditUserContactAction,
    ],
  },
];
