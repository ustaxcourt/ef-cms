import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import {
  getCaseList,
  navigateTo as navigateToDashboard,
} from '../../../support/pages/dashboard-practitioner';

describe('Start a case as a practitioner', () => {
  it('go to the practitioner dashboard, file a case, and expect case count to increment by one', () => {
    navigateToDashboard('privatePractitioner');

    getCaseList().then(cases => {
      externalUserCreatesElectronicCase();
      getCaseList().should('exist');
      getCaseList().should('have.length', cases.length + 1);
    });
  });
});
