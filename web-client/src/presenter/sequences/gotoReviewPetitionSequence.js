// import { chooseByTruthyStateActionFactory } from '../actions/editUploadCourtIssuedDocument/chooseByTruthyStateActionFactory';
// import { gotoDashboardSequence } from './gotoDashboardSequence';
//

// export const gotoReviewPetitionSequence = [
//   setCurrentPageAction('ReviewPetition'),
//   // chooseByTruthyStateActionFactory('form.partyType'),
//   // {
//   //   no: [gotoDashboardSequence],
//   //   yes: [setCurrentPageAction('ReviewPetition')],
//   // },
// ];
import { checkForActiveBatchesAction } from '../actions/checkForActiveBatchesAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFormDateAction } from '../actions/computeFormDateAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validatePetitionFromPaperAction } from '../actions/validatePetitionFromPaperAction';

export const gotoReviewPetitionSequence = [
  checkForActiveBatchesAction,
  {
    hasActiveBatches: [setShowModalFactoryAction('UnfinishedScansModal')],
    noActiveBatches: [
      clearAlertsAction,
      startShowValidationAction,
      computeFormDateAction,
      validatePetitionFromPaperAction,
      {
        error: [
          setAlertErrorAction,
          setValidationErrorsAction,
          setValidationAlertErrorsAction,
        ],
        success: [
          stopShowValidationAction,
          setCurrentPageAction('ReviewPetition'),
        ],
      },
    ],
  },
];
