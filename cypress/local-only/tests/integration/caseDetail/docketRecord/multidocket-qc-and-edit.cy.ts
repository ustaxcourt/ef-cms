import {
  loginAsDocketClerk1,
  loginAsCaseServicesSupervisor,
  loginAsPrivatePractitioner,
  loginAsColvin,
} from '../../../../../helpers/authentication/login-as-helpers';
import { goToCase } from '../../../../../helpers/caseDetail/go-to-case';
import { attachFile } from '../../../../../helpers/file/upload-file';
import { selectTypeaheadInput } from '../../../../../helpers/components/typeAhead/select-typeahead-input';
import { createAndServeConsolidatedGroup } from '../../../../../helpers/fileAPetition/create-consolidated-case-group';
import { externalUserSearchesDocketNumber } from '../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';

// Each describe block relies on the previous one having been run

describe('Multidocket QC Process and Edit Docket Entry', () => {
  let consolidatedGroupInfo: {
    leadDocketNumber: string;
    memberDocketNumbers: string[];
  };

  before(() => {
    createAndServeConsolidatedGroup({
      numberOfMemberCases: 1,
      leadCaseJudge: 'Colvin',
      memberCaseJudge: 'Colvin',
      caseStatus: CASE_STATUS_TYPES.submitted,
    }).then(groupInfo => {
      consolidatedGroupInfo = groupInfo;
      cy.wrap(consolidatedGroupInfo).as('CONSOLIDATED_GROUP_INFO');

      loginAsDocketClerk1();
      goToCase(consolidatedGroupInfo.memberDocketNumbers[0]);
      updateCaseStatus(CASE_STATUS_TYPES.submitted, 'Ashford');

      loginAsPrivatePractitioner('privatePractitioner1@example.com');
      externalUserSearchesDocketNumber(consolidatedGroupInfo.leadDocketNumber);

      cy.get('[data-testid="request-represent-a-party-button"]').click();

      selectTypeaheadInput(
        'case-association-document-type-search',
        'Entry of Appearance',
      );

      cy.get('[data-testid^="filer-"]').first().click();

      cy.get('[data-testid="auto-generation"]').should('exist');
      cy.get('[data-testid="request-access-submit-document"]').click();

      cy.get('[data-testid="entry-of-appearance-pdf-preview"]').should('exist');
      cy.get('[data-testid="submit-represent-a-party-button"]').click();

      cy.get('[data-testid="success-alert"]').should('exist');

      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();

      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Administrative Record',
      );

      cy.get('[data-testid="submit-document"]').click();

      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });

      cy.get('[data-testid="party-irs-practitioner-label"]').click();

      cy.get('[data-testid="file-document-submit-document"]').click();

      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="success-alert"]').should('exist');
    });
  });

  describe('QC Process', () => {
    it('should create docket entries on all cases in the consolidated group', () => {
      loginAsDocketClerk1();

      goToCase(consolidatedGroupInfo.leadDocketNumber);
      cy.get('[data-testid="document-viewer-link-ADMR"]').should('exist');

      consolidatedGroupInfo.memberDocketNumbers.forEach(memberDocketNumber => {
        goToCase(memberDocketNumber);
        cy.get('[data-testid="document-viewer-link-ADMR"]').should('exist');
      });
    });

    it('should display only one QC work item with lead case icon stacked on top of member case icons', () => {
      loginAsCaseServicesSupervisor('caseServicesSupervisor1@example.com');
      cy.visit('/document-qc/section/inbox/selectedSection?section=docket');

      cy.get(
        `[data-testid="work-item-${consolidatedGroupInfo.leadDocketNumber}"]`,
      )
        .filter(':contains("Administrative Record")')
        .should('exist');

      consolidatedGroupInfo.memberDocketNumbers.forEach(memberDocketNumber => {
        cy.get(`[data-testid="work-item-${memberDocketNumber}"]`).should(
          'not.exist',
        );
      });

      cy.get('tr')
        .filter(
          `:has(a:contains(${consolidatedGroupInfo.leadDocketNumber})):has(a:contains(${consolidatedGroupInfo.memberDocketNumbers[0]}))`,
        )
        .should('have.length', 1);
    });

    it('should display correct number of stacked icons for consolidated cases in judge QC inbox', () => {
      loginAsColvin();
      cy.visit('/document-qc/section/inbox');

      cy.get(
        `[data-testid="work-item-${consolidatedGroupInfo.leadDocketNumber}"]`,
      )
        .filter(':contains("Administrative Record")')
        .should('exist');

      cy.get('tr')
        .filter(
          `:has(a:contains(${consolidatedGroupInfo.leadDocketNumber})):has(a:contains(${consolidatedGroupInfo.memberDocketNumbers[0]}))`,
        )
        .should('have.length', 1);
    });

    it('should display the QC work item across section and individual QC views', () => {
      loginAsCaseServicesSupervisor('caseServicesSupervisor1@example.com');

      cy.visit('/document-qc/section/inbox/selectedSection?section=docket');
      cy.get(
        `[data-testid="work-item-${consolidatedGroupInfo.leadDocketNumber}"]`,
      ).should('exist');

      cy.get(
        `[data-testid="work-item-${consolidatedGroupInfo.leadDocketNumber}"]`,
      )
        .filter(':contains("Administrative Record")')
        .find('[data-testid="checkbox-assign-work-item"]')
        .click();
      cy.get('[data-testid="dropdown-select-assignee"]').select(
        'Test caseServicesSupervisor1',
      );

      cy.visit('/document-qc/my/inbox');
      cy.get('[data-testid="case-link"]')
        .contains(consolidatedGroupInfo.leadDocketNumber)
        .should('have.length', 1);
      cy.contains('a', 'Administrative Record').should('exist');
    });

    it('should show needs QC star on all docket entries in the consolidated group', () => {
      loginAsDocketClerk1();

      goToCase(consolidatedGroupInfo.leadDocketNumber);
      cy.get('svg.fa-star.fa-icon-red').should('have.length.greaterThan', 0);

      consolidatedGroupInfo.memberDocketNumbers.forEach(memberDocketNumber => {
        goToCase(memberDocketNumber);
        cy.get('svg.fa-star.fa-icon-red').should('have.length.greaterThan', 0);
      });
    });

    it('should NOT display Complete QC link on member cases when document needs QC', () => {
      loginAsDocketClerk1();

      consolidatedGroupInfo.memberDocketNumbers.forEach(memberDocketNumber => {
        goToCase(memberDocketNumber);

        cy.get('[data-testid="complete-qc-button"]').should('not.exist');
      });
    });

    it('should complete QC on all docket entries in all cases of the consolidated group when completing QC on lead case', () => {
      loginAsCaseServicesSupervisor('caseServicesSupervisor1@example.com');
      cy.visit('/document-qc/section/inbox/selectedSection?section=docket');

      cy.get(
        `[data-testid="work-item-document-link-${consolidatedGroupInfo.leadDocketNumber}"]`,
      )
        .contains('Administrative Record')
        .click();

      cy.get('[data-testid="alert-info-document-qc"]').should('exist');

      cy.get('[data-testid="alert-info-document-qc"]').should(
        'contain',
        "This document will also be QC'd for all consolidated cases.",
      );
      cy.get('[data-testid="alert-info-document-qc"]').should(
        'contain',
        'If a Notice of Docket Change is generated, it will be filed in all cases in the group.',
      );

      cy.get('[data-testid="additional-info-primary-document-form"]').type(
        'Something Absurd',
      );

      cy.get('#save-and-finish').click();

      cy.get('[data-testid="success-alert"]').should('contain', 'QC Completed');

      loginAsDocketClerk1();
      goToCase(consolidatedGroupInfo.leadDocketNumber);
      cy.get('[data-testid="document-viewer-link-ADMR"]')
        .closest('tr')
        .find('.filing-type-icon')
        .should('be.empty');

      cy.get('[data-testid="document-viewer-link-NODC"]').should('exist');

      consolidatedGroupInfo.memberDocketNumbers.forEach(memberDocketNumber => {
        goToCase(memberDocketNumber);
        cy.get('[data-testid="document-viewer-link-ADMR"]')
          .closest('tr')
          .find('.filing-type-icon')
          .should('be.empty');
        cy.get('[data-testid="document-viewer-link-NODC"]').should('exist');
      });
    });
  });

  describe('Edit Docket Entry Process', () => {
    describe('Lead Case', () => {
      it('should allow editing a multidocketed docket entry in the lead case and display help text', () => {
        loginAsDocketClerk1();
        goToCase(consolidatedGroupInfo.leadDocketNumber);

        cy.get('[data-testid="edit-ADMR"]').click();

        cy.get('[data-testid="alert-info-edit-docket-entry"]').should('exist');
        cy.get('[data-testid="alert-info-edit-docket-entry"]').should(
          'contain',
          'Edits to Document Info will also be edited for:',
        );
        cy.get('[data-testid="alert-info-edit-docket-entry"]').should(
          'contain',
          'Service and Action edits will only apply to this case.',
        );

        cy.get('#document-type').should('exist');
        cy.get('#document-type').should(
          'not.have.class',
          'select-react-element--is-disabled',
        );
      });

      it('should propagate document edits from lead case to all member cases', () => {
        loginAsDocketClerk1();
        goToCase(consolidatedGroupInfo.leadDocketNumber);

        cy.get('[data-testid="edit-ADMR"]').click();

        cy.get('#document-type').click();
        cy.get('#document-type').type('Status Report{enter}');

        cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
        cy.get('[data-testid="success-alert"]').should('exist');

        goToCase(consolidatedGroupInfo.leadDocketNumber);
        cy.get('[data-testid="document-viewer-link-RPT"]').should('exist');

        consolidatedGroupInfo.memberDocketNumbers.forEach(
          memberDocketNumber => {
            goToCase(memberDocketNumber);
            cy.get('[data-testid="document-viewer-link-RPT"]').should('exist');
          },
        );
      });
    });

    describe('Member Case', () => {
      it('should allow editing a multidocketed docket entry in a member case and display help text', () => {
        loginAsDocketClerk1();
        goToCase(consolidatedGroupInfo.memberDocketNumbers[0]);

        cy.get('[data-testid="edit-RPT"]').click();

        cy.get('[data-testid="alert-info-edit-docket-entry"]').should('exist');
        cy.get('[data-testid="alert-info-edit-docket-entry"]').should(
          'contain',
          'Edits to Document Info will also be edited for:',
        );
        cy.get('[data-testid="alert-info-edit-docket-entry"]').should(
          'contain',
          'Service and Action edits will only apply to this case.',
        );

        cy.get('#document-type').should('exist');
        cy.get('#document-type').should(
          'not.have.class',
          'select-react-element--is-disabled',
        );
      });

      it('should propagate document edits from member case to all consolidated cases', () => {
        loginAsDocketClerk1();
        goToCase(consolidatedGroupInfo.memberDocketNumbers[0]);

        cy.get('[data-testid="edit-RPT"]').click();

        cy.get('#document-type').click();
        cy.get('#document-type').type('Administrative Record{enter}');

        cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
        cy.get('[data-testid="success-alert"]').should('exist');

        goToCase(consolidatedGroupInfo.leadDocketNumber);
        cy.get('[data-testid="document-viewer-link-ADMR"]').should('exist');

        consolidatedGroupInfo.memberDocketNumbers.forEach(
          memberDocketNumber => {
            goToCase(memberDocketNumber);
            cy.get('[data-testid="document-viewer-link-ADMR"]').should('exist');
          },
        );
      });

      it('should allow editing Service tab fields in a member case multidocketed entry', () => {
        loginAsDocketClerk1();
        goToCase(consolidatedGroupInfo.memberDocketNumbers[0]);

        cy.get('[data-testid="document-viewer-link-ADMR"]')
          .closest('tr')
          .find('[data-testid="edit-ADMR"]')
          .click();

        cy.get('#tab-service').click();

        cy.get('[name="servedPartiesCode"]').should('not.be.disabled');

        cy.get('label[for="served-parties-p"]').click();

        cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
        cy.get('[data-testid="success-alert"]').should('exist');

        cy.get('[data-testid="document-viewer-link-ADMR"]')
          .closest('tr')
          .find('[data-testid^="docket-entry-servedPartiesCode-"]')
          .should('contain', 'P');

        goToCase(consolidatedGroupInfo.leadDocketNumber);

        cy.get('[data-testid="document-viewer-link-ADMR"]')
          .closest('tr')
          .find('[data-testid^="docket-entry-servedPartiesCode-"]')
          .should('contain', 'B');
      });

      it('should allow editing Action tab fields in a member case multidocketed entry', () => {
        loginAsDocketClerk1();
        goToCase(consolidatedGroupInfo.memberDocketNumbers[0]);

        cy.get('[data-testid="document-viewer-link-ADMR"]')
          .closest('tr')
          .find('[data-testid="edit-ADMR"]')
          .click();

        cy.get('#tab-action').click();

        cy.get('#action').should('not.be.disabled');
      });

      it('should allow striking a multidocketed entry individually in a member case', () => {
        loginAsDocketClerk1();
        goToCase(consolidatedGroupInfo.memberDocketNumbers[0]);

        cy.get('[data-testid="document-viewer-link-ADMR"]')
          .closest('tr')
          .find('[data-testid="edit-ADMR"]')
          .click();

        cy.get('#tab-action').click();

        cy.get('[data-testid="strike-entry"]').should('not.be.disabled');
      });

      it('should allow sealing a multidocketed entry individually in a member case', () => {
        loginAsDocketClerk1();
        goToCase(consolidatedGroupInfo.memberDocketNumbers[0]);

        cy.get('[data-testid="document-viewer-link-ADMR"]')
          .closest('tr')
          .find('[data-testid^="seal-docket-entry-button-"]')
          .should('not.be.disabled');
      });
    });
  });
});
