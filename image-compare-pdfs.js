const fs = require('fs');
const path = require('path');
const pixelmatch = require('pixelmatch');
const { fromPath } = require('pdf2pic');
const { PNG } = require('pngjs');

const outputPath = './shared/test-output/document-generation';

const pdfs = [
  'Address_Label_Cover_Sheet.pdf',
  'Case_Inventory_Report.pdf',
  'Change_Of_Address.pdf',
  'CourtIssuedDocumentCoverSheet.pdf',
  'CoverSheet.pdf',
  'Docket_Record.pdf',
  'Notice_Of_Change_To_Remote_Proceeding.pdf',
  'Notice_Of_Docket_Change.pdf',
  'Notice_Receipt_Petition.pdf',
  'Notice_Trial_Issued_In_Person.pdf',
  'Notice_Trial_Issued.pdf',
  'Notice.pdf',
  'Order.pdf',
  'Order_For_Amended_Petition.pdf',
  'Order_For_Amended_Petition_And_Filing_Fee.pdf',
  'Order_For_Filing_Fee.pdf',
  'Order_To_Show_Cause.pdf',
  'Pending_Report.pdf',
  'Practitioner_Case_List.pdf',
  'Receipt_of_Filing.pdf',
  'Standing_Pretrial_Order_For_Small_Case.pdf',
  'Standing_Pretrial_Order.pdf',
  'Trial_Calendar.pdf',
  'Trial_Session_Planning_Report.pdf',
];

(async () => {
  try {
    let fail = false;
    for (let pdf of pdfs) {
      const storeOutputImage = fromPath(path.join(outputPath, pdf), {
        density: 100,
        format: 'png',
        height: 1000,
        saveFilename: pdf,
        savePath: './shared/test-output',
        width: 800,
      });
      await storeOutputImage(1);

      const actualImage = PNG.sync.read(
        fs.readFileSync(`./shared/test-output/${pdf}.1.png`),
      );
      const expectedImage = PNG.sync.read(
        fs.readFileSync(`./shared/test-pdf-expected-images/${pdf}.1.png`),
      );
      const { height, width } = actualImage;
      const diff = new PNG({ height, width });

      const pixelDifference = pixelmatch(
        actualImage.data,
        expectedImage.data,
        diff.data,
        width,
        height,
        { threshold: 0.2 },
      );

      const totalPixels = height * width;
      const percentDifference = (pixelDifference / totalPixels) * 100;

      console.log(`${pdf}: ${percentDifference}%`);

      fs.mkdirSync('./shared/test-output/diff', { recursive: true });
      fs.writeFileSync(
        `./shared/test-output/diff/${pdf}.1.png`,
        PNG.sync.write(diff),
      );

      if (percentDifference > 0.1) {
        console.error(
          `${pdf} failed due to percentDifference of ${percentDifference}`,
        );
        fail = true;
      }
    }

    if (fail) {
      throw new Error('PDF visualize testing failed');
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
