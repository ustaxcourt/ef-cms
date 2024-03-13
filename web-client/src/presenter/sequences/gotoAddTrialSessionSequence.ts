import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getIrsPractitionerUsersAction } from '@web-client/presenter/actions/TrialSession/getIrsPractitionerUsersAction';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { parallel } from 'cerebral/factories';
import { setDefaultTrialSessionFormValuesAction } from '../actions/setDefaultTrialSessionFormValuesAction';
import { setIrsPractitionerUsersAction } from '@web-client/presenter/actions/TrialSession/setIrsPractitionerUsersAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoAddTrialSessionSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    clearScreenMetadataAction,
    parallel([
      [getTrialSessionsAction, setTrialSessionsAction],
      [getIrsPractitionerUsersAction, setIrsPractitionerUsersAction],
      getSetJudgesSequence,
      [
        getUsersInSectionAction({ section: 'trialClerks' }),
        setUsersByKeyAction('trialClerks'),
      ],
    ]),
    setDefaultTrialSessionFormValuesAction,
    setupCurrentPageAction('AddTrialSession'),
  ]);
