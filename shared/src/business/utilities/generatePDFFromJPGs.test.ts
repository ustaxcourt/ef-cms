import { PDFDocument } from 'pdf-lib';
import { applicationContext } from '../test/createTestApplicationContext';
import { generatePDFFromJPGs } from './generatePDFFromJPGs';
import fs from 'fs';
import path from 'path';
const testAssetsPath = path.join(__dirname, '../../../test-assets/');
const testOutputPath = path.join(__dirname, '../../../test-output/');

const testImgDocBytes = () => {
  return new Uint8Array(fs.readFileSync(testAssetsPath + 'sample.jpg'));
};

describe('generatePDFFromJPGs', () => {
  let testImg;
  beforeEach(() => {
    testImg = testImgDocBytes();
  });

  it('creates a pdf document from the specified img data', async () => {
    const newPdfData = await generatePDFFromJPGs(applicationContext, {
      imgData: [testImg, testImg],
    });

    fs.writeFileSync(testOutputPath + 'generatePDFFromJPGData.pdf', newPdfData);

    const newPdfDoc = await PDFDocument.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(newPdfDocPages.length).toEqual(2);
  });
});
