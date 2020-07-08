import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkAddsDocketEntryFromOrder } from './journey/petitionsClerkAddsDocketEntryFromOrder';
import { petitionsClerkAddsNoticeToCase } from './journey/petitionsClerkAddsNoticeToCase';
import { petitionsClerkAppliesSignatureToDraftDocument } from './journey/petitionsClerkAppliesSignatureToDraftDocument';
import { petitionsClerkSavesSignatureForDraftDocument } from './journey/petitionsClerkSavesSignatureForDraftDocument';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsCaseDetailAfterAddingNotice } from './journey/petitionsClerkViewsCaseDetailAfterAddingNotice';
import { petitionsClerkViewsDocumentDetail } from './journey/petitionsClerkViewsDocumentDetail';
import { petitionsClerkViewsDraftDocumentsForNotice } from './journey/petitionsClerkViewsDraftDocumentsForNotice';
import { petitionsClerkViewsSignDraftDocument } from './journey/petitionsClerkViewsSignDraftDocument';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});
describe('Petitions Clerk Create Notice Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    global.window.pdfjsObj = {
      getData: () => Promise.resolve(new Uint8Array(fakeFile)),
    };
  });

  loginAs(test, 'petitioner@example.com');
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsDashboard(test);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsNoticeToCase(test);
  petitionsClerkViewsCaseDetailAfterAddingNotice(test);
  petitionsClerkViewsSignDraftDocument(test);
  petitionsClerkAppliesSignatureToDraftDocument(test);
  petitionsClerkSavesSignatureForDraftDocument(
    test,
    'Notice to Need a Nap updated.',
  );
  petitionsClerkViewsDraftDocumentsForNotice(test, 1);
  petitionsClerkViewsDocumentDetail(test);
  petitionsClerkAddsDocketEntryFromOrder(test);
});
