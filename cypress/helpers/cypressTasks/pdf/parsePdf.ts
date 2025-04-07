import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { readFile } from 'fs/promises';
pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.mjs';

export async function parsePdf({
  filePath,
}: {
  filePath: string;
}): Promise<string> {
  try {
    const dataBuffer = await readFile(filePath);
    const pdfDocUint8 = new Uint8Array(dataBuffer);

    const pdfDocument = await pdfjsLib.getDocument({ data: pdfDocUint8 })
      .promise;

    const pdfText = await extractPdfText(pdfDocument);
    return pdfText;
  } catch (error: any) {
    console.error('Parse PDF error:', error);
    throw new Error(`Failed to parse PDF ${error?.message}`);
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
