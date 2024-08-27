import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import {
  loginAsDojPractitioner,
  loginAsIrsPractitioner,
  loginAsPetitioner,
} from '../../../../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCaseWithDeceasedSpouse } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';

describe('DOJ Practitioners - File First IRS Document', () => {
  before(() => {
    cy.task('toggleFeatureFlag', {
      flag: 'updated-petition-flow',
      flagValue: false,
    });

    cy.reload(true);
  });

  after(() => {
    cy.task('toggleFeatureFlag', {
      flag: 'updated-petition-flow',
      flagValue: true,
    });
  });

  it('should never display the "File First IRS Document" button if the user is DOJ Practitioner', () => {
    loginAsPetitioner();
    petitionerCreatesElectronicCaseWithDeceasedSpouse('John', 'Sally').then(
      docketNumber => {
        petitionsClerkServesPetition(docketNumber);

        loginAsIrsPractitioner('irsPractitioner2');
        externalUserSearchesDocketNumber(docketNumber);

        cy.get('[data-testid="docket-number-header"]').should('exist');
        cy.get('[data-testid="button-first-irs-document"]').should('exist');

        loginAsDojPractitioner();
        externalUserSearchesDocketNumber(docketNumber);

        cy.get('[data-testid="docket-number-header"]').should('exist');
        cy.get('[data-testid="button-first-irs-document"]').should('not.exist');
      },
    );
  });
});
