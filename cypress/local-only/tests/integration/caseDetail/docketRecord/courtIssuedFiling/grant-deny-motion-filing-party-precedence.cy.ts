import {
  GRANT_DENY_MOTION_TYPE,
  MotionFilingParties,
  createElectronicMotionCase,
  grantMotionAsJudge,
} from 'cypress/helpers/grantDenyMotion/grant-deny-motion-helpers';

describe('Grant/Deny Motion filing party precedence', () => {
  const otherFilingPartyName = 'Chamber Of Commerce';
  const expectedOrderDescription = `Order - ${GRANT_DENY_MOTION_TYPE} is granted`;

  const grantMotionAndAssertOrderHtml = (
    filingParties: MotionFilingParties,
    assertOrderHtml: (html: string) => void,
  ): void => {
    createElectronicMotionCase(filingParties).then(({ docketNumber }) => {
      grantMotionAsJudge(docketNumber);

      cy.wait('@courtIssuedOrder').then(({ request }) => {
        assertOrderHtml(request.body.contentHtml);
      });

      cy.contains('Apply Signature').should('exist');
      cy.get('[data-testid="skip-signature-button"]').click();

      cy.url().should('contain', `/case-detail/${docketNumber}`);
      cy.get('[data-testid="tab-drafts"]').click();
      cy.contains(expectedOrderDescription).should('be.visible');
    });
  };

  it('should identify the filing party as respondent when only respondent filed the motion', () => {
    grantMotionAndAssertOrderHtml(
      { filedByPetitioners: false, filedByRespondent: true },
      html => {
        expect(html).to.include(`respondent filed a ${GRANT_DENY_MOTION_TYPE}`);
        expect(html).to.include(
          `ORDERED that respondent's ${GRANT_DENY_MOTION_TYPE} is granted.`,
        );
        expect(html).not.to.include(
          `ORDERED that petitioner's ${GRANT_DENY_MOTION_TYPE}`,
        );
        expect(html).not.to.include(
          `ORDERED that the parties' ${GRANT_DENY_MOTION_TYPE}`,
        );
      },
    );
  });

  it('should identify the filing party as respondent when respondent filed alongside a non-party', () => {
    grantMotionAndAssertOrderHtml(
      {
        filedByPetitioners: false,
        filedByRespondent: true,
        otherFilingParty: otherFilingPartyName,
      },
      html => {
        expect(html).to.include(`respondent filed a ${GRANT_DENY_MOTION_TYPE}`);
        expect(html).to.include(
          `ORDERED that respondent's ${GRANT_DENY_MOTION_TYPE} is granted.`,
        );
        expect(html).not.to.include(otherFilingPartyName);
      },
    );
  });

  it('should identify the filing party as petitioner (singular) when the sole petitioner filed alongside a non-party', () => {
    grantMotionAndAssertOrderHtml(
      { otherFilingParty: otherFilingPartyName },
      html => {
        expect(html).to.include(`petitioner filed a ${GRANT_DENY_MOTION_TYPE}`);
        expect(html).to.include(
          `ORDERED that petitioner's ${GRANT_DENY_MOTION_TYPE} is granted.`,
        );
        expect(html).not.to.include(otherFilingPartyName);
        expect(html).not.to.include(
          `ORDERED that petitioners' ${GRANT_DENY_MOTION_TYPE}`,
        );
      },
    );
  });

  it('should identify the filing party as the parties when the sole petitioner and respondent filed jointly', () => {
    grantMotionAndAssertOrderHtml({ filedByRespondent: true }, html => {
      expect(html).to.include(`the parties filed a ${GRANT_DENY_MOTION_TYPE}`);
      expect(html).to.include(
        `ORDERED that the parties' ${GRANT_DENY_MOTION_TYPE} is granted.`,
      );
      expect(html).not.to.include(
        `ORDERED that petitioner's ${GRANT_DENY_MOTION_TYPE}`,
      );
      expect(html).not.to.include(
        `ORDERED that respondent's ${GRANT_DENY_MOTION_TYPE}`,
      );
    });
  });

  it('should identify the filing party as the parties when the sole petitioner and respondent filed alongside a non-party', () => {
    grantMotionAndAssertOrderHtml(
      {
        filedByRespondent: true,
        otherFilingParty: otherFilingPartyName,
      },
      html => {
        expect(html).to.include(
          `the parties filed a ${GRANT_DENY_MOTION_TYPE}`,
        );
        expect(html).to.include(
          `ORDERED that the parties' ${GRANT_DENY_MOTION_TYPE} is granted.`,
        );
        expect(html).not.to.include(otherFilingPartyName);
      },
    );
  });
});
