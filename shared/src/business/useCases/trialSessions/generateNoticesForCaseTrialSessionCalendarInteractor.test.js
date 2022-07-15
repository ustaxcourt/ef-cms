const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  generateNoticesForCaseTrialSessionCalendarInteractor,
} = require('./generateNoticesForCaseTrialSessionCalendarInteractor');
const {
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const { fakeData } = require('../../test/getFakeFile');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_TRIAL_REGULAR } = require('../../../test/mockTrial');
const { PDFDocument } = require('pdf-lib');

describe('generateNoticesForCaseTrialSessionCalendarInteractor', () => {
  beforeAll(() => {
    const pdfDocumentLoadMock = async () => await PDFDocument.load(testPdfDoc);
    const pdfDocumentcreateMock = async () => await PDFDocument.create();

    applicationContext
      .getPersistenceGateway()
      .getDocument.mockResolvedValue(fakeData);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    applicationContext.getPdfLib.mockReturnValue({
      PDFDocument: {
        create: pdfDocumentcreateMock,
        load: pdfDocumentLoadMock,
      },
    });
    // applicationContext
    //   .getUseCaseHelpers()
    //   .countPagesInDocument.mockReturnValue(3);
  });

  it('should decrement the job counter when a worker has processed a pdf file', async () => {
    const docketNumber = '101-20';
    const trialSession = {
      ...MOCK_TRIAL_REGULAR,
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    };

    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      {
        docketNumber,
        jobId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        trialSession,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    );
    expect(
      applicationContext.getPersistenceGateway().decrementJobCounter,
    ).toHaveBeenCalled();
    // expect(applicationContext.getUtilities().combineTwoPdfs).toHaveBeenCalled();
  });

  // it('should combine the notice of trial issued letter to a clinic letter if a clinic letter is necessary', async () => {
  //   const docketNumber = '101-20';

  //   generateNoticesForCaseTrialSessionCalendarInteractor(applicationContext, {
  //     docketNumber,
  //     jobId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  //     trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  //     userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  //   });
  //   // expect(
  //   //   applicationContext.getPersistenceGateway().getDocument,
  //   // ).toHaveBeenCalled();
  //   // expect(applicationContext.getUtilities().combineTwoPdfs).toHaveBeenCalled();
  // });
});
