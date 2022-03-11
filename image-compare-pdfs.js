const checksum = require('checksum');
const path = require('path');
const { fromPath } = require('pdf2pic');

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
  'Pending_Report.pdf',
  'Practitioner_Case_List.pdf',
  'Receipt_of_Filing.pdf',
  'Standing_Pretrial_Order_For_Small_Case.pdf',
  'Standing_Pretrial_Order.pdf',
  'Trial_Calendar.pdf',
  'Trial_Session_Planning_Report.pdf',
];

const expectedHashes = {
  'Address_Label_Cover_Sheet.pdf': '59f4ae28dec68bc75136d19315b687ab7cfae228',
  'Case_Inventory_Report.pdf': 'b4b155229c5751c266d60d94cf04e740e00da986',
  'Change_Of_Address.pdf': '117a898932eae3af53ad9bd932823130807feaae',
  'CourtIssuedDocumentCoverSheet.pdf':
    '6a53ede98183214111ba86bf9b595f321720ffc7',
  'CoverSheet.pdf': '91801bab7ed525ca640a9c5e7600f5993d668c47',
  'Docket_Record.pdf': '6365d2d2810ff76f7ff25ee6ff919a2c85a85435',
  'Notice.pdf': 'b1761cb9c86bab61bbf457749f54dd9e481dae47',
  'Notice_Of_Change_To_Remote_Proceeding.pdf':
    '02a0d229b17afdf4e1e98c2b576e6f6e6bef796d',
  'Notice_Of_Docket_Change.pdf': '8af2da16f6dcd2b9e39d0710ec064c54ae4b5359',
  'Notice_Receipt_Petition.pdf': '7b5d0e1ba2a5f513af376a2999faf9871640f91f',
  'Notice_Trial_Issued.pdf': 'f4deddb08732942c684b5424098240f27cbae434',
  'Notice_Trial_Issued_In_Person.pdf':
    '243579b1c9dee240a9480db720490e15dc9db883',
  'Order.pdf': 'd500d2bb9b355f2f5cb768a9b9cbd7e5f7e4c8ed',
  'Pending_Report.pdf': '4a0d3a13c158bb2d0f6e38ed45116e75b2826f63',
  'Practitioner_Case_List.pdf': 'ec0b5d4c2211b772c7fc7900b25835ad9cd4c167',
  'Receipt_of_Filing.pdf': 'a1d7fc4b9b000100572b9135a330fbff18320f0c',
  'Standing_Pretrial_Order.pdf': 'd0dbbf8d8e7e3f81136af4a9305aa6ef6821efd8',
  'Standing_Pretrial_Order_For_Small_Case.pdf':
    'd0dbbf8d8e7e3f81136af4a9305aa6ef6821efd8',
  'Trial_Calendar.pdf': '0722baf9f371d50772e8e74b3ff83af9b10958fd',
  'Trial_Session_Planning_Report.pdf':
    '7aee73c753cb80c3fdd4d9307c871d89be6fbe5d',
};

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

      const hash = await new Promise(resolve => {
        checksum.file(`./shared/test-output/${pdf}.1.png`, (err, sum) =>
          resolve(sum),
        );
      });

      if (hash !== expectedHashes[pdf]) {
        fail = true;
        console.log(
          `unexpected hash for ${pdf}: received: ${hash} expected ${expectedHashes[pdf]}`,
        );
      }
    }

    if (fail) {
      throw new Error('Hash mismatch');
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
