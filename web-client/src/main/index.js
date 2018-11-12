import * as sequences from './sequences';

import filePdfPetition from '../useCases/filePdfPetition';
import getUser from '../useCases/getUser';
import getCases from '../useCases/getCases';

/**
 * Main Cerebral module
 */
export default {
  providers: {
    useCases: {
      filePdfPetition,
      getUser,
      getCases,
    },
  },
  sequences,
  state: {
    currentPage: 'Dashboard',
    usaBanner: {
      showDetails: false,
    },
    petition: {},
    form: {},
    user: {
      name: 'taxpayer',
    },
    caseDetail: {},
    cases: [
      {
        docketNumber: '110001-18',
        caseId: 'ada45247-b749-4f09-810a-bbae3be36c17',
        petitionerName: 'Roosevelt, Eleanor',
        dateSubmitted: '10/21/2018',
        feeStatus: 'Unpaid',
        activitiesEmpty: [],
        activities: [
          {
            dateSubmitted: '10/21/2018',
            filingsAndProceedings: 'Petition form',
            dateServed: '',
          },
          {
            dateSubmitted: '10/03/2018',
            filingsAndProceedings:
              'Statement of taxpayer identification number',
            dateServed: '',
          },
          {
            dateSubmitted: '9/29/2018',
            filingsAndProceedings: 'Request for place of trial',
            dateServed: '',
          },
        ],
      },
      {
        caseId: 'ae2ad220-dd51-42e8-babf-bec31840ff27',
        docketNumber: '007001-18',
        petitionerName: 'Muir, John',
        dateSubmitted: '09/18/2018',
        feeStatus: 'Paid',
      },
      {
        caseId: '57c70ec3-ab3f-4e9c-95b4-058cd54b516c',
        docketNumber: '08709-18',
        petitionerName: 'Madison, James',
        dateSubmitted: '07/31/2018',
        feeStatus: 'Unpaid',
      },
      {
        caseId: '73b7a3e1-bfe8-459c-bf5f-7cf93187d308',
        docketNumber: '117201-18',
        petitionerName: 'Truth, Sojourner',
        dateSubmitted: '03/28/2018',
        feeStatus: 'Paid',
      },
    ],
  },
};
