import * as sequences from './sequences';

import createCase from '../useCases/createCase';
import getUser from '../useCases/getUser';
import getCases from '../useCases/getCases';
import getPetitionsClerkCaseList from '../useCases/getPetitionsClerkCaseList';
import getCaseDetail from '../useCases/getCaseDetail';

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
    },
  },
  sequences,
  state: {
    currentPage: 'Loading',
    usaBanner: {
      showDetails: false,
    },
    petition: {},
    form: {},
    user: {
      name: '',
      // name: 'petitionsclerk',
      // role: 'petitionsclerk',
    },
    caseDetail: {},
    cases: [],
  },
};
