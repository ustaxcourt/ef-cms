import { assertDoesNotExist, assertExists, retry } from '../../helpers/retry';
import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { navigateToJudgeActivityReport } from '../../helpers/navigate-to-judge-activity-report';
import { searchByDocketNumberInHeader } from '../../helpers/search-by-docket-number-in-header';
import { selectTypeaheadInput } from '../../helpers/select-typeahead-input';
import { updateCaseStatus } from '../../helpers/update-case-status';

describe('Verify the activity report', () => {
  describe('Statistics table', () => {
    it('should display an error message when invalid dates are entered into the form', () => {
      cy.login('judgecolvin');
      navigateToJudgeActivityReport('statistics');
      cy.get('[data-testid="view-statistics-button"]').should('be.disabled');
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="deadlineStart-date-start-input"]',
      ).type('abc');
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="deadlineEnd-date-end-input}"]',
      ).type('123');
      cy.get('[data-testid="view-statistics-button"]').click();
      cy.get('[data-testid="error-alert"]').should('be.visible');
      cy.get('[data-testid="deadlineStart-date-start"]').should('be.visible');
      cy.get('[data-testid="deadlineEnd-date-end}"]').should('be.visible');
      cy.get('[data-testid="activity-report-header"]').should(
        'contain',
        'Colvin',
      );
      cy.get('[data-testid="judge-select"]')
        .find('option:selected')
        .should('have.text', 'Colvin');
    });

    it('should display statistics tables when a correct date is inputed', () => {
      cy.login('judgecolvin');
      navigateToJudgeActivityReport('statistics');
      cy.get('[data-testid="view-statistics-button"]').should('be.disabled');
      cy.get('[data-testid="cases-closed-table"]').should('not.exist');
      cy.get('[data-testid="trial-sessions-held-table"]').should('not.exist');
      cy.get('[data-testid="orders-issued-table"]').should('not.exist');
      cy.get('[data-testid="opinions-issued-table"]').should('not.exist');
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="deadlineStart-date-start-input"]',
      ).type('01/01/2013');
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="deadlineEnd-date-end-input}"]',
      ).type('01/01/2024');
      cy.get('[data-testid="view-statistics-button"]').click();
      cy.get('[data-testid="activity-report-header"]').should(
        'contain',
        'Colvin',
      );
      cy.get('[data-testid="judge-select"]')
        .find('option:selected')
        .should('have.text', 'Colvin');

      cy.get('[data-testid="cases-closed-table"]').should('be.visible');
      cy.get('[data-testid="trial-sessions-held-table"]').should('be.visible');
      cy.get('[data-testid="orders-issued-table"]').should('be.visible');
      cy.get('[data-testid="opinions-issued-table"]').should('be.visible');
    });
  });

  describe('Submitted/CAV table', () => {
    it('create a Submitted case and verify it shows up in the Submitted/CAV table', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        cy.login('docketclerk');
        searchByDocketNumberInHeader(docketNumber);
        updateCaseStatus('Submitted', 'Colvin');

        retry(() => {
          cy.login('judgecolvin');
          navigateToJudgeActivityReport('submitted-and-cav');
          return assertExists(`[data-testid="${docketNumber}"]`);
        });
      });
    });

    it('create a CAV case and verify it shows up in the Submitted/CAV table', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        cy.login('docketclerk');
        searchByDocketNumberInHeader(docketNumber);
        updateCaseStatus('CAV', 'Colvin');

        retry(() => {
          cy.login('judgecolvin');
          navigateToJudgeActivityReport('submitted-and-cav');
          return assertExists(`[data-testid="${docketNumber}"]`);
        });
      });
    });

    it('create a Submitted - Rule 122 case and verify it shows up in the Submitted/CAV table', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        cy.login('docketclerk');
        searchByDocketNumberInHeader(docketNumber);
        updateCaseStatus('Submitted - Rule 122', 'Colvin');

        retry(() => {
          cy.login('judgecolvin');
          navigateToJudgeActivityReport('submitted-and-cav');
          return assertExists(`[data-testid="${docketNumber}"]`);
        });
      });
    });

    it('should not display a served decision type event code on the submitted and cav table', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        cy.login('docketclerk');
        searchByDocketNumberInHeader(docketNumber);
        updateCaseStatus('Submitted', 'Colvin');

        cy.login('docketclerk');
        searchByDocketNumberInHeader(docketNumber);

        cy.get('[data-testid="case-detail-menu-button"]').click();
        cy.get('[data-testid="menu-button-create-order"]').click();
        cy.get('[data-testid="event-code-select"]').select('OAD');
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.get('.ql-editor').click();
        cy.get('[data-testid="save-order-button"]').click();
        cy.get('[data-testid="sign-pdf-canvas"]').click();
        cy.get('[data-testid="save-signature-button"]').click();
        cy.get('[data-testid="success-alert"]');

        retry(() => {
          cy.login('judgecolvin');
          navigateToJudgeActivityReport('submitted-and-cav');
          return assertExists(`[data-testid="${docketNumber}"]`);
        });

        cy.login('docketclerk');
        searchByDocketNumberInHeader(docketNumber);

        cy.get('[data-testid="tab-drafts"]').click();
        cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
        cy.get('[data-testid="judge-select"]').select('Colvin');
        cy.get('[data-testid="serve-to-parties-btn"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.get('[data-testid="print-paper-service-done-button"]').click();

        retry(() => {
          cy.login('judgecolvin');
          navigateToJudgeActivityReport('submitted-and-cav');
          return assertDoesNotExist(`[data-testid="${docketNumber}"]`);
        });
      });
    });

    it('should display a stricken decision type documents on the submitted and cav table', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        cy.login('docketclerk');
        searchByDocketNumberInHeader(docketNumber);
        updateCaseStatus('Submitted', 'Colvin');

        cy.get('[data-testid="case-detail-menu-button"]').click();
        cy.get('[data-testid="menu-button-create-order"]').click();
        cy.get('[data-testid="event-code-select"]').select('OAD');
        cy.get('[data-testid="modal-button-confirm"]').click();

        cy.get('.ql-editor').click();
        cy.get('[data-testid="save-order-button"]').click();
        cy.get('[data-testid="sign-pdf-canvas"]').click();
        cy.get('[data-testid="save-signature-button"]').click();
        cy.get('[data-testid="success-alert"]');

        cy.get('[data-testid="tab-drafts"]').click();
        cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
        cy.get('[data-testid="judge-select"]').select('Colvin');
        cy.get('[data-testid="serve-to-parties-btn"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.get('[data-testid="print-paper-service-done-button"]').click();

        updateCaseStatus('Submitted', 'Colvin');

        cy.get('[data-testid="tab-docket-record"]').click();
        cy.get('[data-testid="edit-OAD"]').click();
        cy.get('[data-testid="tab-action"]').click();
        cy.get('[data-testid="strike-entry"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();

        retry(() => {
          cy.login('judgecolvin');
          navigateToJudgeActivityReport('submitted-and-cav');
          return assertExists(`[data-testid="${docketNumber}"]`);
        });
      });
    });

    it('should display lead case of a consolidated group', () => {
      createAndServePaperPetition().then(
        ({ docketNumber: childDocketNumber }) => {
          cy.login('docketclerk');
          searchByDocketNumberInHeader(childDocketNumber);
          updateCaseStatus('Submitted', 'Colvin');

          createAndServePaperPetition({ yearReceived: '2019' }).then(
            ({ docketNumber: leadDocketNumber }) => {
              cy.login('docketclerk');
              searchByDocketNumberInHeader(leadDocketNumber);
              updateCaseStatus('Submitted', 'Colvin');

              cy.get('[data-testid="add-cases-to-group"]').click();
              cy.get('[data-testid="consolidated-case-search"]').type(
                childDocketNumber,
              );
              cy.get('[data-testid="consolidated-search"]').click();
              cy.get('[data-testid="found-case-label"]').click();
              cy.get('[data-testid="modal-confirm"]').click();

              retry(() => {
                cy.login('judgecolvin');
                navigateToJudgeActivityReport('submitted-and-cav');
                return assertExists(`[data-testid="${leadDocketNumber}"]`).then(
                  isLeadVisible => {
                    assertDoesNotExist(
                      `[data-testid="${childDocketNumber}"]`,
                    ).then(isChildHidden => isLeadVisible && isChildHidden);
                  },
                );
              });
            },
          );
        },
      );
    });
  });

  describe('Pending Motions Table', () => {
    it('should display Pending Motions for judge in that report', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        cy.login('docketclerk');
        searchByDocketNumberInHeader(docketNumber);
        updateCaseStatus('Submitted', 'Colvin');
        searchByDocketNumberInHeader(docketNumber);

        cy.get('[data-testid="case-detail-menu-button"]').click();
        cy.get('[data-testid="menu-button-add-paper-filing"]').click();
        cy.get(
          '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
        ).type('01/01/2022');
        selectTypeaheadInput('document-type', 'Motion for a New Trial');
        cy.get('[data-testid="filed-by-option"]').click();
        cy.get('[data-testid="objections-No"]').click();
        cy.get('[data-testid="button-upload-pdf"]').click();

        cy.get('input#primaryDocumentFile-file').attachFile(
          '../fixtures/w3-dummy.pdf',
        );

        cy.get('[data-testid="save-and-serve"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.get('[data-testid="print-paper-service-done-button"]').click();

        searchByDocketNumberInHeader(docketNumber);

        cy.get(
          '[data-testid="docket-record-table"] td:contains("Motion for a New Trial")',
        )
          .parent()
          .invoke('attr', 'data-testid')
          .then(docketEntryId => {
            retry(() => {
              cy.login('judgecolvin');
              navigateToJudgeActivityReport('pending-motions');
              return assertExists(
                `[data-testid="pending-motion-row-${docketEntryId}"]`,
              );
            });
          });
      });
    });
  });
});
