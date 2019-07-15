import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFormDateAction } from '../actions/FileDocument/computeFormDateAction';
import { computeSecondaryFormDateAction } from '../actions/FileDocument/computeSecondaryFormDateAction';
import { defaultSecondaryDocumentAction } from '../actions/FileDocument/defaultSecondaryDocumentAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { navigateToFileADocumentAction } from '../actions/FileDocument/navigateToFileADocumentAction';
import { primeDoNotProceedPropAction } from '../actions/FileDocument/primeDoNotProceedPropAction';
import { set } from 'cerebral/factories';
import { setDefaultFileDocumentFormValuesAction } from '../actions/FileDocument/setDefaultFileDocumentFormValuesAction';
import { setDocketNumberPropAction } from '../actions/FileDocument/setDocketNumberPropAction';
import { setDocumentScenarioAction } from '../actions/FileDocument/setDocumentScenarioAction';
import { setSecondaryDocumentScenarioAction } from '../actions/FileDocument/setSecondaryDocumentScenarioAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldProceedAction } from '../actions/FileDocument/shouldProceedAction';
import { state } from 'cerebral';
import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';

export const selectDocumentSequence = [
  set(state.showValidation, true),
  computeFormDateAction,
  computeSecondaryFormDateAction,
  defaultSecondaryDocumentAction,
  validateSelectDocumentTypeAction,
  {
    error: [setValidationErrorsAction],
    success: [
      clearAlertsAction,
      set(state.showValidation, false),
      setDocumentScenarioAction,
      primeDoNotProceedPropAction,
      set(state.screenMetadata.isDocumentTypeSelected, true),
      set(state.screenMetadata.isSecondaryDocumentTypeSelected, false),
      validateSelectDocumentTypeAction,
      {
        error: [],
        success: [
          set(state.screenMetadata.isSecondaryDocumentTypeSelected, true),
          setSecondaryDocumentScenarioAction,
          validateSelectDocumentTypeAction,
          {
            error: [],
            success: [
              shouldProceedAction,
              {
                ignore: [],
                proceed: [
                  generateTitleAction,
                  setDocketNumberPropAction,
                  setDefaultFileDocumentFormValuesAction,
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
