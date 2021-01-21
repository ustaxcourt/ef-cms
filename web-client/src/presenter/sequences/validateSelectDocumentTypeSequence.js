import { clearAlertsAction } from '../actions/clearAlertsAction';
import { formHasSecondaryDocumentAction } from '../actions/FileDocument/formHasSecondaryDocumentAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
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
      setComputeFormDayFactoryAction('serviceDateDay'),
      setComputeFormMonthFactoryAction('serviceDateMonth'),
      setComputeFormYearFactoryAction('serviceDateYear'),
      getComputedFormDateFactoryAction('serviceDate'),
      setComputeFormDateFactoryAction('serviceDate'),
      formHasSecondaryDocumentAction,
      {
        no: [],
        yes: [
          setComputeFormDayFactoryAction('secondaryDocument.serviceDateDay'),
          setComputeFormMonthFactoryAction(
            'secondaryDocument.serviceDateMonth',
          ),
          setComputeFormYearFactoryAction('secondaryDocument.serviceDateYear'),
          getComputedFormDateFactoryAction('secondaryDocument.serviceDate'),
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
