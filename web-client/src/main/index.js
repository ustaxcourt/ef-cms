import * as sequences from './sequences';

/**
 * Main Cerebral module
 */
export default {
  providers: {},
  sequences,
  state: {
    currentPage: 'Loading',
    usaBanner: {
      showDetails: false,
    },
    paymentInfo: {
      showDetails: false,
    },
    petition: {},
    form: {},
    user: {
      userId: 'taxpayer',
      firstName: 'Tax',
      lastName: 'Payer',
      token: 'taxpayer',
      role: 'taxpayer',
    },
    caseDetail: {},
    cases: [],
  },
};
