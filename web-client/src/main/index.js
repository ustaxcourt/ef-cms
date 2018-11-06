import * as providers from './providers';
import * as sequences from './sequences';

/**
 * Main Cerebral module
 */
export default {
  providers,
  sequences,
  state: {
    currentPage: 'Dashboard',
    usaBanner: {
      showDetails: false,
    },
    petition: {},
    form: {},
    caseDetail: {},
    cases: [
      {
        docketNumber: '110001-18',
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
        docketNumber: '007001-18',
        petitionerName: 'Muir, John',
        dateSubmitted: '09/18/2018',
        feeStatus: 'Paid',
      },
      {
        docketNumber: '08709-18',
        petitionerName: 'Madison, James',
        dateSubmitted: '07/31/2018',
        feeStatus: 'Unpaid',
      },
      {
        docketNumber: '117201-18',
        petitionerName: 'Truth, Sojourner',
        dateSubmitted: '03/28/2018',
        feeStatus: 'Paid',
      },
    ],
  },
};
