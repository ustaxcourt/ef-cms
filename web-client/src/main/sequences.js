import { set, toggle } from 'cerebral/factories';
import { state, props } from 'cerebral';
import * as actions from './actions';

export const gotoHome = [set(state`currentPage`, 'Home')];
export const gotoLogIn = [
  actions.clearLoginForm,
  set(state`currentPage`, 'LogIn'),
];
export const gotoFilePetition = [
  actions.clearPetition,
  set(state`currentPage`, 'FilePetition'),
];
export const gotoStyleGuide = [set(state`currentPage`, 'StyleGuide')];

export const toggleUsaBannerDetails = [toggle(state`usaBanner.showDetails`)];

export const updateFormValue = [set(state`form.${props`key`}`, props`value`)];

export const submitLogIn = [
  actions.setFormSubmitting,
  actions.getUser,
  {
    error: [actions.setAlertError],
    success: [actions.setUser, actions.navigateHome],
  },
  actions.unsetFormSubmitting,
];

export const updatePetitionValue = [
  set(state`petition.${props`key`}.file`, props`file`),
];

export const submitFilePetition = [
  // TODO: parallelize this
  set(state`petition.uploadsFinished`, 0),
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
              set(state`petition.uploadsFinished`, 1),
              actions.specifyRequestForPlaceOfTrial,
              actions.getDocumentId,
              {
                error: [actions.setAlertError],
                success: [
                  actions.uploadDocumentToS3,
                  {
                    error: [actions.setAlertError],
                    success: [
                      set(state`petition.uploadsFinished`, 2),
                      actions.specifyStatementOfTaxpayerIdentificationNumber,
                      actions.getDocumentId,
                      {
                        error: [actions.setAlertError],
                        success: [
                          actions.uploadDocumentToS3,
                          {
                            error: [actions.setAlertError],
                            success: [
                              set(state`petition.uploadsFinished`, 3),
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
