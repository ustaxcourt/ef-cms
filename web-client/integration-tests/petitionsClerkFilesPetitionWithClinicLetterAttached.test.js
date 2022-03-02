import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';

const cerebralTest = setupTest();

describe('Petitions Clerk creates a paper case which should have a clinic letter appended to the receipt', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(
    cerebralTest,
    fakeFile,
    'Los Angeles, California',
    'Regular',
  );
  // petitionsClerkSubmitsPaperCaseToIrs(cerebralTest);

  it('should be able to serve the case', async () => {
    console.log(cerebralTest.docketNumber);
    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    await cerebralTest.runSequence('openConfirmServeToIrsModalSequence');

    await cerebralTest.runSequence('serveCaseToIrsSequence');

    expect(cerebralTest.getState('currentPage')).toEqual(
      'PrintPaperPetitionReceipt',
    );

    // check if two pages somehow?

    const pdfPreviewUrl = cerebralTest.getState('pdfPreviewUrl');

    // await exec(`curl -o FILE.pdf ${pdfPreviewUrl}`);

    console.log('pdfPreviewUrl', pdfPreviewUrl);
    const fs = require('fs');
    const file = fs.readFileSync('FILE.pdf');

    const { PDFDocument } = await cerebralTest.applicationContext.getPdfLib();
    // const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pdfDoc = await PDFDocument.load(file);

    const numberOfPages = pdfDoc.getPages().length;

    console.log(numberOfPages);

    expect(numberOfPages).toEqual(2);

    // await cerebralTest.runSequence('completePrintPaperPetitionReceiptSequence');
  });
});
