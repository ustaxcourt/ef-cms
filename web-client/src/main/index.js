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
      userId: 'petitionsclerk',
      firstName: 'P',
      lastName: 'Clerk',
      token: 'petitionsclerk',
      role: 'petitionsclerk',
    },
    caseDetail: {},
    cases: [],
  },
};
