describe('Pending Motions Table', () => {
  it('should display the pending motion table for Judge Colvin', () => {
    cy.login('judgecolvin');
    cy.get('[data-testid="tab-pending-motions"]').click();
    cy.get('[data-testid^="pending-motion-row-"]')
      .as('pendingMotions')
      .should('have.length.above', 0);

    cy.get('@pendingMotions')
      .first()
      .as('firstRow')
      .find('[data-testid="add-edit-pending-motion-worksheet"]')
      .click();

    cy.get('[class="modal-screen"]').should('be.visible');

    const finalBriefDueDate = generateRandomDate();
    selectRandomStatusOfMatterEntry(
      '[data-testid^="select-status-of-matter-"]',
    ).then(([statusOfMatterKey, statusOfMatterLabel]) => {
      const primaryIssue = finalBriefDueDate.longFormat + statusOfMatterLabel;
      cy.get(
        '#final-brief-due-date-6d499aeb-7a4a-4dbc-afa8-5f8bbb71e44d-picker',
      ).clear();

      cy.get(
        '#final-brief-due-date-6d499aeb-7a4a-4dbc-afa8-5f8bbb71e44d-picker',
      ).type(finalBriefDueDate.longFormat);

      cy.get('#status-of-matter-6d499aeb-7a4a-4dbc-afa8-5f8bbb71e44d').select(
        statusOfMatterKey,
      );

      cy.get('#primary-issue-label-6d499aeb-7a4a-4dbc-afa8-5f8bbb71e44d').type(
        primaryIssue,
      );

      cy.get('[data-testid="modal-confirm"]').click();

      cy.get('@firstRow')
        .find('td')
        .eq(6)
        .should('contain.text', finalBriefDueDate.shortFormat);

      cy.get('@firstRow')
        .find('td')
        .eq(7)
        .should('contain.text', statusOfMatterLabel);
      cy.get('@pendingMotions').eq(1).should('contain.text', primaryIssue);
    });
  });

  it("should display the pending motion table for Judge Colvin Chamber's", () => {
    cy.login('colvinschambers');
    cy.get('[data-testid="tab-pending-motions"]').click();
    cy.get('[data-testid^="pending-motion-row-"]')
      .as('pendingMotions')
      .should('have.length.above', 0);

    cy.get('@pendingMotions')
      .first()
      .as('firstRow')
      .find('[data-testid="add-edit-pending-motion-worksheet"]')
      .click();

    cy.get('[class="modal-screen"]').should('be.visible');

    const finalBriefDueDate = generateRandomDate();
    selectRandomStatusOfMatterEntry(
      '[data-testid^="select-status-of-matter-"]',
    ).then(([statusOfMatterKey, statusOfMatterLabel]) => {
      const primaryIssue = finalBriefDueDate.longFormat + statusOfMatterLabel;
      cy.get(
        '#final-brief-due-date-6d499aeb-7a4a-4dbc-afa8-5f8bbb71e44d-picker',
      ).clear();

      cy.get(
        '#final-brief-due-date-6d499aeb-7a4a-4dbc-afa8-5f8bbb71e44d-picker',
      ).type(finalBriefDueDate.longFormat);

      cy.get('#status-of-matter-6d499aeb-7a4a-4dbc-afa8-5f8bbb71e44d').select(
        statusOfMatterKey,
      );

      cy.get('#primary-issue-label-6d499aeb-7a4a-4dbc-afa8-5f8bbb71e44d').type(
        primaryIssue,
      );

      cy.get('[data-testid="modal-confirm"]').click();

      cy.get('@firstRow')
        .find('td')
        .eq(6)
        .should('contain.text', finalBriefDueDate.shortFormat);

      cy.get('@firstRow')
        .find('td')
        .eq(7)
        .should('contain.text', statusOfMatterLabel);
      cy.get('@pendingMotions').eq(1).should('contain.text', primaryIssue);
    });
  });
});

function generateRandomDate() {
  const year = Math.floor(Math.random() * (2023 - 1900 + 1)) + 1900;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  const formattedDay = day < 10 ? `0${day}` : `${day}`;
  const lastTwoDigits = year % 100;
  const shortFormatYear = lastTwoDigits.toString().padStart(2, '0');

  return {
    longFormat: `${formattedMonth}/${formattedDay}/${year}`,
    shortFormat: `${formattedMonth}/${formattedDay}/${shortFormatYear}`,
  };
}

function selectRandomStatusOfMatterEntry(
  selector: string,
): Cypress.Chainable<[string, string]> {
  return cy.get(selector).then(selectElement => {
    const options = Cypress.$(selectElement).find('option:not(:first-child)');
    const randomIndex = Math.floor(Math.random() * options.length);
    const selectedOption = options[randomIndex];
    const value: string = Cypress.$(selectedOption).val()?.toString() || '';
    const innerText = Cypress.$(selectedOption).text();

    const results: [string, string] = [value, innerText];
    return results;
  });
}
