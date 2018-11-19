import * as sequences from './sequences';

import createACase from '../../../business/src/useCases/createACaseProxy';
import getCaseDetail from '../useCases/getCaseDetail';
import getCases from '../useCases/getCases';
import getPetitionsClerkCaseList from '../useCases/getPetitionsClerkCaseList';
import getUser from '../../../business/src/useCases/getUser';
import updateCase from '../useCases/updateCase';
import uploadCasePdfs from '../useCases/uploadCasePdfs';

/**
 * Main Cerebral module
 */
export default {
  providers: {
    useCases: {
      createACase,
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
