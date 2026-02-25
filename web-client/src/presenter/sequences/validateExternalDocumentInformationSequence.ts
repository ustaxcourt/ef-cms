import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateExternalDocumentInformationAction } from '../actions/FileDocument/validateExternalDocumentInformationAction';
import { setCustomValidationAlertErrorsFileDocumentAction } from '@web-client/presenter/actions/setCustomValidationAlertErrorsFileDocumentAction';
import { isNoticeOfWithdrawalAction } from '@web-client/presenter/actions/isNoticeOfWithdrawalAction';
import { setPartiesToWithdrawFromAction } from '@web-client/presenter/actions/setPartiesToWithdrawFromAction';

export const validateExternalDocumentInformationSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      setFilersFromFilersMapAction,
      isNoticeOfWithdrawalAction,
      { yes: [setPartiesToWithdrawFromAction], no: [] },
      validateExternalDocumentInformationAction,
      {
        error: [
          setValidationErrorsAction,
          setValidationAlertErrorsAction,
          setCustomValidationAlertErrorsFileDocumentAction,
        ],
        success: [clearAlertsAction],
      },
    ],
  },
];
