import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';
import { getServeToIrsAlertSuccessAction } from '../actions/StartCaseInternal/getServeToIrsAlertSuccessAction';
import { isPrintPreviewPreparedAction } from '../actions/CourtIssuedOrder/isPrintPreviewPreparedAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { saveCaseDetailInternalEditAction } from '../actions/saveCaseDetailInternalEditAction';
import { serveCaseToIrsAction } from '../actions/StartCaseInternal/serveCaseToIrsAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseConfirmationFormDocumentTitleAction } from '../actions/StartCaseInternal/setCaseConfirmationFormDocumentTitleAction';
import { setCaseNotInProgressAction } from '../actions/StartCaseInternal/setCaseNotInProgressAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setPetitionIdAction } from '../actions/setPetitionIdAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const saveCaseAndServeToIrsSequence = [
  async () =>
    await new Promise(resolve =>
      setTimeout(() => {
        () => console.log('here 4'), resolve();
      }, 500),
    ),
  clearPdfPreviewUrlAction,
  showProgressSequenceDecorator([
    setCaseNotInProgressAction,
    getFormCombinedWithCaseDetailAction,
    () => console.log('here'),
    saveCaseDetailInternalEditAction,
    setCaseAction,
    () => console.log('here 2'),
    setPetitionIdAction,
    setDocumentIdAction,
    () => console.log('here 3'),
    serveCaseToIrsAction,
    {
      electronic: [],
      paper: [setPdfPreviewUrlAction],
    },
    clearModalAction,
    getServeToIrsAlertSuccessAction,
    () => console.log('here 5'),

    setAlertSuccessAction,
    () => console.log('here 6'),

    setSaveAlertsForNavigationAction,
    () => console.log('here 7'),

    navigateToCaseDetailAction,
    () => console.log('here 8'),

    isPrintPreviewPreparedAction,
    {
      no: [],
      yes: [
        clearFormAction,
        setCaseConfirmationFormDocumentTitleAction,
        setShowModalFactoryAction('PaperServiceConfirmModal'),
      ],
    },
  ]),
];
