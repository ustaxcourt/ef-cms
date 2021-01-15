import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFormDateFactoryAction } from '../actions/computeFormDateFactoryAction';
import { formHasSecondaryDocumentAction } from '../actions/FileDocument/formHasSecondaryDocumentAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setComputeFormDayFactoryAction } from '../actions/setComputeFormDayFactoryAction';
import { setComputeFormMonthFactoryAction } from '../actions/setComputeFormMonthFactoryAction';
import { setComputeFormYearFactoryAction } from '../actions/setComputeFormYearFactoryAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';

export const validateSelectDocumentTypeSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
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
      validateSelectDocumentTypeAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
