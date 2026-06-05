import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';

import { createAndServeConsolidatedGroup } from 'cypress/helpers/fileAPetition/create-consolidated-case-group';
import {
  loginAsCaseServicesSupervisor,
  loginAsColvin,
  loginAsDocketClerk,
} from '../../../../helpers/authentication/login-as-helpers';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { createAndServePaperFiling } from 'cypress/helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { retry } from 'cypress/helpers/retry';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import {
  selectSection,
  selectRecipient,
  fillOutMessageField,
  sendMessage,
  selectChambers,
  enterSubject,
} from 'cypress/local-only/support/pages/document-qc';

type CourtIssuedOrderIntercept = {
  request: {
    body: {
      contentHtml: string;
    };
  };
};

type MotionCaseFixture = {
  docketNumber: string;
  motionDocketEntryId: string;
};

describe('file motion response order', () => {
  const today = formatNow(FORMATS.MMDDYYYY);
  const formattedToday = formatNow(FORMATS.MONTH_DAY_YEAR);
  const motionType = 'Motion for a New Trial';
  const createMotionCase = (): Cypress.Chainable<MotionCaseFixture> => {
    loginAsCaseServicesSupervisor();

    return createAndServePaperPetition({
      yearReceived: '2025',
    }).then(({ docketNumber }) => {
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
    });
  };

  const createMotionCaseForJudge = (): Cypress.Chainable<MotionCaseFixture> => {
    return createMotionCase().then(fixture => {
      loginAsColvin();

      return cy.wrap(fixture);
    });
  };

  const openOrderResponseFromDocumentView = (docketNumber: string): void => {
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('#tab-document-view').click();
    cy.contains(motionType).click();
    cy.get('[data-testid="order-response-button"]').click();
  };

  const saveDraftAndAssertContents = (expectedContents: string[]): void => {
    cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');
    cy.get('[data-testid="save-draft-button"]').click();

    cy.wait('@courtIssuedOrder').then(
      ({ request }: CourtIssuedOrderIntercept) => {
        expectedContents.forEach((text: string) => {
          expect(request.body.contentHtml).to.include(text);
        });
      },
    );
  };

  const previewOrderAndAssertContentsAreMissing = (
    unexpectedContents: string[],
  ): void => {
    cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');
    cy.get('[data-testid="preview-pdf-button"]').click();

    cy.wait('@courtIssuedOrder').then(
      ({ request }: CourtIssuedOrderIntercept) => {
        unexpectedContents.forEach((text: string) => {
          expect(request.body.contentHtml).to.not.include(text);
        });
      },
    );
  };

  const signDraftOrder = (): void => {
    cy.get('[data-testid="sign-pdf-canvas"]').click();
    cy.get('[data-testid="save-signature-button"]').click();
  };

  const enterResponseDate = (dateValue: string): void => {
    cy.get('#response-date-input-orderResponseResponseDate-picker').type(
      dateValue,
    );
  };

  const withinMotionOrderResponseForm = (): Cypress.Chainable<
    JQuery<HTMLElement>
  > => cy.get('.motion-order-response-form');

  const enterAdditionalOrderText = (index: number, text: string): void => {
    withinMotionOrderResponseForm()
      .find(`#additional-order-text-array-${index}`)
      .type(text);
  };

  const assertAdditionalOrderTextAreaCount = (count: number): void => {
    withinMotionOrderResponseForm()
      .find('textarea[id^="additional-order-text-array-"]')
      .should('have.length', count);
  };

  const openOrderResponseFromInboxMessage = (
    fixture: MotionCaseFixture,
  ): void => {
    loginAsDocketClerk();
    cy.visit(`/case-detail/${fixture.docketNumber}`);
    cy.get('[data-testid="case-detail-menu-button"]').click();
    cy.get('[data-testid="menu-button-add-new-message"]').click();
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
    cy.get('[data-testid="order-response-button"]').click();
  };

  it('should allow a judge to create a simple motion response order from document view on a fresh case', () => {
    const expectedContents = [
      formattedToday,
      `petitioner filed a ${motionType}`,
    ];

    createMotionCaseForJudge().then(fixture => {
      openOrderResponseFromDocumentView(fixture.docketNumber);
      enterResponseDate(today);
      saveDraftAndAssertContents(expectedContents);
      cy.contains('Apply Signature').should('exist');
      cy.get('[data-testid="skip-signature-button"]').click();
      cy.url().should('contain', `/case-detail/${fixture.docketNumber}`);
    });
  });

  it('should allow a judge to save a signed draft motion response order from document view on a fresh case', () => {
    createMotionCaseForJudge().then(fixture => {
      openOrderResponseFromDocumentView(fixture.docketNumber);
      enterResponseDate(today);
      saveDraftAndAssertContents([`On ${formattedToday}`]);
      cy.contains('Apply Signature').should('exist');
      signDraftOrder();
      cy.url().should('contain', `/case-detail/${fixture.docketNumber}`);
    });
  });

  it('should allow a judge to save an unsigned draft motion response order from document view on a fresh case', () => {
    createMotionCaseForJudge().then(fixture => {
      openOrderResponseFromDocumentView(fixture.docketNumber);
      enterResponseDate(today);
      saveDraftAndAssertContents([`On ${formattedToday}`]);
      cy.contains('Apply Signature').should('exist');
      cy.contains('Skip Signature').click();
      cy.url().should('contain', `/case-detail/${fixture.docketNumber}`);
    });
  });

  it('should allow a judge to preview and cancel a motion response order from document view on a fresh case', () => {
    const unexpectedContents = [
      'ORDERED that by Invalid DateTime, respondent shall file a Response',
      'ORDERED that by Invalid DateTime, petitioner may file a Reply',
    ];

    createMotionCaseForJudge().then(fixture => {
      openOrderResponseFromDocumentView(fixture.docketNumber);
      enterResponseDate(today);
      cy.get('[data-testid="preview-pdf-button"]').click();

      retry(() => {
        return cy.get('body').then(body => {
          return (
            body.find('[data-testid="motion-response-order-pdf-preview"]')
              .children.length > 1
          );
        });
      });

      openOrderResponseFromDocumentView(fixture.docketNumber);
      enterResponseDate('randomstring');
      cy.get('#motion-order-reply').check({ force: true });
      cy.get('#due-date-input-motionOrderResponseDueDate-picker').type(
        'randomstring',
      );
      enterAdditionalOrderText(0, 'Test additional text box');
      previewOrderAndAssertContentsAreMissing(unexpectedContents);

      openOrderResponseFromDocumentView(fixture.docketNumber);
      enterResponseDate(today);
      cy.get('[data-testid="preview-pdf-button"]').click();
      cy.get('#motion-order-reply').check({ force: true });
      cy.get('#due-date-input-motionOrderResponseDueDate-picker').type(today);
      enterAdditionalOrderText(0, 'Test additional text box');
      cy.get('[data-testid="preview-pdf-button"]').click();
      cy.get('[data-testid="cancel-button"]').click();
      cy.url().should('contain', `/case-detail/${fixture.docketNumber}`);
    });
  });

  it('should allow a judge to save a customized motion response order with all options selected on a fresh case', () => {
    const allOptionsExpectedContents = [
      'respondent shall file a Response to the Motion for a New Trial',
      `by ${formattedToday}, petitioner may file a Reply. It is further`,
      'Test additional text box',
    ];

    createMotionCaseForJudge().then(fixture => {
      openOrderResponseFromDocumentView(fixture.docketNumber);
      enterResponseDate(today);
      cy.get('#motion-order-reply').check({ force: true });
      cy.get('#due-date-input-motionOrderResponseDueDate-picker').type(today);
      enterAdditionalOrderText(0, 'Test additional text box');
      saveDraftAndAssertContents(allOptionsExpectedContents);
    });
  });

  it('shows a validation error when response date is invalid and user saves draft', () => {
    createMotionCaseForJudge().then(fixture => {
      openOrderResponseFromDocumentView(fixture.docketNumber);
      enterResponseDate('invalid date');
      cy.get('[data-testid="save-draft-button"]').click();

      cy.get('[data-testid="error-alert"]').should(
        'contain.text',
        'Enter a valid date',
      );
      cy.get(
        '#response-date-input-orderResponseResponseDate-form-group',
      ).should('contain.text', 'Enter a valid date');
    });
  });

  it('lets a judge remove optional additional order text rows', () => {
    createMotionCaseForJudge().then(fixture => {
      openOrderResponseFromDocumentView(fixture.docketNumber);
      enterResponseDate(today);
      assertAdditionalOrderTextAreaCount(1);

      cy.contains('button', 'Add additional order text').click();
      assertAdditionalOrderTextAreaCount(2);

      cy.contains('button', 'Remove').click();
      assertAdditionalOrderTextAreaCount(1);
      withinMotionOrderResponseForm()
        .find('#additional-order-text-array-0')
        .should('exist');
      withinMotionOrderResponseForm()
        .find('#additional-order-text-array-1')
        .should('not.exist');
    });
  });

  it('lets a judge clear all selected and added data', () => {
    createMotionCaseForJudge().then(fixture => {
      openOrderResponseFromDocumentView(fixture.docketNumber);
      enterResponseDate(today);
      cy.get('#motion-order-reply').check({ force: true });
      cy.get('#due-date-input-motionOrderResponseDueDate-picker').type(today);
      enterAdditionalOrderText(0, 'Primary clause');
      cy.contains('button', 'Add additional order text').click();
      enterAdditionalOrderText(1, 'Secondary clause');

      cy.get('[data-testid="clear-all-fields"]').click();

      cy.get('#response-date-input-orderResponseResponseDate-picker').should(
        'have.value',
        '',
      );
      cy.get('#motion-order-reply').should('not.be.checked');
      cy.get('#due-date-input-motionOrderResponseDueDate-picker').should(
        'have.value',
        '',
      );
      assertAdditionalOrderTextAreaCount(1);
      withinMotionOrderResponseForm()
        .find('#additional-order-text-array-0')
        .should('have.value', '');
    });
  });

  it('opens the order response form with the expected title from document preview', () => {
    createMotionCaseForJudge().then(fixture => {
      openOrderResponseFromDocumentView(fixture.docketNumber);
      cy.get('#page-title').should('contain.text', 'Order Response to Motion');
    });
  });

  it('always shows the first additional order text field and drops optional rows that are only whitespace after preview', () => {
    createMotionCaseForJudge().then(fixture => {
      openOrderResponseFromDocumentView(fixture.docketNumber);
      enterResponseDate(today);
      assertAdditionalOrderTextAreaCount(1);
      cy.contains('button', 'Add additional order text').click();
      withinMotionOrderResponseForm()
        .find('#additional-order-text-array-1')
        .should('be.visible')
        .clear()
        .type('   ');
      cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');
      cy.get('[data-testid="preview-pdf-button"]').click();
      cy.wait('@courtIssuedOrder');
      withinMotionOrderResponseForm()
        .find('#additional-order-text-array-1')
        .should('not.exist');
      assertAdditionalOrderTextAreaCount(1);
      withinMotionOrderResponseForm()
        .find('#additional-order-text-array-0')
        .should('have.value', '');
    });
  });

  it('keeps optional additional order text rows with substantive content after preview', () => {
    createMotionCaseForJudge().then(fixture => {
      openOrderResponseFromDocumentView(fixture.docketNumber);
      enterResponseDate(today);
      cy.contains('button', 'Add additional order text').click();
      enterAdditionalOrderText(1, 'Second clause for Cypress.');
      cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');
      cy.get('[data-testid="preview-pdf-button"]').click();
      cy.wait('@courtIssuedOrder');
      assertAdditionalOrderTextAreaCount(1);
      withinMotionOrderResponseForm()
        .find('#additional-order-text-array-0')
        .should('have.value', 'Second clause for Cypress.');
    });
  });

  it('should save a motion response order with multiple additional order text clauses', () => {
    createMotionCaseForJudge().then(fixture => {
      openOrderResponseFromDocumentView(fixture.docketNumber);
      enterResponseDate(today);
      enterAdditionalOrderText(0, 'First added clause');
      cy.contains('button', 'Add additional order text').click();
      enterAdditionalOrderText(1, 'Second added clause');

      saveDraftAndAssertContents([
        'ORDERED that First added clause. It is further',
        'ORDERED that Second added clause.',
      ]);
    });
  });

  it('should allow a judge to create a motion response order for a consolidated lead case', () => {
    const expectedContents = [
      `On ${formattedToday}, petitioner filed a Motion for a New Trial`,
      'lead case doc. no.',
    ];
    const allCasesLabel = 'All cases in this group';

    createAndServeConsolidatedGroup({}).then(({ leadDocketNumber }) => {
      loginAsCaseServicesSupervisor();
      cy.visit(`/case-detail/${leadDocketNumber}`);

      createAndServePaperFiling({
        dateReceived: today,
        documentType: motionType,
      });

      loginAsColvin();
      openOrderResponseFromDocumentView(leadDocketNumber);
      enterResponseDate(today);

      cy.get(`input[type="radio"][value="${allCasesLabel}"]`).should(
        'be.checked',
      );
      saveDraftAndAssertContents(expectedContents);
    });
  });

  it('should allow a judge to strike a case from a trial session when filing a motion response order', () => {
    const expectedContents = [
      `On ${formattedToday}, petitioner filed a Motion for a New Trial`,
      'this case is stricken from the trial session.',
      'jurisdiction is retained by the undersigned',
    ];

    loginAsCaseServicesSupervisor();
    createTrialSession().then(({ trialSessionId }) => {
      cy.get('[data-testid="new-trial-sessions-tab"]').click();
      cy.contains('Anchorage, Alaska').last().click();
      cy.contains('Set Calendar').click();
      cy.contains('Yes, Set Calendar').click();

      createAndServePaperPetition({
        yearReceived: '2025',
      }).then(({ docketNumber }) => {
        loginAsCaseServicesSupervisor();
        cy.visit(`/case-detail/${docketNumber}`);

        createAndServePaperFiling({
          dateReceived: today,
          documentType: motionType,
        });
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('[data-testid="add-to-trial-session-btn"]').click();
        cy.get('#show-all-locations-true').click({ force: true });
        cy.get('[data-testid="trial-session-select"]').select(trialSessionId);
        cy.contains('Add Case').click();

        loginAsColvin();
        openOrderResponseFromDocumentView(docketNumber);
        enterResponseDate(today);
        cy.get('#case-is-stricken-from-trial-session').check({ force: true });
        cy.get('#case-is-stricken-from-trial-session').should('be.checked');
        saveDraftAndAssertContents(expectedContents);
      });
    });
  });

  it('should return a judge to the message detail page after previewing and signing an order response', () => {
    const urlRegExp = /messages\/\d{3}-\d{2}\/message-detail/;

    createMotionCase().then(fixture => {
      openOrderResponseFromInboxMessage(fixture);
      enterResponseDate(today);
      cy.get('[data-testid="preview-pdf-button"]').click();
      cy.get('#motion-order-reply').check({ force: true });
      cy.get('#due-date-input-motionOrderResponseDueDate-picker').type(today);
      enterAdditionalOrderText(0, 'Test additional text box');
      cy.get('[data-testid="preview-pdf-button"]').click();
      cy.get('[data-testid="cancel-button"]').click();
      cy.url().should('match', urlRegExp);

      cy.get('[data-testid="order-response-button"]').click();
      enterResponseDate(today);
      cy.get('[data-testid="save-draft-button"]').click();
      cy.contains('Apply Signature').should('exist');
      signDraftOrder();
      cy.url().should('match', urlRegExp);

      cy.get('[data-testid="message-attachments"]')
        .children()
        .should('have.length', 2);
      cy.get('[data-testid="message-attachments"]')
        .children()
        .eq(1)
        .should('contain.text', 'Order');
    });
  });
});
