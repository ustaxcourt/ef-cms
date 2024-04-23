export function sortMessageColumnHeader(
  columnHeaderSelector: string,
  cellSelector: string,
) {
  const beforeSorting: string[] = [];

  cy.get(columnHeaderSelector).click();

  cy.get(cellSelector).should('have.length.at.least', 1);
  cy.get(cellSelector).each($cell => {
    beforeSorting.push($cell.text().trim());
  });
  cy.get(columnHeaderSelector).click();

  const afterSorting: string[] = [];
  cy.get(cellSelector).each($cell => {
    afterSorting.push($cell.text().trim());
  });

  return cy.wrap({
    afterSorting,
    beforeSorting,
  });
}
