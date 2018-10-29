import { set, toggle } from 'cerebral/factories';
import { state, props } from 'cerebral';
import * as actions from './actions';

export const gotoHome = [set(state`currentPage`, 'Home')];
export const gotoLogIn = [set(state`currentPage`, 'LogIn')];
export const gotoFilePetition = [set(state`currentPage`, 'FilePetition')];
export const gotoStyleGuide = [set(state`currentPage`, 'StyleGuide')];

export const toggleUsaBannerDetails = [toggle(state`usaBanner.showDetails`)];

export const updatePetitionValue = [
  set(state`petition.${props`key`}.file`, props`file`),
];

export const submitFilePetition = [
  // TODO: parallelize this
  set(state`submitting`, true),
  actions.getDocumentPolicy,
  {
    error: [set(state`alertError`, props`error`)],
    success: [
      actions.specifyPetitionFile,
      actions.getDocumentId,
      {
        error: [set(state`alertError`, props`error`)],
        success: [
          actions.uploadDocumentToS3,
          {
            error: [set(state`alertError`, props`error`)],
            success: [
              actions.specifyRequestForPlaceOfTrial,
              actions.getDocumentId,
              {
                error: [set(state`alertError`, props`error`)],
                success: [
                  actions.uploadDocumentToS3,
                  {
                    error: [set(state`alertError`, props`error`)],
                    success: [
                      actions.specifyStatementOfTaxpayerIdentificationNumber,
                      actions.getDocumentId,
                      {
                        error: [set(state`alertError`, props`error`)],
                        success: [
                          actions.uploadDocumentToS3,
                          {
                            error: [set(state`alertError`, props`error`)],
                            success: [
                              set(state`submitting`, false),
                              set(
                                state`alertSuccess`,
                                'Your files were uploaded successfully.',
                              ),
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
