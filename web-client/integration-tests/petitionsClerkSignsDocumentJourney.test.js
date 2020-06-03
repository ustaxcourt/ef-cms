import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import petitionsClerkAddsOrderToCase from './journey/petitionsClerkAddsOrderToCase';
import petitionsClerkAppliesSignatureToDraftDocument from './journey/petitionsClerkAppliesSignatureToDraftDocument';
import petitionsClerkClearsSignatureFromDraftDocument from './journey/petitionsClerkClearsSignatureFromDraftDocument';
import petitionsClerkRemovesSignatureFromDraftDocument from './journey/petitionsClerkRemovesSignatureFromDraftDocument';
import petitionsClerkSavesSignatureForDraftDocument from './journey/petitionsClerkSavesSignatureForDraftDocument';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import petitionsClerkViewsCaseDetailAfterAddingOrder from './journey/petitionsClerkViewsCaseDetailAfterAddingOrder';
import petitionsClerkViewsDocumentDetail from './journey/petitionsClerkViewsDocumentDetail';
import petitionsClerkViewsDraftDocuments from './journey/petitionsClerkViewsDraftDocuments';
import petitionsClerkViewsSignDraftDocument from './journey/petitionsClerkViewsSignDraftDocument';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});

describe('Petitions Clerk Create Order Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    global.window.pdfjsObj = {
      getData: () => Promise.resolve(new Uint8Array(fakeFile)),
    };
  });

  loginAs(test, 'petitioner');
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsDashboard(test);

  loginAs(test, 'petitionsclerk');
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkViewsDraftDocuments(test);
  petitionsClerkAddsOrderToCase(test);
  petitionsClerkViewsCaseDetailAfterAddingOrder(test);
  petitionsClerkViewsDraftDocuments(test, 1);
  petitionsClerkViewsDocumentDetail(test);
  petitionsClerkViewsSignDraftDocument(test);
  petitionsClerkAppliesSignatureToDraftDocument(test);
  petitionsClerkClearsSignatureFromDraftDocument(test);
  petitionsClerkAppliesSignatureToDraftDocument(test);
  petitionsClerkSavesSignatureForDraftDocument(test);
  petitionsClerkViewsDocumentDetail(test);
  petitionsClerkRemovesSignatureFromDraftDocument(test);
});
