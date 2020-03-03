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
import docketClerkAddsTranscriptDocketEntryFromOrder from '../integration-tests/journey/docketClerkAddsTranscriptDocketEntryFromOrder';
import unauthedUserNavigatesToPublicSite from './journey/unauthedUserNavigatesToPublicSite';
import unauthedUserSearchesByDocketNumber from './journey/unauthedUserSearchesByDocketNumber';
import unauthedUserSearchesByMeta from './journey/unauthedUserSearchesByMeta';
import unauthedUserViewsCaseDetail from './journey/unauthedUserViewsCaseDetail';
import unauthedUserViewsPrintableDocketRecord from './journey/unauthedUserViewsPrintableDocketRecord';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});
const testClient = setupTestClient({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});
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

describe('Docket clerk creates and serves a transcript (should not be viewable to the public)', () => {
  docketClerkLogIn(testClient);
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkAddsTranscriptDocketEntryFromOrder(testClient, 2, {
    day: '01',
    month: '01',
    year: '2019',
  });
  docketClerkServesOrder(testClient, 2);
  docketClerkSignsOut(testClient);
});

describe('Unauthed user searches for a case and views a case detail page', () => {
  unauthedUserNavigatesToPublicSite(test);
  unauthedUserSearchesByMeta(test);
  unauthedUserSearchesByDocketNumber(test, testClient);
  unauthedUserViewsCaseDetail(test);
  unauthedUserViewsPrintableDocketRecord(test);
});
