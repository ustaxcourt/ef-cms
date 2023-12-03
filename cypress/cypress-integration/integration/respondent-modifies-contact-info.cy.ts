import { loginAsPetitioner } from '../../helpers/auth/login-as-helpers';
import { petitionerCreatesEletronicCase } from '../../helpers/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../support/setup/petitionsclerk-serves-petition';
import { petitionsclerkAddsRespondentToCase } from '../../helpers/petitionsclerk-adds-respondent-to-case';
import { respondentModifiesContactInfo } from '../../helpers/respondent-modifies-contact-info';

const BAR_NUMBER = 'WN7777';
const USER = 'irspractitioner2';

describe('a repondent modifies their address', () => {
  it('should generate a notice of change address for all cases associated with the respondent', function () {
    loginAsPetitioner();
    petitionerCreatesEletronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      petitionsclerkAddsRespondentToCase(docketNumber, BAR_NUMBER);
      respondentModifiesContactInfo(USER).then(newAddress => {
        cy.login(USER, `case-detail/${docketNumber}`);
        cy.get('[data-testid="document-download-link-NCA"]').should('exist');
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('[data-testid="tab-parties"]').click();
        cy.get('[data-testid="respondent-counsel"]').click();
        cy.get('[data-testid="address1-line"]')
          .contains(`${newAddress}`)
          .should('exist');
      });
    });
  });

  it('should not generate a notice of change address for any cases with unserved petitions', function () {
    loginAsPetitioner();
    petitionerCreatesEletronicCase().then(docketNumber => {
      petitionsclerkAddsRespondentToCase(docketNumber, BAR_NUMBER);
      respondentModifiesContactInfo(USER);
      cy.login(USER, `case-detail/${docketNumber}`);
      cy.get('[data-testid="document-download-link-NCA"]').should('not.exist');
    });
  });
});
