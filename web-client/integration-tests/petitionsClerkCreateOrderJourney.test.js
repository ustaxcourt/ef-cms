import { fakeFile, setupTest } from './helpers';
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from './journey/petitionerCancelsCreateCase';
import petitionerSignsOut from './journey/petitionerSignsOut';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';
import petitionsClerkAddsOrderToCase from './journey/petitionsClerkAddsOrderToCase';
import petitionsClerkEditsDraftOrder from './journey/petitionsClerkEditsDraftOrder';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSignsOut from './journey/petitionsClerkSignsOut';
import petitionsClerkViewsCaseDetail from './journey/petitionsClerkViewsCaseDetail';
import petitionsClerkViewsCaseDetailAfterAddingOrder from './journey/petitionsClerkViewsCaseDetailAfterAddingOrder';
import petitionsClerkViewsDocumentDetail from './journey/petitionsClerkViewsDocumentDetail';
import petitionsClerkViewsDraftDocuments from './journey/petitionsClerkViewsDraftDocuments';
import petitionsDeletesOrderFromCase from './journey/petitionsDeletesOrderFromCase';

const test = setupTest();

describe('Petitions Clerk Create Order Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  petitionerLogin(test);
  petitionerNavigatesToCreateCase(test);
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsDashboard(test);
  petitionerSignsOut(test);

  petitionsClerkLogIn(test);
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkViewsDraftDocuments(test);
  petitionsClerkAddsOrderToCase(test);
  petitionsClerkViewsCaseDetailAfterAddingOrder(test);
  petitionsClerkViewsDraftDocuments(test, 1);
  petitionsClerkEditsDraftOrder(test, {
    viewAfterEdit: 'CaseDetail',
  });
  petitionsClerkViewsDraftDocuments(test, 1);
  petitionsClerkViewsDocumentDetail(test);
  petitionsClerkEditsDraftOrder(test, {
    currentRichText: '<p>This is an edited test order.</p>',
    setRichText: '<p>This is a re-edited test order</p>',
    viewAfterEdit: 'DocumentDetail',
  });
  petitionsDeletesOrderFromCase(test);
  petitionsClerkViewsDraftDocuments(test, 0);
  petitionsClerkSignsOut(test);
});
