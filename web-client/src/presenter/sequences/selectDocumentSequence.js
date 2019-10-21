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
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';

export const selectDocumentSequence = [
  startShowValidationAction,
  computeFormDateAction,
  computeSecondaryFormDateAction,
  defaultSecondaryDocumentAction,
  validateSelectDocumentTypeAction,
  {
    error: [setValidationErrorsAction],
    success: [
      clearAlertsAction,
      stopShowValidationAction,
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
