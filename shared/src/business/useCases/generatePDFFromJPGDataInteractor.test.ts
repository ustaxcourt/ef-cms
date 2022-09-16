import { PDFDocument } from 'pdf-lib';
import { applicationContext } from '../test/createTestApplicationContext';
import { generatePDFFromJPGDataInteractor } from './generatePDFFromJPGDataInteractor';
import fs from 'fs';
import path from 'path';

const testAssetsPath = path.join(__dirname, '../../../test-assets/');
const testOutputPath = path.join(__dirname, '../../../test-output/');

const testJpgBytes = () => {
  return new Uint8Array(fs.readFileSync(testAssetsPath + 'sample.jpg'));
};

describe('generatePDFFromJPGDataInteractor', () => {
  let testJpg;

  beforeEach(() => {
    testJpg = testJpgBytes();
  });

  it('generates a pdf document from the provided imgData array', async () => {
    const imgData = [testJpg, testJpg];

    const newPdfData = await generatePDFFromJPGDataInteractor(
      applicationContext,
      { imgData },
    );

    fs.writeFileSync(
      testOutputPath + 'generatePDFFromJPGDataInteractor.pdf',
      newPdfData,
    );

    const newPdfDoc = await PDFDocument.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(newPdfDocPages.length).toEqual(2);
  });
});
