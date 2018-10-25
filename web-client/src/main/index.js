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
    user: 'Tina Taxpayer',
    usaBanner: {
      showDetails: false,
    },
    petition: {
      petitionFile: '',
      requestForPlaceOfTrial: '',
      statementOfTaxpayerIdentificationNumber: '',
    },
  },
};
