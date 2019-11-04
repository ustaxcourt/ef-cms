import { fakeFile, setupTest } from './helpers';
import petitionsClerkAddsOrderToCase from './journey/petitionsClerkAddsOrderToCase';
import petitionsClerkEditsDraftOrder from './journey/petitionsClerkEditsDraftOrder';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSignsOut from './journey/petitionsClerkSignsOut';
import petitionsClerkViewsCaseDetail from './journey/petitionsClerkViewsCaseDetail';
import petitionsClerkViewsCaseDetailAfterAddingOrder from './journey/petitionsClerkViewsCaseDetailAfterAddingOrder';
import petitionsClerkViewsDocumentDetail from './journey/petitionsClerkViewsDocumentDetail';
import petitionsClerkViewsDraftDocuments from './journey/petitionsClerkViewsDraftDocuments';
import petitionsDeletesOrderFromCase from './journey/petitionsDeletesOrderFromCase';
import taxPayerSignsOut from './journey/taxpayerSignsOut';
import taxpayerChoosesCaseType from './journey/taxpayerChoosesCaseType';
import taxpayerChoosesProcedureType from './journey/taxpayerChoosesProcedureType';
import taxpayerCreatesNewCase from './journey/taxpayerCreatesNewCase';
import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerNavigatesToCreateCase from './journey/taxpayerCancelsCreateCase';
import taxpayerViewsDashboard from './journey/taxpayerViewsDashboard';

const test = setupTest();

describe('Petitions Clerk Create Order Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  taxpayerLogin(test);
  taxpayerNavigatesToCreateCase(test);
  taxpayerChoosesProcedureType(test);
  taxpayerChoosesCaseType(test);
  taxpayerCreatesNewCase(test, fakeFile);
  taxpayerViewsDashboard(test);
  taxPayerSignsOut(test);

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
