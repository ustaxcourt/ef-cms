import * as sequences from './sequences';

import filePdfPetition from '../useCases/filePdfPetition';
import getUser from '../useCases/getUser';
import getCases from '../useCases/getCases';

/**
 * Main Cerebral module
 */
export default {
  providers: {
    useCases: {
      filePdfPetition,
      getUser,
      getCases,
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
