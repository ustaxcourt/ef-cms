import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeStatisticDatesAction } from '../actions/StartCaseInternal/computeStatisticDatesAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePetitionFromPaperAction } from '../actions/validatePetitionFromPaperAction';

export const validatePetitionFromPaperSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      getComputedFormDateFactoryAction('receivedAt', true),
      setComputeFormDateFactoryAction('receivedAt'),
      getComputedFormDateFactoryAction('irsNotice', true),
      setComputeFormDateFactoryAction('irsNoticeDate'),
      getComputedFormDateFactoryAction('paymentDate', true),
      setComputeFormDateFactoryAction('petitionPaymentDate'),
      getComputedFormDateFactoryAction('paymentDateWaived', true),
      setComputeFormDateFactoryAction('petitionPaymentWaivedDate'),
      computeStatisticDatesAction,
      validatePetitionFromPaperAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
