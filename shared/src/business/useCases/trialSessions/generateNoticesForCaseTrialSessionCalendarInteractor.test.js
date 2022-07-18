const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  generateNoticesForCaseTrialSessionCalendarInteractor,
} = require('./generateNoticesForCaseTrialSessionCalendarInteractor');
const {
  MOCK_CASE,
  MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
} = require('../../../test/mockCase');
const {
  SERVICE_INDICATOR_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const {
  shouldAppendClinicLetter,
} = require('../../utilities/shouldAppendClinicLetter');
const { fakeData, getFakeFile } = require('../../test/getFakeFile');
const { MOCK_TRIAL_REGULAR } = require('../../../test/mockTrial');
const { PDFDocument } = require('pdf-lib');

jest.mock('../../utilities/shouldAppendClinicLetter');

describe('generateNoticesForCaseTrialSessionCalendarInteractor', () => {
  let docketNumber, trialSession;
  beforeAll(() => {
    const pdfDocumentLoadMock = async () => await PDFDocument.load(testPdfDoc);
    shouldAppendClinicLetter.mockResolvedValue({ appendClinicLetter: true });
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

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getJobStatus.mockResolvedValue({});
  });

  it('should return and do nothing if the job is already processing', async () => {
    applicationContext.getPersistenceGateway().getJobStatus.mockResolvedValue({
      [docketNumber]: 'processing',
    });
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
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should track the job status when processing begins', async () => {
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
      applicationContext.getPersistenceGateway().setJobAsProcessing,
    ).toHaveBeenCalled();
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

  it('should send out notifications emails for the notice docket entry and standing pretrial notice', async () => {
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
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalledTimes(2);
  });

  it('should not append clinic letter when creating notices for a case with a represented petitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
        privatePractitioners: [
          {
            ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS.privatePractitioners[0],
            representing: [MOCK_CASE.petitioners[0].contactId],
          },
        ],
        procedureType: 'Small',
      });

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
      applicationContext.getDocumentGenerators().addressLabelCoverSheet,
    ).toHaveBeenCalledTimes(1);

    const pdfBlob =
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[2][0].document;
    const pdf = await PDFDocument.load(pdfBlob);

    expect(pdf.getPages().length).toBe(2);
  });

  it('should append the clinic letter for pro se petitioners', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
        privatePractitioners: [],
        procedureType: 'Small',
      });

    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      {
        docketNumber,
        jobId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        trialSession,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    );

    const pdfBlob =
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[2][0].document;
    const pdf = await PDFDocument.load(pdfBlob);

    expect(pdf.getPages().length).toBe(3);
  });

  it('should not append clinic letter if the clinic letter is not in s3 for the trial location', async () => {
    shouldAppendClinicLetter.mockResolvedValue({ appendClinicLetter: false });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
        privatePractitioners: [],
        procedureType: 'Small',
      });

    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      {
        docketNumber,
        jobId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        trialSession,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    );

    const pdfBlob =
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[2][0].document;
    const pdf = await PDFDocument.load(pdfBlob);

    expect(pdf.getPages().length).toBe(3);
  });
});
