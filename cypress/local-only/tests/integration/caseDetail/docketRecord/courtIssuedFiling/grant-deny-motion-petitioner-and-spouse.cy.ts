import {
  GRANT_DENY_MOTION_TYPE,
  MotionFilingParties,
  createElectronicMotionCase,
  dismissPaperServiceNotice,
  grantMotionAsJudge,
} from 'cypress/helpers/grantDenyMotion/grant-deny-motion-helpers';
import { loginAsDocketClerk } from 'cypress/helpers/authentication/login-as-helpers';

describe('Judge grants a motion on an electronically filed case with a petitioner and spouse', () => {
  const motionType = GRANT_DENY_MOTION_TYPE;
  const expectedOrderDescription = `Order - ${motionType} is granted`;
  const otherFilingPartyName = 'Chamber Of Commerce';

  const createMotionCase = (filingParties: MotionFilingParties) =>
    createElectronicMotionCase({ ...filingParties, withSpouse: true });

  it('should identify the filing party as the parties when granting a motion filed jointly by the petitioners and respondent', () => {
    createMotionCase({ filedByRespondent: true }).then(
      ({ docketNumber, petitionerNames }) => {
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('[data-testid="tab-parties"]').click();
        petitionerNames.forEach(petitionerName => {
          cy.get(`[data-testid="petitioner-card-${petitionerName}"]`).should(
            'exist',
          );
        });

        grantMotionAsJudge(docketNumber);

        cy.wait('@courtIssuedOrder').then(({ request }) => {
          const html: string = request.body.contentHtml;
          expect(html).to.include(`the parties filed a ${motionType}`);
          expect(html).to.include(
            `ORDERED that the parties' ${motionType} is granted.`,
          );
        });

        cy.contains('Apply Signature').should('exist');
        cy.get('[data-testid="skip-signature-button"]').click();

        cy.url().should('contain', `/case-detail/${docketNumber}`);
        cy.get('[data-testid="tab-drafts"]').click();
        cy.contains(expectedOrderDescription).should('be.visible');
      },
    );
  });

  it('should identify the filing party as petitioners when granting a motion filed by both petitioners and not respondent', () => {
    createMotionCase({ filedByRespondent: false }).then(({ docketNumber }) => {
      grantMotionAsJudge(docketNumber);

      cy.wait('@courtIssuedOrder').then(({ request }) => {
        const html: string = request.body.contentHtml;
        expect(html).to.include(`petitioners filed a ${motionType}`);
        expect(html).not.to.include(`the parties filed a ${motionType}`);
        expect(html).to.include(
          `ORDERED that petitioners' ${motionType} is granted.`,
        );
      });

      cy.contains('Apply Signature').should('exist');
      cy.get('[data-testid="skip-signature-button"]').click();

      cy.url().should('contain', `/case-detail/${docketNumber}`);
      cy.get('[data-testid="tab-drafts"]').click();
      cy.contains(expectedOrderDescription).should('be.visible');
    });
  });

  it('should name the other filing party when granting a motion filed only by a non-party', () => {
    createMotionCase({
      filedByPetitioners: false,
      otherFilingParty: otherFilingPartyName,
    }).then(({ docketNumber }) => {
      grantMotionAsJudge(docketNumber);

      cy.wait('@courtIssuedOrder').then(({ request }) => {
        const html: string = request.body.contentHtml;
        expect(html).to.include(
          `${otherFilingPartyName} filed a ${motionType}`,
        );
        expect(html).to.include(
          `ORDERED that ${otherFilingPartyName}'s ${motionType} is granted.`,
        );
        expect(html).not.to.include(`ORDERED that petitioner's ${motionType}`);
        expect(html).not.to.include(`ORDERED that respondent's ${motionType}`);
      });

      cy.contains('Apply Signature').should('exist');
      cy.get('[data-testid="skip-signature-button"]').click();

      cy.url().should('contain', `/case-detail/${docketNumber}`);
      cy.get('[data-testid="tab-drafts"]').click();
      cy.contains(expectedOrderDescription).should('be.visible');
    });
  });

  it('should identify the filing party as petitioners when the petitioners filed alongside a non-party', () => {
    createMotionCase({ otherFilingParty: otherFilingPartyName }).then(
      ({ docketNumber }) => {
        grantMotionAsJudge(docketNumber);

        cy.wait('@courtIssuedOrder').then(({ request }) => {
          const html: string = request.body.contentHtml;
          expect(html).to.include(`petitioners filed a ${motionType}`);
          expect(html).to.include(
            `ORDERED that petitioners' ${motionType} is granted.`,
          );
          expect(html).not.to.include(otherFilingPartyName);
        });

        cy.contains('Apply Signature').should('exist');
        cy.get('[data-testid="skip-signature-button"]').click();

        cy.url().should('contain', `/case-detail/${docketNumber}`);
        cy.get('[data-testid="tab-drafts"]').click();
        cy.contains(expectedOrderDescription).should('be.visible');
      },
    );
  });

  it('should identify the filing party as the parties when the petitioners and respondent filed alongside a non-party', () => {
    createMotionCase({
      filedByRespondent: true,
      otherFilingParty: otherFilingPartyName,
    }).then(({ docketNumber }) => {
      grantMotionAsJudge(docketNumber);

      cy.wait('@courtIssuedOrder').then(({ request }) => {
        const html: string = request.body.contentHtml;
        expect(html).to.include(`the parties filed a ${motionType}`);
        expect(html).to.include(
          `ORDERED that the parties' ${motionType} is granted.`,
        );
        expect(html).not.to.include(otherFilingPartyName);
      });

      cy.contains('Apply Signature').should('exist');
      cy.get('[data-testid="skip-signature-button"]').click();

      cy.url().should('contain', `/case-detail/${docketNumber}`);
      cy.get('[data-testid="tab-drafts"]').click();
      cy.contains(expectedOrderDescription).should('be.visible');
    });
  });

  it('should let a docket clerk file and serve the granted order as a court issued docket entry', () => {
    createMotionCase({ filedByRespondent: true }).then(({ docketNumber }) => {
      grantMotionAsJudge(docketNumber);
      cy.wait('@courtIssuedOrder');

      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();
      cy.get('[data-testid="tab-drafts"]').click();
      cy.contains(expectedOrderDescription).should('be.visible');

      loginAsDocketClerk();
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('[data-testid="tab-drafts"]').click();
      cy.get('button').contains(expectedOrderDescription).click();
      cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();

      cy.get('[data-testid="document-description-input"]').should(
        'have.value',
        expectedOrderDescription,
      );
      cy.get('[data-testid="service-stamp-Served"]').click({ force: true });

      cy.intercept('POST', '**/file-and-serve-court-issued-docket-entry').as(
        'fileAndServeCourtIssuedDocketEntry',
      );
      cy.get('[data-testid="serve-to-parties-btn"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.wait('@fileAndServeCourtIssuedDocketEntry');
      dismissPaperServiceNotice();

      cy.get('[data-testid="tab-docket-record"]').click();
      cy.contains(expectedOrderDescription)
        .closest('tr')
        .should('not.contain', 'Not served');
    });
  });
});
