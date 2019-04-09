import { clearAlertsAction } from '../actions/clearAlertsAction';
import { defaultSecondaryDocumentAction } from '../actions/FileDocument/defaultSecondaryDocumentAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { navigateToFileADocumentAction } from '../actions/FileDocument/navigateToFileADocumentAction';
import { set } from 'cerebral/factories';
import { setDocketNumberPropAction } from '../actions/FileDocument/setDocketNumberPropAction';
import { setDocumentScenarioAction } from '../actions/FileDocument/setDocumentScenarioAction';
import { setSecondaryDocumentScenarioAction } from '../actions/FileDocument/setSecondaryDocumentScenarioAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldForwardAction } from '../actions/FileDocument/shouldForwardAction';
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
            success: [
              shouldForwardAction,
              {
                ignore: [],
                proceed: [
                  generateTitleAction,
                  setDocketNumberPropAction,
                  navigateToFileADocumentAction,
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
