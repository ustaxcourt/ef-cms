import { CASE_TYPES_MAP } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { generatePetitionPdfInteractor } from '@shared/business/useCases/generatePetitionPdfInteractor';
import { petitionerUser } from '@shared/test/mockUsers';

describe('generatePetitionPdfInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockImplementation(() => petitionerUser);

    applicationContext
      .getDocumentGenerators()
      .petition.mockImplementation(
        () =>
          new Promise(resolve =>
            resolve('RESULTS_getDocumentGenerators_petition'),
          ),
      );

    applicationContext
      .getUseCaseHelpers()
      .addDraftWatermarkToDocument.mockImplementation(
        () =>
          new Promise(resolve =>
            resolve('RESULTS_addDraftWatermarkToDocument'),
          ),
      );

    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockImplementation(
        () => new Promise(resolve => resolve('RESULTS_saveFileAndGenerateUrl')),
      );
  });

  it('should throw an Unauthorized user error when user does not have the correct permissions', async () => {
    applicationContext.getCurrentUser.mockImplementation(() => ({}));

    await expect(
      generatePetitionPdfInteractor(applicationContext, {}),
    ).rejects.toThrow('Unauthorized');
  });

  it('should generate petition and call save and generate URL', async () => {
    const results = await generatePetitionPdfInteractor(applicationContext, {
      caseCaptionExtension: 'TEST_caseCaptionExtension',
      caseTitle: 'TEST_caseTitle',
      caseType: CASE_TYPES_MAP.deficiency,
      contactPrimary: 'TEST_contactPrimary',
      contactSecondary: 'TEST_contactSecondary',
      irsNotices: [],
      isDraft: false,
      noticeIssuedDate: 'TEST_noticeIssuedDate',
      partyType: 'TEST_partyType',
      petitionFacts: 'TEST_petitionFacts',
      petitionReasons: 'TEST_petitionReasons',
      preferredTrialCity: 'TEST_preferredTrialCity',
      procedureType: 'TEST_procedureType',
      taxYear: 'TEST_taxYear',
    });

    const petitionCalls =
      applicationContext.getDocumentGenerators().petition.mock.calls;
    expect(petitionCalls.length).toEqual(1);
    expect(petitionCalls[0][0].data).toEqual({
      caseCaptionExtension: 'TEST_caseCaptionExtension',
      caseDescription: 'Notice of Deficiency',
      caseTitle: 'TEST_caseTitle',
      contactPrimary: 'TEST_contactPrimary',
      contactSecondary: 'TEST_contactSecondary',
      irsNotices: [],
      noticeIssuedDate: 'TEST_noticeIssuedDate',
      partyType: 'TEST_partyType',
      petitionFacts: 'TEST_petitionFacts',
      petitionReasons: 'TEST_petitionReasons',
      preferredTrialCity: 'TEST_preferredTrialCity',
      procedureType: 'TEST_procedureType',
      taxYear: 'TEST_taxYear',
    });

    const addDraftWatermarkToDocumentCalls =
      applicationContext.getUseCaseHelpers().addDraftWatermarkToDocument.mock
        .calls;
    expect(addDraftWatermarkToDocumentCalls.length).toEqual(0);

    const saveFileAndGenerateUrlCalls =
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl.mock.calls;
    expect(saveFileAndGenerateUrlCalls.length).toEqual(1);
    expect(saveFileAndGenerateUrlCalls[0][0].file).toEqual(
      'RESULTS_getDocumentGenerators_petition',
    );
    expect(saveFileAndGenerateUrlCalls[0][0].urlTtl).toEqual(60 * 60 * 24);
    expect(saveFileAndGenerateUrlCalls[0][0].useTempBucket).toEqual(false);

    expect(results).toEqual('RESULTS_saveFileAndGenerateUrl');
  });

  it('should generate petition, add watermark and call save and generate URL', async () => {
    const results = await generatePetitionPdfInteractor(applicationContext, {
      caseCaptionExtension: 'TEST_caseCaptionExtension',
      caseTitle: 'TEST_caseTitle',
      caseType: CASE_TYPES_MAP.deficiency,
      contactPrimary: 'TEST_contactPrimary',
      contactSecondary: 'TEST_contactSecondary',
      irsNotices: [],
      isDraft: true,
      noticeIssuedDate: 'TEST_noticeIssuedDate',
      partyType: 'TEST_partyType',
      petitionFacts: 'TEST_petitionFacts',
      petitionReasons: 'TEST_petitionReasons',
      preferredTrialCity: 'TEST_preferredTrialCity',
      procedureType: 'TEST_procedureType',
      taxYear: 'TEST_taxYear',
    });

    const petitionCalls =
      applicationContext.getDocumentGenerators().petition.mock.calls;
    expect(petitionCalls.length).toEqual(1);
    expect(petitionCalls[0][0].data).toEqual({
      caseCaptionExtension: 'TEST_caseCaptionExtension',
      caseDescription: 'Notice of Deficiency',
      caseTitle: 'TEST_caseTitle',
      contactPrimary: 'TEST_contactPrimary',
      contactSecondary: 'TEST_contactSecondary',
      irsNotices: [],
      noticeIssuedDate: 'TEST_noticeIssuedDate',
      partyType: 'TEST_partyType',
      petitionFacts: 'TEST_petitionFacts',
      petitionReasons: 'TEST_petitionReasons',
      preferredTrialCity: 'TEST_preferredTrialCity',
      procedureType: 'TEST_procedureType',
      taxYear: 'TEST_taxYear',
    });

    const addDraftWatermarkToDocumentCalls =
      applicationContext.getUseCaseHelpers().addDraftWatermarkToDocument.mock
        .calls;
    expect(addDraftWatermarkToDocumentCalls.length).toEqual(1);
    expect(addDraftWatermarkToDocumentCalls[0][0].pdfFile).toEqual(
      'RESULTS_getDocumentGenerators_petition',
    );

    const saveFileAndGenerateUrlCalls =
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl.mock.calls;
    expect(saveFileAndGenerateUrlCalls.length).toEqual(1);
    expect(saveFileAndGenerateUrlCalls[0][0].file).toEqual(
      'RESULTS_addDraftWatermarkToDocument',
    );
    expect(saveFileAndGenerateUrlCalls[0][0].urlTtl).toEqual(60 * 60 * 24);
    expect(saveFileAndGenerateUrlCalls[0][0].useTempBucket).toEqual(true);

    expect(results).toEqual('RESULTS_saveFileAndGenerateUrl');
  });
});
