import { CaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import {
  loginAsDocketClerk1,
  loginAsColvin,
  loginAsColvinChambers,
} from '../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../helpers/authentication/logout';
import { updateCaseStatus } from '../../../../helpers/caseDetail/caseInformation/update-case-status';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';

describe('Submitted/CAV table', () => {
  it('should create a submitted case and allow the judge to add and edit the case worksheet', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      updateCaseStatus('Submitted', 'Colvin');

      loginAsColvin();
      cy.get('[data-testid="tab-case-worksheets"]').click();
      cy.get(`[data-testid="add-edit-case-worksheet-${docketNumber}"]`).click();

      // test cancel
      cy.get('[data-testid="confirm-modal-cancel-btn"]').click();

      cy.get(`[data-testid="add-edit-case-worksheet-${docketNumber}"]`).click();
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="final-brief-due-date-picker"]',
      ).type('08/10/2026');
      cy.get('#status-of-matter').select(
        CaseWorksheet.STATUS_OF_MATTER_OPTIONS[0],
      );
      cy.get('#primary-issue').type('the primary issue');
      cy.get('[data-testid="modal-confirm"]').click();

      cy.get(`[data-testid="submitted-cav-case-${docketNumber}"]`)
        .find('td')
        .eq(7)
        .should('contain.text', '08/10/26');

      cy.get(`[data-testid="submitted-cav-case-${docketNumber}"]`)
        .find('td')
        .eq(8)
        .should('contain.text', CaseWorksheet.STATUS_OF_MATTER_OPTIONS[0]);

      cy.get(`[data-testid="submitted-cav-case-issue-${docketNumber}"]`)
        .find('td')
        .eq(1)
        .should('contain.text', 'the primary issue');

      // leave and come back to test hydrating form from DB
      logout();
      loginAsColvin();
      cy.get('[data-testid="tab-case-worksheets"]').click();
      cy.get(`[data-testid="add-edit-case-worksheet-${docketNumber}"]`).click();

      // test that hydrated date saves properly
      cy.get('[data-testid="modal-confirm"]').click();
      cy.get(`[data-testid="add-edit-case-worksheet-${docketNumber}"]`).click();

      cy.get(
        '.usa-date-picker__wrapper > [data-testid="final-brief-due-date-picker"]',
      ).clear();
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="final-brief-due-date-picker"]',
      ).type('09/10/2026');
      cy.get('#status-of-matter').select(
        CaseWorksheet.STATUS_OF_MATTER_OPTIONS[1],
      );
      cy.get('#primary-issue').type(' updated');
      cy.get('[data-testid="modal-confirm"]').click();

      cy.get(`[data-testid="submitted-cav-case-${docketNumber}"]`)
        .find('td')
        .eq(7)
        .should('contain.text', '09/10/26');

      cy.get(`[data-testid="submitted-cav-case-${docketNumber}"]`)
        .find('td')
        .eq(8)
        .should('contain.text', CaseWorksheet.STATUS_OF_MATTER_OPTIONS[1]);

      cy.get(`[data-testid="submitted-cav-case-issue-${docketNumber}"]`)
        .find('td')
        .eq(1)
        .should('contain.text', 'the primary issue updated');
    });
  });

  it('should create a submitted case and allow the chambers to add and edit the case worksheet', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      updateCaseStatus('Submitted', 'Colvin');

      loginAsColvinChambers();
      cy.get('[data-testid="submitted-cav-cases-tab"]').click();
      cy.get(`[data-testid="add-edit-case-worksheet-${docketNumber}"]`).click();

      // test cancel
      cy.get('[data-testid="confirm-modal-cancel-btn"]').click();

      cy.get(`[data-testid="add-edit-case-worksheet-${docketNumber}"]`).click();
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="final-brief-due-date-picker"]',
      ).type('08/10/2026');
      cy.get('#status-of-matter').select(
        CaseWorksheet.STATUS_OF_MATTER_OPTIONS[0],
      );
      cy.get('#primary-issue').type('the primary issue');
      cy.get('[data-testid="modal-confirm"]').click();

      cy.get(`[data-testid="submitted-cav-case-${docketNumber}"]`)
        .find('td')
        .eq(7)
        .should('contain.text', '08/10/26');

      cy.get(`[data-testid="submitted-cav-case-${docketNumber}"]`)
        .find('td')
        .eq(8)
        .should('contain.text', CaseWorksheet.STATUS_OF_MATTER_OPTIONS[0]);

      cy.get(`[data-testid="submitted-cav-case-issue-${docketNumber}"]`)
        .find('td')
        .eq(1)
        .should('contain.text', 'the primary issue');

      // leave and come back to test hydrating form from DB
      logout();
      loginAsColvinChambers();

      cy.get('[data-testid="submitted-cav-cases-tab"]').click();
      cy.get(`[data-testid="add-edit-case-worksheet-${docketNumber}"]`).click();

      // test that hydrated date saves properly
      cy.get('[data-testid="modal-confirm"]').click();
      cy.get(`[data-testid="add-edit-case-worksheet-${docketNumber}"]`).click();

      cy.get(
        '.usa-date-picker__wrapper > [data-testid="final-brief-due-date-picker"]',
      ).clear();
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="final-brief-due-date-picker"]',
      ).type('09/10/2026');
      cy.get('#status-of-matter').select(
        CaseWorksheet.STATUS_OF_MATTER_OPTIONS[1],
      );
      cy.get('#primary-issue').type(' updated');
      cy.get('[data-testid="modal-confirm"]').click();

      cy.get(`[data-testid="submitted-cav-case-${docketNumber}"]`)
        .find('td')
        .eq(7)
        .should('contain.text', '09/10/26');

      cy.get(`[data-testid="submitted-cav-case-${docketNumber}"]`)
        .find('td')
        .eq(8)
        .should('contain.text', CaseWorksheet.STATUS_OF_MATTER_OPTIONS[1]);

      cy.get(`[data-testid="submitted-cav-case-issue-${docketNumber}"]`)
        .find('td')
        .eq(1)
        .should('contain.text', 'the primary issue updated');
    });
  });
});
