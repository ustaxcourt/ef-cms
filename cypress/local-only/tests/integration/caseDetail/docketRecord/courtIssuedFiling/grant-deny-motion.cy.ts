import {
  FORMATS,
  formatNow,
} from '../../../../../../../shared/src/business/utilities/DateHandler';
import {
  loginAsCaseServicesSupervisor,
  loginAsColvin,
} from '../../../../../../helpers/authentication/login-as-helpers';
import { createAndServePaperFiling } from '../../../../../../helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { createAndServePaperPetition } from '../../../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { createTrialSession } from '../../../../../../helpers/trialSession/create-trial-session';

describe('Judge grants/denies a motion (replaces Apply Stamp flow)', () => {
  const today = formatNow(FORMATS.MMDDYYYY);
  const formattedToday = formatNow(FORMATS.MONTH_DAY_YEAR);
  const motionType = 'Motion for Continuance';

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
              `ORDERED that the ${motionType} is granted.`,
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
  });

  describe('case IS part of a trial session', () => {
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
            cy.get('[data-testid="jurisdiction-retained"]').should(
              'not.be.disabled',
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

            cy.get('[data-testid="jurisdiction-retained"]').click({
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
                `ORDERED that the ${motionType} is denied as moot.`,
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
