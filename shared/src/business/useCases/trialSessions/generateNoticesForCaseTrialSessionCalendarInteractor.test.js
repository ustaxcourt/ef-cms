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
const { fakeData, getFakeFile } = require('../../test/getFakeFile');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_TRIAL_REGULAR } = require('../../../test/mockTrial');
const { PDFDocument } = require('pdf-lib');

jest.mock('../../utilities/shouldAppendClinicLetter', () => ({
  shouldAppendClinicLetter: jest.fn().mockResolvedValue({
    appendClinicLetter: true,
  }),
}));

jest.mock('../../utilities/copyPagesFromPdf', () => ({
  copyPagesFromPdf: jest.fn(),
}));

describe('generateNoticesForCaseTrialSessionCalendarInteractor', () => {
  let docketNumber, trialSession;
  beforeAll(() => {
    const pdfDocumentLoadMock = async () => await PDFDocument.load(testPdfDoc);
    const pdfDocumentcreateMock = async () => await PDFDocument.create();
    docketNumber = '101-20';
    trialSession = {
      ...MOCK_TRIAL_REGULAR,
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    };
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
  });

  it('should decrement the job counter when a worker has processed a pdf file', async () => {
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
  });

  it('should combine the notice of trial issued letter to a clinic letter if a clinic letter is necessary', async () => {
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
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalled();

    expect(applicationContext.getUtilities().combineTwoPdfs).toHaveBeenCalled();
  });

  it('should NOT combine the notice of trial issued letter to a clinic letter if a clinic letter is necessary', async () => {
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
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalled();

    expect(applicationContext.getUtilities().combineTwoPdfs).toHaveBeenCalled();
  });

  it('should generate a standing pretrial order for proecedure types other than small', async () => {
    const standingPretrialOrderPdf = getFakeFile();

    applicationContext
      .getUseCases()
      .generateStandingPretrialOrderInteractor.mockResolvedValue(
        standingPretrialOrderPdf,
      );

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
      applicationContext.getUseCases().generateStandingPretrialOrderInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases()
        .generateStandingPretrialOrderForSmallCaseInteractor,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        document: standingPretrialOrderPdf,
      }),
    );
  });

  it('should generate a standing pretrial for small cases if the procedure type is Small', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        procedureType: 'Small',
      });

    applicationContext
      .getUseCases()
      .generateStandingPretrialOrderForSmallCaseInteractor.mockResolvedValue(
        testPdfDoc,
      );

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
      applicationContext.getUseCases().generateStandingPretrialOrderInteractor,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getUseCases()
        .generateStandingPretrialOrderForSmallCaseInteractor,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        document: testPdfDoc,
      }),
    );
  });
});
