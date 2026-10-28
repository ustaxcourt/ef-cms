export function generateRandomPhoneNumber(): string {
  function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const areaCode = getRandomNumber(100, 999);
  const firstPart = getRandomNumber(100, 999);
  const secondPart = getRandomNumber(1000, 9999);
  const phoneNumber = `+1 (${areaCode}) ${firstPart}-${secondPart}`;

  return phoneNumber;
}

export function downloadAndParsePdf({
  selector,
  element,
}: {
  selector?: string;
  element?: Cypress.Chainable<JQuery<HTMLElement>>;
}) {
  cy.intercept('GET', '**/document-download-url').as('documentDownloadUrl');

  if (selector) {
    cy.get(selector).click();
  } else if (element) {
    element.click();
  } else {
    throw Error('Either selector or element must be set');
  }

  return cy.wait('@documentDownloadUrl').then(({ response }) => {
    if (!response) throw Error('Did not find response');

    const { url } = response.body;

    return cy
      .request({
        encoding: 'binary',
        url,
      })
      .then(res => {
        const filePath = 'cypress/downloads/file.pdf';

        return cy.writeFile(filePath, res.body, 'binary').then(() => {
          return cy
            .readFile(filePath, { timeout: 15000 })
            .should('exist')
            .then(() => {
              return cy.task('parsePdf', { filePath });
            });
        });
      });
  });
}
