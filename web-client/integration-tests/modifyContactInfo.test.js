import { fakeFile, setupTest } from './helpers';
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerEditsCasePrimaryContactAddress from './journey/petitionerEditsCasePrimaryContactAddress';
import petitionerEditsCasePrimaryContactAddressAndPhone from './journey/petitionerEditsCasePrimaryContactAddressAndPhone';
import petitionerEditsCasePrimaryContactPhone from './journey/petitionerEditsCasePrimaryContactPhone';
import petitionerEditsCaseSecondaryContactInformation from './journey/petitionerEditsCaseSecondaryContactInformation';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from './journey/petitionerCancelsCreateCase';
import petitionerNavigatesToEditPrimaryContact from './journey/petitionerNavigatesToEditPrimaryContact';
import petitionerSignsOut from './journey/petitionerSignsOut';
import petitionerViewsCaseDetail from './journey/petitionerViewsCaseDetail';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';

const test = setupTest();

describe('Modify Petitioner Contact Information', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  // valid primary contact modification
  petitionerLogin(test);
  petitionerNavigatesToCreateCase(test);
  petitionerChoosesProcedureType(test, { procedureType: 'Regular' });
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile, { caseType: 'CDP (Lien/Levy)' });
  petitionerViewsDashboard(test, { caseIndex: 2 });
  petitionerViewsCaseDetail(test, { docketNumberSuffix: 'L' });
  petitionerNavigatesToEditPrimaryContact(test);
  petitionerEditsCasePrimaryContactAddress(test);
  petitionerEditsCasePrimaryContactPhone(test);
  petitionerEditsCasePrimaryContactAddressAndPhone(test);
  petitionerSignsOut(test);

  // attempt to modify secondary contact information
  petitionerLogin(test);
  petitionerViewsDashboard(test, { caseIndex: 2 });
  petitionerViewsCaseDetail(test, {
    docketNumberSuffix: 'L',
    documentCount: 5,
  });
  petitionerEditsCaseSecondaryContactInformation(test);
  petitionerSignsOut(test);
});
