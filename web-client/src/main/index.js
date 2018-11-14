import * as sequences from './sequences';

import createCase from '../useCases/createCase';
import getUser from '../useCases/getUser';
import getCases from '../useCases/getCases';
import getPetitionsClerkCaseList from '../useCases/getPetitionsClerkCaseList';
import getCaseDetail from '../useCases/getCaseDetail';
import updateCase from '../useCases/updateCase';

/**
 * Main Cerebral module
 */
export default {
  providers: {
    useCases: {
      createCase,
      getUser,
      getCases,
      getPetitionsClerkCaseList,
      getCaseDetail,
      updateCase,
    },
  },
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
      // name: '',
      name: 'petitionsclerk',
      role: 'petitionsclerk',
    },
    caseDetail: {},
    cases: [],
  },
};
