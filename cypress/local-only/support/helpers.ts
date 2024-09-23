import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import fs from 'fs';
pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.js';

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

export function downloadAndParsePdf(element: string) {
  cy.intercept('GET', '**/document-download-url').as('documentDownloadUrl');

  cy.get(element).click();

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

export async function parsePdf({
  filePath,
}: {
  filePath: string;
}): Promise<string> {
  try {
    const dataBuffer = await fs.promises.readFile(filePath);

    const pdfDocument = await pdfjsLib.getDocument({ data: dataBuffer })
      .promise;

    const pdfText = await extractPdfText(pdfDocument);
    return pdfText;
  } catch (error) {
    throw new Error('Failed to parse PDF');
  }
}

async function extractPdfText(pdfDocument: any) {
  let fullText = '';

  for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const pageText = await extractPageText(page);
    fullText += pageText + '\n';
  }

  return fullText;
}

async function extractPageText(page: any) {
  const textContent = await page.getTextContent();

  let lastX: number | null = null;
  let lastY: number | null = null;
  let pageText = '';

  textContent.items.forEach((item: any) => {
    // Check if the current text item is on the same line and close to the previous item.
    // If not, add a space to separate them.
    if (lastX !== null && lastY !== null) {
      const sameLine = Math.abs(item.transform[5] - lastY) < 5;
      const closeToLastItem = Math.abs(item.transform[4] - lastX) < 5;

      if (!sameLine || !closeToLastItem) {
        pageText += ' ';
      }
    }

    pageText += item.str;
    lastX = item.transform[4] + item.width;
    lastY = item.transform[5];
  });

  return pageText;
}
