import * as sequences from './sequences';

import createACaseProxy from '../../../isomorphic/src/useCases/createACaseProxy';
import createCase from '../useCases/createCase';
import getCaseDetail from '../useCases/getCaseDetail';
import getCases from '../useCases/getCases';
import getUser from '../useCases/getUser';
import getPetitionsClerkCaseList from '../useCases/getPetitionsClerkCaseList';
import updateCase from '../useCases/updateCase';
import uploadCasePdfs from '../useCases/uploadCasePdfs';

/**
 * Main Cerebral module
 */
export default {
  providers: {
    useCases: {
      createACaseProxy,
      createCase,
      getCaseDetail,
      getCases,
      getPetitionsClerkCaseList,
      getUser,
      updateCase,
      uploadCasePdfs,
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
      userId: '',
      // firstName: '',
      // lastName: '',
      // token: '',
      // role: '',
    },
    caseDetail: {},
    cases: [],
  },
};
