import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import petitionsClerkAddsDocketEntryFromOrder from './journey/petitionsClerkAddsDocketEntryFromOrder';
import petitionsClerkCreateOrder from './journey/petitionsClerkCreateOrder';
import petitionsClerkServesOrder from './journey/petitionsClerkServesOrder';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});
test.draftOrders = [];

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  petitionerCreatesNewCase(test, fakeFile);

  loginAs(test, 'petitionsclerk');
  petitionsClerkCreateOrder(test);
  petitionsClerkAddsDocketEntryFromOrder(test);
  petitionsClerkServesOrder(test);
});
