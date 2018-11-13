import * as sequences from './sequences';

import createCase from '../useCases/createCase';
import getUser from '../useCases/getUser';
import getCases from '../useCases/getCases';
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
      getCaseDetail,
      updateCase,
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
      name: '',
    },
    caseDetail: {},
    cases: [],
  },
};
