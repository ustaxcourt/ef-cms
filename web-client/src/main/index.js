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
      userId: '',
      // userId: 'petitionsclerk',
      // firstName: 'petitionsclerk',
      // lastName: 'petitionsclerk',
      // token: 'petitionsclerk',
      // role: 'petitionsclerk',
    },
    caseDetail: {},
    cases: [],
  },
};
