import { canFileInConsolidatedCasesAction } from '../actions/FileDocument/canFileInConsolidatedCasesAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFormDateFactoryAction } from '../actions/computeFormDateFactoryAction';
import { defaultSecondaryDocumentAction } from '../actions/FileDocument/defaultSecondaryDocumentAction';
import { formHasSecondaryDocumentAction } from '../actions/FileDocument/formHasSecondaryDocumentAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { navigateToFileADocumentAction } from '../actions/FileDocument/navigateToFileADocumentAction';
import { refreshExternalDocumentTitleFromEventCodeAction } from '../actions/FileDocument/refreshExternalDocumentTitleFromEventCodeAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setComputeFormDayFactoryAction } from '../actions/setComputeFormDayFactoryAction';
import { setComputeFormMonthFactoryAction } from '../actions/setComputeFormMonthFactoryAction';
import { setComputeFormYearFactoryAction } from '../actions/setComputeFormYearFactoryAction';
import { setDefaultFileDocumentFormValuesAction } from '../actions/FileDocument/setDefaultFileDocumentFormValuesAction';
import { setDocketNumberPropAction } from '../actions/FileDocument/setDocketNumberPropAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unset } from 'cerebral/factories';
import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';

export const completeDocumentSelectSequence = [
  startShowValidationAction,
  computeFormDateFactoryAction(null),
  setComputeFormDateFactoryAction('serviceDate'),
  formHasSecondaryDocumentAction,
  {
    no: [],
    yes: [
      setComputeFormDayFactoryAction('secondaryDocument.day'),
      setComputeFormMonthFactoryAction('secondaryDocument.month'),
      setComputeFormYearFactoryAction('secondaryDocument.year'),
      computeFormDateFactoryAction(null),
      setComputeFormDateFactoryAction('secondaryDocument.serviceDate'),
    ],
  },
  defaultSecondaryDocumentAction,
  validateSelectDocumentTypeAction,
  {
    error: [setValidationErrorsAction],
    success: [
      clearAlertsAction,
      stopShowValidationAction,
      refreshExternalDocumentTitleFromEventCodeAction,
      generateTitleAction,
      setDocketNumberPropAction,
      setDefaultFileDocumentFormValuesAction,
      canFileInConsolidatedCasesAction,
      {
        no: [],
        yes: [unset(state.form.partyPrimary)],
      },
      navigateToFileADocumentAction,
    ],
  },
];
