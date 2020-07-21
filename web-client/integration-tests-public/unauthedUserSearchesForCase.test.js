import { fakeFile, setupTest } from './helpers';

import {
  loginAs,
  setupTest as setupTestClient,
} from '../integration-tests/helpers';

// Petitioner
import { petitionerCancelsCreateCase } from '../integration-tests/journey/petitionerCancelsCreateCase';
import { petitionerChoosesCaseType } from '../integration-tests/journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from '../integration-tests/journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from '../integration-tests/journey/petitionerCreatesNewCase';

// Docket clerk
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkAddsTranscriptDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsTranscriptDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocument } from '../integration-tests/journey/docketClerkServesDocument';

// Public User
import { docketClerkSignsOrder } from '../integration-tests/journey/docketClerkSignsOrder';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesByDocketNumber } from './journey/unauthedUserSearchesByDocketNumber';
import { unauthedUserSearchesByMeta } from './journey/unauthedUserSearchesByMeta';
import { unauthedUserViewsCaseDetail } from './journey/unauthedUserViewsCaseDetail';
import { unauthedUserViewsPrintableDocketRecord } from './journey/unauthedUserViewsPrintableDocketRecord';

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
  jest.setTimeout(10000);
  loginAs(testClient, 'petitioner@example.com');
  petitionerCancelsCreateCase(testClient);
  petitionerChoosesProcedureType(testClient);
  petitionerChoosesCaseType(testClient);
  petitionerCreatesNewCase(testClient, fakeFile);
});

describe('Docket clerk creates a draft order (should not be viewable to the public)', () => {
  loginAs(testClient, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
});

describe('Docket clerk creates and serves an order (should be viewable to the public)', () => {
  beforeAll(() => {
    global.window.pdfjsObj = {
      getData: () => Promise.resolve(new Uint8Array(fakeFile)),
    };
  });
  loginAs(testClient, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkSignsOrder(testClient, 1);
  docketClerkAddsDocketEntryFromOrderOfDismissal(testClient, 1);
  docketClerkServesDocument(testClient, 1);
});

describe('Docket clerk creates and serves a transcript (should not be viewable to the public)', () => {
  loginAs(testClient, 'docketclerk@example.com');
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
  docketClerkServesDocument(testClient, 2);
});

describe('Unauthed user searches for a case and views a case detail page', () => {
  unauthedUserNavigatesToPublicSite(test);
  unauthedUserSearchesByMeta(test);
  unauthedUserSearchesByDocketNumber(test, testClient);
  unauthedUserViewsCaseDetail(test);
  unauthedUserViewsPrintableDocketRecord(test);
});
