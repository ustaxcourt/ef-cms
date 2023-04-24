import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateExternalDocumentInformationAction } from '../actions/FileDocument/validateExternalDocumentInformationAction';
import { validateFileAction } from '../actions/FileDocument/validateFileAction';

export const validateExternalDocumentInformationSequence = [
  // shouldValidateAction,
  // {
  //   ignore: [],
  //   validate: [
  // computeCertificateOfServiceFormDateAction,
  // setFilersFromFilersMapAction,
  // upload the pdf so our lambda can validatePdfInteractor
  validateFileAction,
  {
    error: [
      () => {
        console.log('pdf has been validated, it is BORKED!');
      },
    ],
    success: [
      () => {
        console.log('pdf has been validated, it is NOT borked!');
      },
    ],
  },
  validateExternalDocumentInformationAction,
  {
    error: [setValidationErrorsAction],
    success: [clearAlertsAction],
  },
  //   ],
  // },
];

// upload to s3, validatePdfInteractor, return id
// change it - delete old uploaded file
// submit - pass the id
