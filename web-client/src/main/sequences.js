import { set, toggle } from 'cerebral/factories';
import { state, props } from 'cerebral';
import * as actions from './actions';

import { route } from '../router';

export const gotoHome = [set(state`currentPage`, 'Home')];
export const gotoLogIn = [set(state`currentPage`, 'LogIn')];
export const gotoFilePetition = [set(state`currentPage`, 'FilePetition')];
export const gotoStyleGuide = [set(state`currentPage`, 'StyleGuide')];

export const toggleUsaBannerDetails = [toggle(state`usaBanner.showDetails`)];

export const updatePetitionValue = [
  set(state`petition.${props`key`}.file`, props`file`),
  actions.updatePetition,
  set(state`petition`, props.petition),
];

export const submitFilePetition = [
  // TODO: parallelize this
  set(state`submitting`, true),
  actions.getDocumentPolicy,
  {
    success: [
      actions.specifyPetitionFile,
      actions.getDocumentId,
      {
        success: [
          actions.uploadDocumentToS3,
          {
            success: [
              set(state`documentType`, 'requestForPlaceOfTrial'),
              actions.getDocumentId,
              {
                success: [
                  actions.uploadDocumentToS3,
                  {
                    success: [
                      set(
                        state`documentType`,
                        'statementOfTaxpayerIdentificationNumber',
                      ),
                      actions.getDocumentId,
                      {
                        success: [
                          actions.uploadDocumentToS3,
                          {
                            success: [
                              set(state`submitting`, false),
                              set(
                                state`alertSuccess`,
                                'Your files were uploaded successfully.',
                              ),
                              route('/'),
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
    error: [set(state`alertError`, 'Document policy retrieval failed')],
  },
];
