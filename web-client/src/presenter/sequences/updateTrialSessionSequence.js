import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeTrialSessionFormDataAction } from '../actions/TrialSession/computeTrialSessionFormDataAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { isPrintPreviewPreparedAction } from '../actions/CourtIssuedOrder/isPrintPreviewPreparedAction';
import { navigateToTrialSessionDetailAction } from '../actions/TrialSession/navigateToTrialSessionDetailAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updateTrialSessionAction } from '../actions/TrialSession/updateTrialSessionAction';
import { validateTrialSessionAction } from '../actions/TrialSession/validateTrialSessionAction';

export const updateTrialSessionSequence = [
  clearAlertsAction,
  startShowValidationAction,
  getComputedFormDateFactoryAction(null),
  computeTrialSessionFormDataAction,
  validateTrialSessionAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: showProgressSequenceDecorator([
      updateTrialSessionAction,
      {
        error: [setAlertErrorAction],
        success: [
          setPdfPreviewUrlAction,
          setSaveAlertsForNavigationAction,
          setAlertSuccessAction,
          isPrintPreviewPreparedAction,
          {
            no: [navigateToTrialSessionDetailAction],
            yes: [setCurrentPageAction('PrintPaperTrialNotices')],
          },
        ],
      },
    ]),
  },
];
