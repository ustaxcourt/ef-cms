import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { computeFormDateFactoryAction } from '../actions/computeFormDateFactoryAction';
import { formHasSecondaryDocumentAction } from '../actions/FileDocument/formHasSecondaryDocumentAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setComputeFormDayFactoryAction } from '../actions/setComputeFormDayFactoryAction';
import { setComputeFormMonthFactoryAction } from '../actions/setComputeFormMonthFactoryAction';
import { setComputeFormYearFactoryAction } from '../actions/setComputeFormYearFactoryAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

export const validateDocketEntrySequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computeCertificateOfServiceFormDateAction,
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
      setComputeFormDayFactoryAction('dateReceivedDay'),
      setComputeFormMonthFactoryAction('dateReceivedMonth'),
      setComputeFormYearFactoryAction('dateReceivedYear'),
      computeFormDateFactoryAction(null),
      setComputeFormDateFactoryAction('dateReceived'),
      validateDocketEntryAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
