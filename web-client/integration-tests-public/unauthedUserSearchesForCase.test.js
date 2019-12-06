import { fakeFile, setupTest } from './helpers';

import { setupTest as setupTestClient } from '../integration-tests/helpers';

// Petitioner
import petitionerChoosesCaseType from '../integration-tests/journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from '../integration-tests/journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from '../integration-tests/journey/petitionerCreatesNewCase';
import petitionerLogin from '../integration-tests/journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from '../integration-tests/journey/petitionerCancelsCreateCase';
import userSignsOut from '../integration-tests/journey/petitionerSignsOut';

// Docket clerk
import docketClerkAddsDocketEntryFromOrderOfDismissal from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import docketClerkCreatesAnOrder from '../integration-tests/journey/docketClerkCreatesAnOrder';
import docketClerkLogIn from '../integration-tests/journey/docketClerkLogIn';
import docketClerkServesOrder from '../integration-tests/journey/docketClerkServesOrder';
import docketClerkSignsOut from '../integration-tests/journey/docketClerkSignsOut';

// Public User
import unauthedUserNavigatesToPublicSite from './journey/unauthedUserNavigatesToPublicSite';
import unauthedUserSearchesByDocketNumber from './journey/unauthedUserSearchesByDocketNumber';
import unauthedUserSearchesByMeta from './journey/unauthedUserSearchesByMeta';
import unauthedUserViewsCaseDetail from './journey/unauthedUserViewsCaseDetail';
import unauthedUserViewsPrintableDocketRecord from './journey/unauthedUserViewsPrintableDocketRecord';

const test = setupTest();
const testClient = setupTestClient();
testClient.draftOrders = [];

describe('Petitioner creates cases to search for', () => {
  petitionerLogin(testClient);
  petitionerNavigatesToCreateCase(testClient);
  petitionerChoosesProcedureType(testClient);
  petitionerChoosesCaseType(testClient);
  petitionerCreatesNewCase(testClient, fakeFile);
  userSignsOut(testClient);
});

describe('Docket clerk creates a draft order (should not be viewable to the public)', () => {
  docketClerkLogIn(testClient);
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOut(testClient);
});

describe('Docket clerk creates and serves an order (should be viewable to the public)', () => {
  docketClerkLogIn(testClient);
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkAddsDocketEntryFromOrderOfDismissal(testClient, 1);
  docketClerkServesOrder(testClient, 1);
  docketClerkSignsOut(testClient);
});

describe('Unauthed user searches for a case and views a case detail page', () => {
  unauthedUserNavigatesToPublicSite(test);
  unauthedUserSearchesByMeta(test);
  unauthedUserSearchesByDocketNumber(test, testClient);
  unauthedUserViewsCaseDetail(test);
  unauthedUserViewsPrintableDocketRecord(test);
});
