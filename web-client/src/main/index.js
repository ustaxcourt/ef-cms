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
    cases: [
      {
        docketNumber: '11001001-18',
        petitionerName: 'Picard, Jean Luc',
        dateSubmitted: '2008-10-10',
        feeStatus: 'Unpaid',
      },
      {
        docketNumber: '000001-18',
        petitionerName: 'Sorenson, Eric',
        dateSubmitted: '2018-04-10',
        feeStatus: 'Paid',
      },
      {
        docketNumber: '0871001-18',
        petitionerName: 'Jackson, Samuel',
        dateSubmitted: '2003-02-22',
        feeStatus: 'Unpaid',
      },
      {
        docketNumber: '11777001-18',
        petitionerName: 'Shrek',
        dateSubmitted: '2008-12-10',
        feeStatus: 'Paid',
      },
    ],
  },
};
