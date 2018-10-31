import { set, toggle } from 'cerebral/factories';
import { state, props } from 'cerebral';
import * as actions from './actions';

export const gotoHome = [set(state`currentPage`, 'Home')];
export const gotoLogIn = [set(state`currentPage`, 'LogIn')];
export const gotoFilePetition = [
  actions.clearPetition,
  set(state`currentPage`, 'FilePetition'),
];
export const gotoStyleGuide = [set(state`currentPage`, 'StyleGuide')];

export const toggleUsaBannerDetails = [toggle(state`usaBanner.showDetails`)];

export const updatePetitionValue = [
  set(state`petition.${props`key`}.file`, props`file`),
];

// export const submitFilePetition = [
//   actions.setFormSubmitting,
//   actions.getDocumentPolicy,
//   {
//     error: [actions.setAlertError],
//     success: [],
//   },
// ];

export const submitFilePetition = [
  // TODO: parallelize this
  actions.setFormSubmitting,
  actions.getDocumentPolicy,
  {
    error: [actions.setAlertError],
    success: [
      actions.specifyPetitionFile,
      actions.getDocumentId,
      {
        error: [actions.setAlertError],
        success: [
          actions.uploadDocumentToS3,
          {
            error: [actions.setAlertError],
            success: [
              actions.specifyRequestForPlaceOfTrial,
              actions.getDocumentId,
              {
                error: [actions.setAlertError],
                success: [
                  actions.uploadDocumentToS3,
                  {
                    error: [actions.setAlertError],
                    success: [
                      actions.specifyStatementOfTaxpayerIdentificationNumber,
                      actions.getDocumentId,
                      {
                        error: [actions.setAlertError],
                        success: [
                          actions.uploadDocumentToS3,
                          {
                            error: [actions.setAlertError],
                            success: [
                              actions.unsetFormSubmitting,
                              actions.getPetitionUploadAlertSuccess,
                              actions.setAlertSuccess,
                              actions.navigateHome,
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
