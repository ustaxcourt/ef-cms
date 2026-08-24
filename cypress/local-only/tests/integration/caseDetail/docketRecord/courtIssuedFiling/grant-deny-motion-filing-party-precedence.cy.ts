import {
  GRANT_DENY_MOTION_TYPE,
  GRANT_DENY_OTHER_FILING_PARTY,
  MotionFilingParties,
  createElectronicMotionCase,
  grantMotionAndAssertOrderHtml,
} from 'cypress/helpers/grantDenyMotion/grant-deny-motion-helpers';

describe('Grant/Deny Motion filing party precedence', () => {
  const grantMotionOnCaseFiledBy = (
    filingParties: MotionFilingParties,
    assertOrderHtml: (html: string) => void,
  ): void => {
    createElectronicMotionCase(filingParties).then(({ docketNumber }) => {
      grantMotionAndAssertOrderHtml({ assertOrderHtml, docketNumber });
    });
  };

  it('should identify the filing party as respondent when only respondent filed the motion', () => {
    grantMotionOnCaseFiledBy(
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
    grantMotionOnCaseFiledBy(
      {
        filedByPetitioners: false,
        filedByRespondent: true,
        otherFilingParty: GRANT_DENY_OTHER_FILING_PARTY,
      },
      html => {
        expect(html).to.include(`respondent filed a ${GRANT_DENY_MOTION_TYPE}`);
        expect(html).to.include(
          `ORDERED that respondent's ${GRANT_DENY_MOTION_TYPE} is granted.`,
        );
        expect(html).not.to.include(GRANT_DENY_OTHER_FILING_PARTY);
      },
    );
  });

  it('should identify the filing party as petitioner (singular) when the sole petitioner filed alongside a non-party', () => {
    grantMotionOnCaseFiledBy(
      { otherFilingParty: GRANT_DENY_OTHER_FILING_PARTY },
      html => {
        expect(html).to.include(`petitioner filed a ${GRANT_DENY_MOTION_TYPE}`);
        expect(html).to.include(
          `ORDERED that petitioner's ${GRANT_DENY_MOTION_TYPE} is granted.`,
        );
        expect(html).not.to.include(GRANT_DENY_OTHER_FILING_PARTY);
        expect(html).not.to.include(
          `ORDERED that petitioners' ${GRANT_DENY_MOTION_TYPE}`,
        );
      },
    );
  });

  it('should identify the filing party as the parties when the sole petitioner and respondent filed jointly', () => {
    grantMotionOnCaseFiledBy({ filedByRespondent: true }, html => {
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
    grantMotionOnCaseFiledBy(
      {
        filedByRespondent: true,
        otherFilingParty: GRANT_DENY_OTHER_FILING_PARTY,
      },
      html => {
        expect(html).to.include(
          `the parties filed a ${GRANT_DENY_MOTION_TYPE}`,
        );
        expect(html).to.include(
          `ORDERED that the parties' ${GRANT_DENY_MOTION_TYPE} is granted.`,
        );
        expect(html).not.to.include(GRANT_DENY_OTHER_FILING_PARTY);
      },
    );
  });
});
