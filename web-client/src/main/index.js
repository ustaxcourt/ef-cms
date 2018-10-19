import * as providers from './providers';
import * as sequences from './sequences';

/**
 * Main Cerebral module
 */
export default {
  providers,
  sequences,
  state: {
    currentPage: 'Home',
    response: 'Silence!',
    usaBanner: {
      showDetails: false,
    },
  },
};
