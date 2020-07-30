import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionsClerkAddsDocketEntryFromOrder } from './journey/petitionsClerkAddsDocketEntryFromOrder';
import { petitionsClerkCreateOrder } from './journey/petitionsClerkCreateOrder';
import { petitionsClerkServesOrder } from './journey/petitionsClerkServesOrder';
import { petitionsClerkSignsOrder } from './journey/petitionsClerkSignsOrder';

const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  petitionerCreatesNewCase(test, fakeFile);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreateOrder(test);
  petitionsClerkSignsOrder(test);
  petitionsClerkAddsDocketEntryFromOrder(test);
  petitionsClerkServesOrder(test);
});
