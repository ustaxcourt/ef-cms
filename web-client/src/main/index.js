import * as sequences from './sequences';

import uploadCasePdfs from '../useCases/uploadCasePdfs';
import createCase from '../useCases/createCase';
import getUser from '../useCases/getUser';
import getCases from '../useCases/getCases';
import getCaseDetail from '../useCases/getCaseDetail';

/**
 * Main Cerebral module
 */
export default {
  providers: {
    useCases: {
      uploadCasePdfs,
      createCase,
      getUser,
      getCases,
      getCaseDetail,
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
