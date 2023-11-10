import { petitionerCreatesACase } from '../support/setup/petitioner-creates-a-case';
import { petitionsClerkServesPetition } from '../support/setup/petitionsclerk-serves-petition';
import { petitionsclerkAddsRespondentToCase } from '../support/setup/petitionsclerk-adds-respondent-to-case';
import { respondentModifiesContactInfo } from '../support/setup/respondent-modifies-contact-info';

const BAR_NUMBER = 'WN7777';
const USER = 'irspractitioner2';

describe('a repondent modifies their address', () => {
  it('should generate a notice of change address for all cases associated with the respondent', function () {
    petitionerCreatesACase();
    petitionsClerkServesPetition();
    petitionsclerkAddsRespondentToCase(BAR_NUMBER);
    respondentModifiesContactInfo(USER);

    cy.get('@docketNumber').then(docketNumber => {
      cy.login(USER, `case-detail/${docketNumber}`);
    });

    cy.get('button').contains('Notice of Change of Address').should('exist');
    cy.get('button').contains('Case Information').click();
    cy.get('button').contains('Parties').click();
    cy.get('button').contains('Respondent Counsel').click();
    cy.get('@contactAddress').then(newAddress => {
      cy.get('span').contains(`${newAddress}`).should('exist');
    });
  });

  it('should not generate a notice of change address for any cases with unserved petitions', function () {
    petitionerCreatesACase();
    petitionsclerkAddsRespondentToCase(BAR_NUMBER);
    respondentModifiesContactInfo(USER);

    cy.get('@docketNumber').then(docketNumber => {
      cy.login(USER, `case-detail/${docketNumber}`);
    });

    cy.get('button')
      .contains('Notice of Change of Address for Test IRS Practitioner')
      .should('not.exist');
  });
});
