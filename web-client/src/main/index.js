import * as sequences from './sequences';

import filePdfPetition from '../useCases/filePdfPetition';
import getUser from '../useCases/getUser';
import getCases from '../useCases/getCases';
import getCaseDetail from '../useCases/getCaseDetail';

/**
 * Main Cerebral module
 */
export default {
  providers: {
    useCases: {
      filePdfPetition,
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
      name: 'taxpayer',
    },
    caseDetail: {},
    cases: [],
  },
};
