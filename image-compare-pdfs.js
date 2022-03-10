const checksum = require('checksum');
const path = require('path');

const { fromPath } = require('pdf2pic');

const outputPath = './shared/test-output/document-generation';

const pdfs = [
  'Order.pdf',
  'Address_Label_Cover_Sheet.pdf',
  'Notice_Trial_Issued.pdf',
  'Case_Inventory_Report.pdf',
  'Notice_Trial_Issued_In_Person.pdf',
  'Change_Of_Address.pdf',
  'Order.pdf',
  'CourtIssuedDocumentCoverSheet.pdf',
  'Pending_Report.pdf',
  'CoverSheet.pdf',
  'Practitioner_Case_List.pdf',
  'Docket_Record.pdf',
  'Receipt_of_Filing.pdf',
  'Notice.pdf',
  'Standing_Pretrial_Order.pdf',
  'Notice_Of_Change_To_Remote_Proceeding.pdf',
  'Standing_Pretrial_Order_For_Small_Case.pdf',
  'Notice_Of_Docket_Change.pdf',
  'Trial_Calendar.pdf',
  'Notice_Receipt_Petition.pdf',
  'Trial_Session_Planning_Report.pdf',
];

const expectedHashes = {
  'Address_Label_Cover_Sheet.pdf': '35fc53bfc2a9c90052eccd33797d925cc71e50ed',
  'Case_Inventory_Report.pdf': '789c87f5a5428c150da17eb01653deaf889fa5c0',
  'Change_Of_Address.pdf': '435f1e3b11f060d20722d2e9365c5f179c4325a6',
  'CourtIssuedDocumentCoverSheet.pdf':
    'b2be9c9011352e2bbd7d390ebc2ff88767d47277',
  'CoverSheet.pdf': 'e0adc7143327c73b608cb35ae25af5112e327e15',
  'Docket_Record.pdf': '8505dc02879fce375b6657e3cef3070d476b97ae',
  'Notice.pdf': 'de71c72ef8cca9981f29cb969e612f22eb924184',
  'Notice_Of_Change_To_Remote_Proceeding.pdf':
    'b6b4738e0e19351d003a1c0e92f45a90997fedff',
  'Notice_Of_Docket_Change.pdf': '9a54434eb605bdf6e6935b8320fcc3a9b3862bdc',
  'Notice_Receipt_Petition.pdf': 'cd81cd6af027447e580f7d81ee569db011a6b7c2',
  'Notice_Trial_Issued.pdf': '1a477683dea2b2d5461aff44ad8a07e07e446822',
  'Notice_Trial_Issued_In_Person.pdf':
    'db37afed156aa655f8b8647908b1ba6fdd42ed6e',
  'Order.pdf': '565ec3283b3c38c714f3bd71f0b99633898c95be',
  'Pending_Report.pdf': '6edf843b421e221509e8d1e2555a0f9516f49bdd',
  'Practitioner_Case_List.pdf': 'dc0467afc7152f3867f6b9dffef980631bbe6e8e',
  'Receipt_of_Filing.pdf': '64f2bb74df5db3768c8c1c7e304c84bd8f902a48',
  'Standing_Pretrial_Order.pdf': '4e81f3db5b63dada86385fcdf09588f79f581c28',
  'Standing_Pretrial_Order_For_Small_Case.pdf':
    '4e81f3db5b63dada86385fcdf09588f79f581c28',
  'Trial_Calendar.pdf': 'cd494a12ba7e0e261cd102739bc6a99501fc10e6',
  'Trial_Session_Planning_Report.pdf':
    '1586856d84a4bac4a851678e617ef0e7794f002e',
};

(async () => {
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

    console.log(`output hash for ${pdf}: `, hash);

    if (hash !== expectedHashes[pdf]) {
      throw new Error('Hash mismatch');
    }
  }
})();
