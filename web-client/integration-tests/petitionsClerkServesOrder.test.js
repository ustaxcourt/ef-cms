import { fakeFile, setupTest } from './helpers';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerSignsOut from './journey/petitionerSignsOut';
import petitionsClerkAddsDocketEntryFromOrder from './journey/petitionsClerkAddsDocketEntryFromOrder';
import petitionsClerkCreateOrder from './journey/petitionsClerkCreateOrder';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkServesOrder from './journey/petitionsClerkServesOrder';

const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  petitionerLogin(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerSignsOut(test);
  petitionsClerkLogIn(test);
  petitionsClerkCreateOrder(test);
  petitionsClerkAddsDocketEntryFromOrder(test);
  petitionsClerkServesOrder(test);
});
