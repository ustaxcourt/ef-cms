import { petitionerCreatesACase } from '../support/setup/petitioner-creates-a-case';
import { petitionsClerkServesPetition } from '../support/setup/petitionsclerk-serves-petition';
import { petitionsclerkAddsRespondentToCase } from '../support/setup/petitionsclerk-adds-respondent-to-case';
import { respondentModifiesContactInfo } from '../support/setup/respondent-modifies-contact-info';

const BAR_NUMBER = 'WN7777';
const USER = 'irspractitioner2';

describe('a repondent modifies their address', () => {
  it('should generate a notice of change address for all cases associated with the respondent', function () {
    petitionerCreatesACase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      petitionsclerkAddsRespondentToCase(docketNumber, BAR_NUMBER);
      respondentModifiesContactInfo(USER).then(newAddress => {
        cy.login(USER, `case-detail/${docketNumber}`);
        cy.getByTestId('document-download-link-NCA').should('exist');
        cy.getByTestId('tab-case-information').click();
        cy.getByTestId('tab-parties').click();
        cy.getByTestId('respondent-counsel').click();
        cy.getByTestId('address1-line')
          .contains(`${newAddress}`)
          .should('exist');
      });
    });
  });

  it('should not generate a notice of change address for any cases with unserved petitions', function () {
    petitionerCreatesACase().then(docketNumber => {
      petitionsclerkAddsRespondentToCase(docketNumber, BAR_NUMBER);
      respondentModifiesContactInfo(USER);
      cy.login(USER, `case-detail/${docketNumber}`);
      cy.getByTestId('document-download-link-NCA').should('not.exist');
    });
  });
});
