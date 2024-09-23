import {
  getCaseList,
  navigateTo as navigateToDashboard,
} from '../../../support/pages/dashboard-practitioner';
import { practitionerCreatesElectronicCase } from '../../../../helpers/fileAPetition/practitioner-creates-electronic-case';

describe('Start a case as a practitioner', () => {
  it('go to the practitioner dashboard, file a case, and expect case count to increment by one', () => {
    navigateToDashboard('privatePractitioner');

    getCaseList().then(cases => {
      practitionerCreatesElectronicCase();
      getCaseList().should('exist');
      getCaseList().should('have.length', cases.length + 1);
    });
  });
});
