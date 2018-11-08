import * as sequences from './sequences';

import filePdfPetition from '../useCases/filePdfPetition';
import getUser from '../useCases/getUser';

/**
 * Main Cerebral module
 */
export default {
  providers: {
    useCases: {
      filePdfPetition,
      getUser,
    },
  },
  sequences,
  state: {
    currentPage: 'Home',
    usaBanner: {
      showDetails: false,
    },
    petition: {},
    form: {},
  },
};
