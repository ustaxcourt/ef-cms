const fs = require('fs');
const path = require('path');
const pixelmatch = require('pixelmatch');
const { fromPath } = require('pdf2pic');
const { PNG } = require('pngjs');

const outputPath = './shared/test-output/document-generation';

const pdfs = [
  { fileName: 'Address_Label_Cover_Sheet.pdf', pageNumber: 1 },
  { fileName: 'Bounced_Email_Alert.pdf', pageNumber: 1 },
  { fileName: 'Case_Inventory_Report.pdf', pageNumber: 1 },
  { fileName: 'Change_Of_Address.pdf', pageNumber: 1 },
  { fileName: 'CourtIssuedDocumentCoverSheet.pdf', pageNumber: 1 },
  { fileName: 'CoverSheet.pdf', pageNumber: 1 },
  { fileName: 'StampedCoverSheet.pdf', pageNumber: 1 },
  { fileName: 'Cover_Sheet_For_Consolidated_Cases.pdf', pageNumber: 1 },
  { fileName: 'Docket_Record.pdf', pageNumber: 1 },
  { fileName: 'Document_Service_Email.pdf', pageNumber: 1 },
  { fileName: 'Notice_Of_Change_To_Remote_Proceeding.pdf', pageNumber: 1 },
  { fileName: 'Notice_Of_Change_Of_Trial_Judge.pdf', pageNumber: 1 },
  { fileName: 'Notice_Of_Change_To_In_Person_Proceeding.pdf', pageNumber: 1 },
  { fileName: 'Notice_Of_Docket_Change.pdf', pageNumber: 1 },
  { fileName: 'Notice_Receipt_Petition.pdf', pageNumber: 1 },
  { fileName: 'Notice_Trial_Issued_In_Person.pdf', pageNumber: 1 },
  { fileName: 'Notice_Trial_Issued.pdf', pageNumber: 1 },
  { fileName: 'Notice.pdf', pageNumber: 1 },
  { fileName: 'Order_Designating_Place_Of_Trial.pdf', pageNumber: 1 },
  { fileName: 'Order_For_Amended_Petition.pdf', pageNumber: 1 },
  { fileName: 'Order_For_Amended_Petition_And_Filing_Fee.pdf', pageNumber: 1 },
  { fileName: 'Order_For_Filing_Fee.pdf', pageNumber: 1 },
  { fileName: 'Order_To_Show_Cause.pdf', pageNumber: 1 },
  { fileName: 'Order.pdf', pageNumber: 1 },
  { fileName: 'Pending_Report.pdf', pageNumber: 1 },
  { fileName: 'Practitioner_Case_List.pdf', pageNumber: 1 },
  { fileName: 'Petition_Service_Email.pdf', pageNumber: 1 },
  {
    fileName: 'Printable_Trial_Session_Working_Copy_With_Case_Notes.pdf',
    pageNumber: 1,
  },
  {
    fileName: 'Printable_Trial_Session_Working_Copy_With_Case_Notes.pdf',
    pageNumber: 2,
  },
  {
    fileName: 'Printable_Trial_Session_Working_Copy_Without_Case_Notes.pdf',
    pageNumber: 1,
  },
  {
    fileName: 'Printable_Trial_Session_Working_Copy_Without_Case_Notes.pdf',
    pageNumber: 2,
  },
  { fileName: 'Receipt_of_Filing.pdf', pageNumber: 1 },
  { fileName: 'Standing_Pretrial_Order_For_Small_Case.pdf', pageNumber: 1 },
  { fileName: 'Standing_Pretrial_Order.pdf', pageNumber: 1 },
  { fileName: 'Trial_Calendar.pdf', pageNumber: 1 },
  { fileName: 'Trial_Session_Planning_Report.pdf', pageNumber: 1 },
];

(async () => {
  try {
    let fail = false;
    for (let pdf of pdfs) {
      const storeOutputImage = fromPath(path.join(outputPath, pdf.fileName), {
        density: 100,
        format: 'png',
        height: 1000,
        saveFilename: pdf.fileName,
        savePath: './shared/test-output',
        width: 800,
      });
      await storeOutputImage(pdf.pageNumber);

      const actualImage = PNG.sync.read(
        fs.readFileSync(
          `./shared/test-output/${pdf.fileName}.${pdf.pageNumber}.png`,
        ),
      );
      let expectedImage;
      try {
        expectedImage = PNG.sync.read(
          fs.readFileSync(
            `./shared/test-pdf-expected-images/${pdf.fileName}.${pdf.pageNumber}.png`,
          ),
        );
      } catch (e) {
        // We want to continue and fail rather than error out because no file exists
        // so that we can add more than one file at a time if need be.
        expectedImage = PNG.sync.read(
          fs.readFileSync('./shared/test-assets/Blank.pdf.1.png'),
        );
      }
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

      console.log(
        `${pdf.fileName} page ${pdf.pageNumber}: ${percentDifference}%`,
      );

      fs.mkdirSync('./shared/test-output/diff', { recursive: true });
      fs.writeFileSync(
        `./shared/test-output/diff/${pdf.fileName}.${pdf.pageNumber}.png`,
        PNG.sync.write(diff),
      );

      if (percentDifference > 0.1) {
        console.error(
          `${pdf.fileName} page ${pdf.pageNumber} failed due to percentDifference of ${percentDifference}`,
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
