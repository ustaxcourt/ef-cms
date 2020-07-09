import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkAddsOrderToCase } from './journey/petitionsClerkAddsOrderToCase';
import { petitionsClerkEditsDraftOrder } from './journey/petitionsClerkEditsDraftOrder';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsCaseDetailAfterAddingOrder } from './journey/petitionsClerkViewsCaseDetailAfterAddingOrder';
import { petitionsClerkViewsDocumentDetail } from './journey/petitionsClerkViewsDocumentDetail';
import { petitionsClerkViewsDraftDocuments } from './journey/petitionsClerkViewsDraftDocuments';
import { petitionsDeletesOrderFromCase } from './journey/petitionsDeletesOrderFromCase';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});

describe('Petitions Clerk Create Order Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsDashboard(test);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkViewsDraftDocuments(test);
  petitionsClerkAddsOrderToCase(test);
  petitionsClerkViewsCaseDetailAfterAddingOrder(test);
  petitionsClerkViewsDraftDocuments(test, 1);
  petitionsClerkEditsDraftOrder(test, {});
  petitionsClerkViewsDraftDocuments(test, 1);
  petitionsClerkViewsDocumentDetail(test);
  petitionsClerkEditsDraftOrder(test, {
    currentRichText: '<p>This is an edited test order.</p>',
    setRichText: '<p>This is a re-edited test order</p>',
  });
  petitionsDeletesOrderFromCase(test);
  petitionsClerkViewsDraftDocuments(test, 0);
});
