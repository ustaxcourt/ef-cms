import {
  applicationContext,
  fakeData,
  testPdfDoc,
} from '../../test/createTestApplicationContext';
import { combineTwoPdfs } from '../../utilities/documentGenerators/combineTwoPdfs';
import { generateNoticesForCaseTrialSessionCalendarInteractor } from './generateNoticesForCaseTrialSessionCalendarInteractor';
import {
  MOCK_CASE,
  MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
} from '../../../test/mockCase';
import {
  SERVICE_INDICATOR_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../entities/EntityConstants';
import { shouldAppendClinicLetter } from '../../utilities/shouldAppendClinicLetter';
import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import { PDFDocument } from 'pdf-lib';

jest.mock('../../utilities/shouldAppendClinicLetter');

describe('generateNoticesForCaseTrialSessionCalendarInteractor', () => {
  let docketNumber, interactorParamObject;

  const trialSession = {
    ...MOCK_TRIAL_REGULAR,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
  };

  const noticeDocumentWithClinicLetter = combineTwoPdfs({
    applicationContext,
    firstPdf: testPdfDoc,
    secondPdf: testPdfDoc,
  });

  applicationContext
    .getUtilities()
    .combineTwoPdfs.mockResolvedValue(noticeDocumentWithClinicLetter);

  const clinicLetterKey = 'I am a key';

  beforeAll(() => {
    docketNumber = '101-20';

    shouldAppendClinicLetter.mockResolvedValue({
      appendClinicLetter: true,
      clinicLetterKey,
    });

    applicationContext
      .getPersistenceGateway()
      .getDocument.mockResolvedValue(fakeData);
    applicationContext
      .getDocumentGenerators()
      .addressLabelCoverSheet.mockResolvedValue(testPdfDoc);
    applicationContext
      .getUseCases()
      .generateStandingPretrialOrderInteractor.mockResolvedValue(testPdfDoc);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

    applicationContext
      .getUseCases()
      .generateNoticeOfTrialIssuedInteractor.mockResolvedValue(testPdfDoc);

    applicationContext
      .getUseCases()
      .generateStandingPretrialOrderForSmallCaseInteractor.mockResolvedValue(
        testPdfDoc,
      );
  });

  beforeEach(() => {
    interactorParamObject = {
      docketNumber,
      jobId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      trialSession,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    };
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionJobStatusForCase.mockResolvedValue({});
  });

  it('should return and do nothing if the job is already processed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionJobStatusForCase.mockResolvedValue({
        [docketNumber]: 'processed',
      });
    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should set the job status to processing the first time the job executes', async () => {
    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );
    expect(
      applicationContext.getPersistenceGateway().setTrialSessionJobStatusForCase
        .mock.calls[0][0].status,
    ).toEqual('processing');
  });

  it('should decrement the job counter when a worker has processed a pdf file', async () => {
    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );
    expect(
      applicationContext.getPersistenceGateway().decrementJobCounter,
    ).toHaveBeenCalled();
  });

  it('should save a copy of the combined notice of trial issued letter and a clinic letter for pro se petitioners', async () => {
    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalledWith(expect.objectContaining({ key: clinicLetterKey }));

    expect(applicationContext.getUtilities().combineTwoPdfs).toHaveBeenCalled();

    const pdfBlob =
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0].document;

    const pdf = await PDFDocument.load(pdfBlob);

    expect(pdf.getPages().length).toBe(2);
  });

  it('should only save a notice of trial order and NOT a clinic for practitioners', async () => {
    shouldAppendClinicLetter.mockResolvedValueOnce({
      appendClinicLetter: false,
    });
    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getUtilities().combineTwoPdfs,
    ).not.toHaveBeenCalled();

    const pdfBlob =
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0].document;
    const pdf = await PDFDocument.load(pdfBlob);

    expect(pdf.getPages().length).toBe(1);
  });

  it('should generate a standing pretrial for small cases if the procedure type is Small', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        procedureType: 'Small',
      });

    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );
    expect(
      applicationContext.getUseCases().generateStandingPretrialOrderInteractor,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getUseCases()
        .generateStandingPretrialOrderForSmallCaseInteractor,
    ).toHaveBeenCalled();
  });

  it('should generate a standing pretrial order for proecedure types other than small', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        procedureType: 'Regular',
      });

    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );
    expect(
      applicationContext.getUseCases().generateStandingPretrialOrderInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases()
        .generateStandingPretrialOrderForSmallCaseInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should send out notifications emails for the notice docket entry AND standing pretrial notice', async () => {
    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalledTimes(2);

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        docketEntryId: expect.anything(),
      }),
    );

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        docketEntryId: expect.anything(),
      }),
    );
  });

  it('should NOT save pdf copies of notices, standing pretrial and the address page for electronic parties', async () => {
    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).not.toHaveBeenCalledTimes(3);
  });

  it('should save the final pdf copy of notices, standing pretrial and the address page to S3 for represented petitioners', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce({
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
      });

    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );

    const pdfBlob =
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[2][0].document;
    const pdf = await PDFDocument.load(pdfBlob);

    expect(pdf.getPages().length).toBe(3);
  });

  it('should save the final pdf copy of notices, standing pretrial and the address page to S3 for pro se petitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce({
        ...MOCK_CASE,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      });

    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );

    const pdfBlob =
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[2][0].document;
    const pdf = await PDFDocument.load(pdfBlob);

    expect(pdf.getPages().length).toBe(4);
  });

  it('should re-attempt the job after a previous failure that was never set to processed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionJobStatusForCase.mockResolvedValueOnce('processing');

    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );

    expect(
      applicationContext.getUseCases().generateNoticeOfTrialIssuedInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().generateStandingPretrialOrderInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().setTrialSessionJobStatusForCase
        .mock.calls[1][0].status,
    ).toEqual('processed');
  });
});
