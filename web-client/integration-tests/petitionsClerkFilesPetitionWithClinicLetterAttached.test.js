import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';

// import { PDFDocument } from 'pdf-lib';

const http = require('http');

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

    const fs = require('fs');
    const file = fs.createWriteStream('file.pdf');
    http.get(pdfPreviewUrl, function (response) {
      response.pipe(file);
    });
    const opened = fs.readFile(file);
    // const pdfDoc = await PDFDocument.;
    console.log('pdf: ', opened);

    // pdfDoc.getPages().length;

    // console.log(numberOfPages);

    // expect(numberOfPages).toEqual(2);

    // await cerebralTest.runSequence('completePrintPaperPetitionReceiptSequence');
  });
});
