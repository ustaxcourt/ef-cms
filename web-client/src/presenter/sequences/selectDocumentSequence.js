import { clearAlertsAction } from '../actions/clearAlertsAction';
import { defaultSecondaryDocumentAction } from '../actions/FileDocument/defaultSecondaryDocumentAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { set } from 'cerebral/factories';
import { setDocumentScenarioAction } from '../actions/FileDocument/setDocumentScenarioAction';
import { setSecondaryDocumentScenarioAction } from '../actions/FileDocument/setSecondaryDocumentScenarioAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { state } from 'cerebral';
import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';

export const selectDocumentSequence = [
  set(state.showValidation, true),
  defaultSecondaryDocumentAction,
  validateSelectDocumentTypeAction,
  {
    error: [setValidationErrorsAction],
    success: [
      clearAlertsAction,
      set(state.showValidation, false),
      set(state.form.isDocumentTypeSelected, true),
      set(state.form.isSecondaryDocumentTypeSelected, false),
      setDocumentScenarioAction,
      validateSelectDocumentTypeAction,
      {
        error: [],
        success: [
          set(state.form.isSecondaryDocumentTypeSelected, true),
          setSecondaryDocumentScenarioAction,
          validateSelectDocumentTypeAction,
          {
            error: [],
            success: [generateTitleAction],
          },
        ],
      },
    ],
  },
];
