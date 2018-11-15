import * as sequences from './sequences';

import uploadCasePdfs from '../useCases/uploadCasePdfs';
import createCase from '../useCases/createCase';
import getCaseDetail from '../useCases/getCaseDetail';
import getCases from '../useCases/getCases';
import getPetitionsClerkCaseList from '../useCases/getPetitionsClerkCaseList';
import getCaseDetail from '../useCases/getCaseDetail';
import createACaseProxy from '../../../isomorphic/src/useCases/createACaseProxy';
import updateCase from '../useCases/updateCase';
import uploadCasePdfs from '../useCases/uploadCasePdfs.js';

/**
 * Main Cerebral module
 */
export default {
  providers: {
    useCases: {
      uploadCasePdfs,
      createCase,
      getCaseDetail,
      getCases,
      getPetitionsClerkCaseList,
      getCaseDetail,
      createACaseProxy,
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
      name: '',
      // name: 'taxpayer',
      // role: 'taxpayer',
    },
    caseDetail: {},
    cases: [],
  },
};
