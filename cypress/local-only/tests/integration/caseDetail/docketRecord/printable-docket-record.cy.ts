import {
  createAndServeConsolidatedGroup,
  GroupInfoType,
} from '../../../../../helpers/fileAPetition/create-consolidated-case-group';
import {
  loginAsDocketClerk,
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../../helpers/authentication/login-as-helpers';
import { externalUserSearchesDocketNumber } from '../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { selectTypeaheadInput } from '../../../../../helpers/components/typeAhead/select-typeahead-input';
import { goToCase } from '../../../../../helpers/caseDetail/go-to-case';

function downloadAndParseDocketRecordPdf() {
  return cy
    .get('[data-testid="modal-button-confirm"]')
    .invoke('attr', 'href')
    .then(url => {
      return cy
        .request({
          encoding: 'binary',
          url,
        })
        .then(res => {
          const filePath = 'cypress/downloads/file.pdf';

          return cy.writeFile(filePath, res.body, 'binary').then(() => {
            return cy
              .readFile(filePath, { timeout: 15000 })
              .should('exist')
              .then(() => {
                return cy.task('parsePdf', { filePath });
              });
          });
        });
    });
}

describe('Printable docket record', () => {
  let groupInfo: GroupInfoType;

  before(() => {
    createAndServeConsolidatedGroup({
      numberOfMemberCases: 1,
      leadYearReceived: '2026',
      memberYearReceived: '2026',
    }).then(consolidatedGroupInfo => {
      groupInfo = consolidatedGroupInfo;

      loginAsPrivatePractitioner('privatePractitioner1@example.com');
      externalUserSearchesDocketNumber(groupInfo.leadDocketNumber);
      cy.get('[data-testid="request-represent-a-party-button"]').click();
      selectTypeaheadInput(
        'case-association-document-type-search',
        'Entry of Appearance',
      );
      cy.get('[data-testid^="filer-"]').click();
      cy.get('[data-testid="request-access-submit-document"]').click();
      cy.get('[data-testid="submit-represent-a-party-button"]').click();
      cy.get('[data-testid="document-download-link-EA"]').should('exist');

      loginAsPrivatePractitioner('privatePractitioner2@example.com');
      externalUserSearchesDocketNumber(groupInfo.memberDocketNumbers[0]);
      cy.get('[data-testid="request-represent-a-party-button"]').click();
      selectTypeaheadInput(
        'case-association-document-type-search',
        'Entry of Appearance',
      );
      cy.get('[data-testid^="filer-"]').click();
      cy.get('[data-testid="request-access-submit-document"]').click();
      cy.get('[data-testid="submit-represent-a-party-button"]').click();
      cy.get('[data-testid="document-download-link-EA"]').should('exist');

      loginAsDocketClerk();
      goToCase(groupInfo.leadDocketNumber);
      cy.get('[data-testid="tab-case-information"] > .button-text').click();
      cy.get('[data-testid="seal-case-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
    });
  });

  it('should let internal user view printable docket record and show contact information', () => {
    loginAsDocketClerk();
    goToCase(groupInfo.memberDocketNumbers[0]);
    cy.get('[data-testid="print-docket-record-button"]').click();
    cy.get('[data-testid="modal-header"]').should(
      'contain.text',
      'Printable Docket Record',
    );
    downloadAndParseDocketRecordPdf().then(text => {
      expect(text).to.include('some random street cleveland, TN 33333');
    });
    cy.get('[data-testid="modal-button-confirm"]').click();
  });

  it('should let directly associated user view printable docket record and show contact information', () => {
    loginAsPrivatePractitioner('privatePractitioner1@example.com');
    goToCase(groupInfo.memberDocketNumbers[0]);
    cy.get('[data-testid="print-docket-record-button"]').click();
    cy.get('[data-testid="modal-header"]').should(
      'contain.text',
      'Printable Docket Record',
    );
    downloadAndParseDocketRecordPdf().then(text => {
      expect(text).to.include('some random street cleveland, TN 33333');
    });
    cy.get('[data-testid="modal-button-confirm"]').click();
  });

  it('should let indirectly associated user view printable docket record and show contact information', () => {
    loginAsPrivatePractitioner('privatePractitioner2@example.com');
    goToCase(groupInfo.memberDocketNumbers[0]);
    cy.get('[data-testid="print-docket-record-button"]').click();
    cy.get('[data-testid="modal-header"]').should(
      'contain.text',
      'Printable Docket Record',
    );
    downloadAndParseDocketRecordPdf().then(text => {
      expect(text).to.include('some random street cleveland, TN 33333');
    });
    cy.get('[data-testid="modal-button-confirm"]').click();
  });

  it('should unassociated user view printable docket record and hide contact information', () => {
    loginAsPetitioner();
    goToCase(groupInfo.memberDocketNumbers[0]);
    cy.get('[data-testid="print-docket-record-button"]').click();
    cy.get('[data-testid="modal-header"]').should(
      'contain.text',
      'Printable Docket Record',
    );
    downloadAndParseDocketRecordPdf().then(text => {
      expect(text).to.not.include('some random street cleveland, TN 33333');
    });
    cy.get('[data-testid="modal-button-confirm"]').click();
  });

  it('should let internal user view printable docket record on sealed case', () => {
    loginAsDocketClerk();
    goToCase(groupInfo.leadDocketNumber);
    cy.get('[data-testid="print-docket-record-button"]').click();
    cy.get('[data-testid="modal-header"]').should(
      'contain.text',
      'Printable Docket Record',
    );
    downloadAndParseDocketRecordPdf().then(text => {
      expect(text).to.include('some random street cleveland, TN 33333');
    });
    cy.get('[data-testid="modal-button-confirm"]').click();
  });

  it('should let directly associated user view printable docket record on sealed case', () => {
    loginAsPrivatePractitioner('privatePractitioner1@example.com');
    goToCase(groupInfo.leadDocketNumber);
    cy.get('[data-testid="print-docket-record-button"]').click();
    cy.get('[data-testid="modal-header"]').should(
      'contain.text',
      'Printable Docket Record',
    );
    downloadAndParseDocketRecordPdf().then(text => {
      expect(text).to.include('some random street cleveland, TN 33333');
    });
    cy.get('[data-testid="modal-button-confirm"]').click();
  });

  it('should let indirectly associated user view printable docket record on sealed case', () => {
    loginAsPrivatePractitioner('privatePractitioner2@example.com');
    goToCase(groupInfo.leadDocketNumber);
    cy.get('[data-testid="print-docket-record-button"]').click();
    cy.get('[data-testid="modal-header"]').should(
      'contain.text',
      'Printable Docket Record',
    );
    downloadAndParseDocketRecordPdf().then(text => {
      expect(text).to.include('some random street cleveland, TN 33333');
    });
    cy.get('[data-testid="modal-button-confirm"]').click();
  });
});
