import { fakeFile, setupTest } from './helpers';
import taxpayerChoosesCaseType from './journey/taxpayerChoosesCaseType';
import taxpayerChoosesProcedureType from './journey/taxpayerChoosesProcedureType';
import taxpayerCreatesNewCase from './journey/taxpayerCreatesNewCase';
import taxpayerEditsCasePrimaryContactAddress from './journey/taxpayerEditsCasePrimaryContactAddress';
import taxpayerEditsCasePrimaryContactAddressAndPhone from './journey/taxpayerEditsCasePrimaryContactAddressAndPhone';
import taxpayerEditsCasePrimaryContactPhone from './journey/taxpayerEditsCasePrimaryContactPhone';
import taxpayerEditsCaseSecondaryContactInformation from './journey/taxpayerEditsCaseSecondaryContactInformation';
import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerNavigatesToCreateCase from './journey/taxpayerCancelsCreateCase';
import taxpayerNavigatesToEditPrimaryContact from './journey/taxpayerNavigatesToEditPrimaryContact';
import taxpayerSignsOut from './journey/taxpayerSignsOut';
import taxpayerViewsCaseDetail from './journey/taxpayerViewsCaseDetail';
import taxpayerViewsDashboard from './journey/taxpayerViewsDashboard';

const test = setupTest();

describe('Modify Petitioner Contact Information', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  // valid primary contact modification
  taxpayerLogin(test);
  taxpayerNavigatesToCreateCase(test);
  taxpayerChoosesProcedureType(test, { procedureType: 'Regular' });
  taxpayerChoosesCaseType(test);
  taxpayerCreatesNewCase(test, fakeFile, { caseType: 'CDP (Lien/Levy)' });
  taxpayerViewsDashboard(test, { caseIndex: 2 });
  taxpayerViewsCaseDetail(test, { docketNumberSuffix: 'L' });
  taxpayerNavigatesToEditPrimaryContact(test);
  taxpayerEditsCasePrimaryContactAddress(test);
  taxpayerEditsCasePrimaryContactPhone(test);
  taxpayerEditsCasePrimaryContactAddressAndPhone(test);
  taxpayerSignsOut(test);

  // attempt to modify secondary contact information
  taxpayerLogin(test);
  taxpayerViewsDashboard(test, { caseIndex: 2 });
  taxpayerViewsCaseDetail(test, { docketNumberSuffix: 'L', documentCount: 5 });
  taxpayerEditsCaseSecondaryContactInformation(test);
  taxpayerSignsOut(test);
});
