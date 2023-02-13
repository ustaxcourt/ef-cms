import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { formHasSecondaryDocumentAction } from '../actions/FileDocument/formHasSecondaryDocumentAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

export const validateDocketEntrySequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computeCertificateOfServiceFormDateAction,
      getComputedFormDateFactoryAction('serviceDate'),
      setComputeFormDateFactoryAction('serviceDate'),
      formHasSecondaryDocumentAction,
      {
        no: [],
        yes: [
          getComputedFormDateFactoryAction('secondaryDocument.serviceDate'),
          setComputeFormDateFactoryAction('secondaryDocument.serviceDate'),
        ],
      },
      getComputedFormDateFactoryAction('dateReceived'),
      setComputeFormDateFactoryAction('dateReceived'),
      setFilersFromFilersMapAction,
      validateDocketEntryAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
