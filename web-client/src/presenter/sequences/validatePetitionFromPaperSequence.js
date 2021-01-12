import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFormDateFactoryAction } from '../actions/computeFormDateFactoryAction';
import { computeStatisticDatesAction } from '../actions/StartCaseInternal/computeStatisticDatesAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePetitionFromPaperAction } from '../actions/validatePetitionFromPaperAction';

export const validatePetitionFromPaperSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computeFormDateFactoryAction('receivedAt', true),
      setComputeFormDateFactoryAction('receivedAt'),
      computeFormDateFactoryAction('irsNotice', true),
      setComputeFormDateFactoryAction('irsNoticeDate'),
      computeFormDateFactoryAction('petitionPayment', true),
      setComputeFormDateFactoryAction('petitionPayment'),
      computeFormDateFactoryAction('paymentDateWaived', true),
      setComputeFormDateFactoryAction('paymentDateWaived'),
      computeStatisticDatesAction,
      validatePetitionFromPaperAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
