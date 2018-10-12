import * as sequences from './sequences';
import * as providers from './providers';

/**
 * Main Cerebral module
 */
export default {
  state: {
    response: 'Silence!',
    usaBanner: {
      showDetails: false,
    },
  },
  sequences,
  providers,
};
