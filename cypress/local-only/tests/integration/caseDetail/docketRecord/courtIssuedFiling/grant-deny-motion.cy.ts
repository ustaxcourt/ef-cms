import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import {
  loginAsCaseServicesSupervisor,
  loginAsColvin,
  loginAsDocketClerk1,
} from 'cypress/helpers/authentication/login-as-helpers';
import { createAndServePaperFiling } from 'cypress/helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import {
  createMessage,
  enterSubject,
  fillOutMessageField,
  selectChambers,
  selectRecipient,
  selectSection,
  sendMessage,
} from 'cypress/local-only/support/pages/document-qc';
import { checkA11y } from 'cypress/local-only/support/generalCommands/checkA11y';

type MotionCaseFixture = {
  docketNumber: string;
  motionDocketEntryId: string;
};

describe('Judge grants/denies a motion (replaces Apply Stamp flow)', () => {
  const today = formatNow(FORMATS.MMDDYYYY);
  const formattedToday = formatNow(FORMATS.MONTH_DAY_YEAR);
  const motionType = 'Motion for Continuance';

  const createMotionCase = (): Cypress.Chainable<MotionCaseFixture> => {
    loginAsCaseServicesSupervisor();

    return createAndServePaperPetition({ yearReceived: '2025' }).then(
      ({ docketNumber }) => {
        loginAsCaseServicesSupervisor();
        cy.visit(`/case-detail/${docketNumber}`);

        return createAndServePaperFiling({
          dateReceived: today,
          documentType: motionType,
        }).then(({ docketEntryId }) => {
          return cy.wrap({
            docketNumber,
            motionDocketEntryId: docketEntryId,
          });
        });
      },
    );
  };

  const openGrantDenyMotionFromDocumentView = () => {
    cy.get('#tab-document-view').click();
    cy.contains(motionType).click();
    cy.get('[data-testid="grant-deny-motion"]').should('be.visible').click();
    cy.get('[data-testid="motion-disposition-GRANTED"]').should('be.visible');
  };

  describe('case NOT part of a trial session', () => {
    it('should let a judge create a draft Order granting the motion', () => {
      loginAsCaseServicesSupervisor();
      createAndServePaperPetition({ yearReceived: '2025' }).then(
        ({ docketNumber }) => {
          loginAsCaseServicesSupervisor();
          cy.visit(`/case-detail/${docketNumber}`);
          createAndServePaperFiling({
            dateReceived: today,
            documentType: motionType,
          });

          loginAsColvin();
          cy.visit(`/case-detail/${docketNumber}`);
          openGrantDenyMotionFromDocumentView();

          // Trial-session-only options are disabled when the case is not calendared.
          cy.get('[data-testid="stricken-from-trial-session"]').should(
            'be.disabled',
          );
          cy.get('[data-testid="jurisdiction-restored"]').should('be.disabled');
          cy.get('[data-testid="jurisdiction-retained"]').should('be.disabled');

          // Choose disposition GRANTED + add additional order text.
          cy.get('[data-testid="motion-disposition-GRANTED"]').click({
            force: true,
          });
          cy.get('[data-testid="motion-disposition-GRANTED"]').should(
            'be.checked',
          );

          cy.get('[data-testid="add-additional-order-text"]').click();
          cy.get('[data-testid="additional-order-text-0"]').type(
            'this is the additional order text',
          );

          cy.get('[data-testid="docket-entry-preview"]').should(
            'contain.text',
            'Order',
          );

          // Submit and assert the generated order content.
          cy.intercept('POST', '**/api/court-issued-order').as(
            'courtIssuedOrder',
          );
          cy.get('[data-testid="save-draft-button"]').click();

          cy.wait('@courtIssuedOrder').then(({ request }) => {
            const html: string = request.body.contentHtml;
            expect(html).to.include(
              `On ${formattedToday}, petitioner filed a ${motionType}`,
            );
            expect(html).to.include(
              `ORDERED that petitioner's ${motionType} is granted.`,
            );
            expect(html).to.include(
              'ORDERED that this is the additional order text.',
            );
            // Trial-session language should NOT appear for a non-calendared case.
            expect(html).to.not.include('stricken from');
            expect(html).to.not.include('set for trial at the session');
          });

          // Skip signature; verify the draft was saved on the case.
          cy.contains('Apply Signature').should('exist');
          cy.get('[data-testid="skip-signature-button"]').click();

          cy.url().should('contain', `/case-detail/${docketNumber}`);
          cy.get('[data-testid="tab-drafts"]').click();
          cy.contains(`Order - ${motionType} is granted`).should('be.visible');
        },
      );
    });

    it('should list the status report validation errors in field order (Filing Party above Due Date)', () => {
      createMotionCase().then(({ docketNumber }) => {
        loginAsColvin();
        cy.visit(`/case-detail/${docketNumber}`);
        openGrantDenyMotionFromDocumentView();

        cy.get('[data-testid="motion-disposition-GRANTED"]').click({
          force: true,
        });
        cy.get('[data-testid="due-date-message-status-report"]').click({
          force: true,
        });
        cy.get('[data-testid="status-report-due-date-fields"]').should(
          'be.visible',
        );

        // Submit without selecting Filing Party or Due Date to trigger both errors.
        cy.get('[data-testid="save-draft-button"]').click();

        cy.get('[data-testid="error-alert"]')
          .should('contain.text', 'Select Filing Party')
          .and('contain.text', 'Date is required');

        cy.get('[data-testid="error-alert"] li').then($lis => {
          const texts = [...$lis].map(li => li.innerText);
          const filingPartyIndex = texts.findIndex(text =>
            text.includes('Select Filing Party'),
          );
          const dueDateIndex = texts.findIndex(text =>
            text.includes('Date is required'),
          );

          expect(filingPartyIndex, 'Select Filing Party is present').to.be.gte(
            0,
          );
          expect(dueDateIndex, 'Date is required is present').to.be.gte(0);
          expect(
            filingPartyIndex,
            'Select Filing Party appears above Date is required',
          ).to.be.lessThan(dueDateIndex);
        });
      });
    });

    it('should have no accessibility violations on the grant/deny motion form', () => {
      createMotionCase().then(({ docketNumber }) => {
        loginAsColvin();
        cy.visit(`/case-detail/${docketNumber}`);
        openGrantDenyMotionFromDocumentView();

        checkA11y();

        cy.get('[data-testid="motion-disposition-GRANTED"]').click({
          force: true,
        });
        cy.get('[data-testid="due-date-message-stip"]').click({ force: true });
        cy.get('[data-testid="status-report-due-date-fields"]').should(
          'be.visible',
        );

        checkA11y();
      });
    });

    it('should show filing party and due date directly under the stip decision checkbox', () => {
      createMotionCase().then(({ docketNumber }) => {
        loginAsColvin();
        cy.visit(`/case-detail/${docketNumber}`);
        openGrantDenyMotionFromDocumentView();

        cy.get('[data-testid="motion-disposition-GRANTED"]').click({
          force: true,
        });
        cy.get('[data-testid="due-date-message-stip"]').click({ force: true });
        cy.get('[data-testid="due-date-message-stip"]').should('be.checked');
        cy.get('[data-testid="status-report-due-date-fields"]').should(
          'be.visible',
        );

        cy.get('[data-testid="due-date-message-stip"]').then($stipCheckbox => {
          cy.get('[data-testid="status-report-due-date-fields"]').then(
            $fields => {
              expect(
                $fields[0].compareDocumentPosition($stipCheckbox[0]) &
                  Node.DOCUMENT_POSITION_FOLLOWING,
              ).to.equal(Node.DOCUMENT_POSITION_FOLLOWING);
            },
          );
        });
      });
    });

    it('should use joint parties language for stip decision status report clause', () => {
      createMotionCase().then(({ docketNumber }) => {
        loginAsColvin();
        cy.visit(`/case-detail/${docketNumber}`);
        openGrantDenyMotionFromDocumentView();

        cy.get('[data-testid="motion-disposition-GRANTED"]').click({
          force: true,
        });
        cy.get('[data-testid="due-date-message-stip"]').click({ force: true });
        cy.get('[data-testid="filing-party"]').select('Joint');
        cy.get(
          '.usa-date-picker__external-input[data-testid="grant-deny-due-date-picker"]',
        ).type(today);

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
        cy.get('[data-testid="preview-pdf-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request }) => {
          const html: string = request.body.contentHtml;
          expect(html).to.include(
            'ORDERED that the parties shall file a joint status report or proposed stipulated decision',
          );
          expect(html).not.to.include('Joint shall file');
        });
      });
    });

    it('should clear status report due date fields when Clear All is clicked', () => {
      createMotionCase().then(({ docketNumber }) => {
        loginAsColvin();
        cy.visit(`/case-detail/${docketNumber}`);
        openGrantDenyMotionFromDocumentView();

        cy.get('[data-testid="due-date-message-status-report"]').click({
          force: true,
        });
        cy.get('[data-testid="status-report-due-date-fields"]').should(
          'be.visible',
        );
        cy.get('[data-testid="filing-party"]').select('Petitioner(s)');
        cy.get(
          '.usa-date-picker__external-input[data-testid="grant-deny-due-date-picker"]',
        ).type(today);
        cy.get(
          '.usa-date-picker__external-input[data-testid="grant-deny-due-date-picker"]',
        ).should('have.value', today);

        cy.get('[data-testid="clear-grant-deny-form"]').click();
        cy.get('[data-testid="due-date-message-status-report"]').should(
          'not.be.checked',
        );
        cy.get('[data-testid="status-report-due-date-fields"]').should(
          'not.exist',
        );
      });
    });
  });

  describe('message detail view', () => {
    it('should let a judge grant a motion from a message and return to message detail after signing', () => {
      const messageDetailUrlPattern = /messages\/\d{3}-\d{2}\/message-detail/;

      createMotionCase().then(fixture => {
        loginAsDocketClerk1();
        cy.visit(`/case-detail/${fixture.docketNumber}`);
        createMessage();
        selectSection('Chambers');
        selectChambers('colvinsChambers');
        selectRecipient('Judge Colvin');
        enterSubject();
        fillOutMessageField();
        cy.get('[data-testid="select-document"]').select(
          fixture.motionDocketEntryId,
        );
        sendMessage();

        loginAsColvin();
        cy.visit('/messages/my/inbox');
        cy.get(
          `.message-subject > .message-document-title > [data-testid="messages-individual-inbox-subject-cell-${fixture.docketNumber}"]`,
        )
          .first()
          .click();
        cy.get('[data-testid="message-detail-container"]').should('exist');
        cy.get('[data-testid="grant-deny-motion"]')
          .should('be.visible')
          .click();
        cy.get('[data-testid="motion-disposition-GRANTED"]').click({
          force: true,
        });
        cy.get('[data-testid="motion-disposition-GRANTED"]').should(
          'be.checked',
        );

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request }) => {
          const html: string = request.body.contentHtml;
          expect(html).to.include(
            `ORDERED that petitioner's ${motionType} is granted.`,
          );
        });

        cy.contains('Apply Signature').should('exist');
        cy.get('[data-testid="sign-pdf-canvas"]').click();
        cy.get('[data-testid="save-signature-button"]').click();

        cy.url().should('match', messageDetailUrlPattern);
        cy.get('[data-testid="message-attachments"]')
          .children()
          .should('have.length.at.least', 2);
        cy.get('[data-testid="message-attachments"]')
          .contains('Order')
          .should('exist');
      });
    });
  });

  describe('case IS part of a trial session', () => {
    it('should require jurisdiction when case is stricken from the trial session', () => {
      loginAsCaseServicesSupervisor();
      createTrialSession().then(({ trialSessionId }) => {
        cy.get('[data-testid="new-trial-sessions-tab"]').click();
        cy.contains('Anchorage, Alaska').last().click();
        cy.get('[data-testid="set-calendar-button"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();

        createAndServePaperPetition({ yearReceived: '2025' }).then(
          ({ docketNumber }) => {
            loginAsCaseServicesSupervisor();
            cy.visit(`/case-detail/${docketNumber}`);
            createAndServePaperFiling({
              dateReceived: today,
              documentType: motionType,
            });

            cy.get('[data-testid="tab-case-information"]').click();
            cy.get('[data-testid="add-to-trial-session-btn"]').click();
            cy.get('#show-all-locations-true').click({ force: true });
            cy.get('[data-testid="trial-session-select"]').select(
              trialSessionId,
            );
            cy.contains('Add Case').click();
            cy.get('[data-testid="success-alert"]').should('exist');

            loginAsColvin();
            cy.visit(`/case-detail/${docketNumber}`);
            openGrantDenyMotionFromDocumentView();

            cy.get('[data-testid="motion-disposition-GRANTED"]').click({
              force: true,
            });
            cy.get('[data-testid="stricken-from-trial-session"]').click({
              force: true,
            });
            cy.get('[data-testid="save-draft-button"]').click();

            cy.get('[data-testid="error-alert"]').should(
              'contain.text',
              'Jurisdiction is required since case is stricken from the trial session',
            );
            cy.get('#jurisdiction-form-group').should(
              'contain.text',
              'Select jurisdiction',
            );
          },
        );
      });
    });

    it('should let a judge deny the motion and strike the case from the trial session', () => {
      loginAsCaseServicesSupervisor();
      createTrialSession().then(({ trialSessionId }) => {
        cy.get('[data-testid="new-trial-sessions-tab"]').click();
        cy.contains('Anchorage, Alaska').last().click();
        cy.get('[data-testid="set-calendar-button"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();

        createAndServePaperPetition({ yearReceived: '2025' }).then(
          ({ docketNumber }) => {
            loginAsCaseServicesSupervisor();
            cy.visit(`/case-detail/${docketNumber}`);
            createAndServePaperFiling({
              dateReceived: today,
              documentType: motionType,
            });

            // Add this case to the calendared trial session.
            cy.get('[data-testid="tab-case-information"]').click();
            cy.get('[data-testid="add-to-trial-session-btn"]').click();
            cy.get('#show-all-locations-true').click({ force: true });
            cy.get('[data-testid="trial-session-select"]').select(
              trialSessionId,
            );
            cy.contains('Add Case').click();
            cy.get('[data-testid="success-alert"]').should('exist');

            loginAsColvin();
            cy.visit(`/case-detail/${docketNumber}`);
            openGrantDenyMotionFromDocumentView();

            // Trial-session-only options should be enabled now that the case is calendared.
            cy.get('[data-testid="stricken-from-trial-session"]').should(
              'not.be.disabled',
            );
            cy.get('[data-testid="jurisdiction-restored"]').should(
              'be.disabled',
            );
            cy.get('[data-testid="jurisdiction-retained"]').should(
              'be.disabled',
            );

            cy.get('[data-testid="motion-disposition-DENIED"]').click({
              force: true,
            });
            cy.get('[data-testid="denied-as-moot"]').click({ force: true });
            cy.get('[data-testid="denied-as-moot"]').should('be.checked');

            cy.get('[data-testid="motion-disposition-GRANTED"]').click({
              force: true,
            });
            cy.get('[data-testid="denied-as-moot"]').should('not.be.checked');
            cy.get('[data-testid="denied-without-prejudice"]').should(
              'not.be.checked',
            );

            cy.get('[data-testid="motion-disposition-DENIED"]').click({
              force: true,
            });
            cy.get('[data-testid="denied-as-moot"]').click({ force: true });
            cy.get('[data-testid="denied-as-moot"]').should('be.checked');

            cy.get('[data-testid="stricken-from-trial-session"]').click({
              force: true,
            });
            cy.get('[data-testid="stricken-from-trial-session"]').should(
              'be.checked',
            );
            cy.get('[data-testid="jurisdiction-retained"]').should(
              'not.be.disabled',
            );
            cy.get('[data-testid="jurisdiction-retained"]').check({
              force: true,
            });
            cy.get('[data-testid="jurisdiction-retained"]').should(
              'be.checked',
            );

            cy.intercept('POST', '**/api/court-issued-order').as(
              'courtIssuedOrder',
            );
            cy.get('[data-testid="save-draft-button"]').click();

            cy.wait('@courtIssuedOrder').then(({ request }) => {
              const html: string = request.body.contentHtml;
              expect(html).to.include(
                'This case is set for trial at the session of the Court commencing on',
              );
              expect(html).to.include(
                `ORDERED that petitioner's ${motionType} is denied as moot.`,
              );
              expect(html).to.include(
                'ORDERED that this case is stricken from the',
              );
              expect(html).to.include(
                'ORDERED that jurisdiction is retained by the undersigned.',
              );
            });

            cy.contains('Apply Signature').should('exist');
            cy.get('[data-testid="skip-signature-button"]').click();

            cy.url().should('contain', `/case-detail/${docketNumber}`);
            cy.get('[data-testid="tab-drafts"]').click();
            cy.contains(`Order - ${motionType} is denied as moot`).should(
              'be.visible',
            );
          },
        );
      });
    });
  });
});
