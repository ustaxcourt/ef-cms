import { loginAsPrivatePractitioner } from 'cypress/helpers/authentication/login-as-helpers';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { getCaseList } from '../../../support/pages/dashboard-practitioner';

describe('Start a case as a practitioner', () => {
  it('go to the practitioner dashboard, file a case, and expect case count to increment by one', () => {
    loginAsPrivatePractitioner('privatePractitioner@example.com');

    getCaseList().then(cases => {
      externalUserCreatesElectronicCase();
      getCaseList().should('exist');
      getCaseList().should('have.length', cases.length + 1);
    });
  });
});
