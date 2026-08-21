import {
  FORMATS,
  formatNow,
  getCurrentDateTimeInMillis,
} from '@shared/business/utilities/DateHandler';
import {
  loginAsCaseServicesSupervisor,
  loginAsColvin,
  loginAsDocketClerk,
  loginAsPetitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { attachFile } from 'cypress/helpers/file/upload-file';
import { openGrantDenyMotionFromDocketRecord } from 'cypress/helpers/grantDenyMotion/grant-deny-motion-helpers';
import { petitionerCreatesElectronicCaseWithSpouse } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from 'cypress/helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from 'cypress/helpers/components/typeAhead/select-typeahead-input';

type MotionCaseFixture = {
  docketNumber: string;
  name: string;
  spouseName: string;
};

describe('Judge grants a motion on an electronically filed case with a petitioner and spouse', () => {
  const today = formatNow(FORMATS.MMDDYYYY);
  const motionType = 'Motion for Continuance';
  const expectedOrderDescription = `Order - ${motionType} is granted`;
  const otherFilingPartyName = 'Chamber Of Commerce';

  const dismissPaperServiceNotice = (): void => {
    cy.get('[data-testid="print-paper-service-done-button"]').click();
  };

  const createMotionCase = ({
    filedByPetitioners = true,
    filedByRespondent = false,
    otherFilingParty,
  }: {
    filedByPetitioners?: boolean;
    filedByRespondent?: boolean;
    otherFilingParty?: string;
  }): Cypress.Chainable<MotionCaseFixture> => {
    const name = `Person One ${getCurrentDateTimeInMillis()}`;
    const spouseName = `Person One-Spouse ${getCurrentDateTimeInMillis()}`;

    loginAsPetitioner();

    return petitionerCreatesElectronicCaseWithSpouse(name, spouseName).then(
      docketNumber => {
        petitionsClerkServesPetition(docketNumber);

        loginAsCaseServicesSupervisor();
        cy.visit(`/case-detail/${docketNumber}`);

        cy.get('[data-testid="case-detail-menu-button"]').click();
        cy.get('[data-testid="menu-button-add-paper-filing"]').click();
        cy.get(
          '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
        ).type(today);
        selectTypeaheadInput('primary-document-type-search', motionType);
        cy.get('[data-testid="upload-pdf-button"]').click();
        attachFile({
          filePath: '../../helpers/file/sample.pdf',
          selector: 'input#primaryDocumentFile-file',
          selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
        });

        if (filedByPetitioners) {
          cy.get('[data-testid="filed-by-option"]').click({ multiple: true });
        }

        if (filedByRespondent) {
          cy.get('label[for="party-irs-practitioner"]').click();
          cy.get('#party-irs-practitioner').should('be.checked');
        }

        if (otherFilingParty) {
          cy.get('label[for="has-other-filing-party"]').click();
          cy.get('#has-other-filing-party').should('be.checked');
          cy.get('#other-filing-party').type(otherFilingParty);
        }

        cy.get('[data-testid="objections-No"]').click();

        cy.intercept('GET', '**/documents/**/upload-policy').as('uploadPolicy');
        cy.get('[data-testid="save-and-serve"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
        dismissPaperServiceNotice();
        cy.wait('@uploadPolicy');

        return cy.wrap<MotionCaseFixture>({
          docketNumber,
          name,
          spouseName,
        });
      },
    );
  };

  const grantMotionAsJudge = (docketNumber: string): void => {
    loginAsColvin();
    cy.visit(`/case-detail/${docketNumber}`);
    openGrantDenyMotionFromDocketRecord(motionType);

    cy.get('[data-testid="motion-disposition-GRANTED"]').click({
      force: true,
    });
    cy.get('[data-testid="motion-disposition-GRANTED"]').should('be.checked');

    cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');
    cy.get('[data-testid="save-draft-button"]').click();
  };

  it('should identify the filing party as the parties when granting a motion filed jointly by the petitioners and respondent', () => {
    createMotionCase({ filedByRespondent: true }).then(
      ({ docketNumber, name, spouseName }) => {
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('[data-testid="tab-parties"]').click();
        cy.get(`[data-testid="petitioner-card-${name}"]`).should('exist');
        cy.get(`[data-testid="petitioner-card-${spouseName}"]`).should('exist');

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
