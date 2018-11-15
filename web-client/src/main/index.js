import * as sequences from './sequences';

import createCase from '../useCases/createCase';
import getCaseDetail from '../useCases/getCaseDetail';
import getCases from '../useCases/getCases';
import getPetitionsClerkCaseList from '../useCases/getPetitionsClerkCaseList';
import getUser from '../useCases/getUser';
import updateCase from '../useCases/updateCase';
import uploadCasePdfs from '../useCases/uploadCasePdfs.js';

/**
 * Main Cerebral module
 */
export default {
  providers: {
    useCases: {
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
      // name: '',
      name: 'taxpayer',
      role: 'taxpayer',
    },
    caseDetail: {},
    cases: [],
  },
};
