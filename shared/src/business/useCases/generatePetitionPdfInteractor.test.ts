import {
  CASE_TYPES_MAP,
  CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { generatePetitionPdfInteractor } from '@shared/business/useCases/generatePetitionPdfInteractor';
import { petitionerUser } from '@shared/test/mockUsers';

describe('generatePetitionPdfInteractor', () => {
  const mockFileId = '9085265b-e8ad-4bab-9e7c-f82e847b41f9';

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

    applicationContext.getUniqueId.mockReturnValue(mockFileId);

    applicationContext
      .getPersistenceGateway()
      .saveDocumentFromLambda.mockImplementation(
        () => new Promise(resolve => resolve('RESULTS_saveFileAndGenerateUrl')),
      );
  });

  it('should throw an Unauthorized user error when user does not have the correct permissions', async () => {
    applicationContext.getCurrentUser.mockImplementation(() => ({}));

    await expect(
      generatePetitionPdfInteractor(applicationContext, {} as any),
    ).rejects.toThrow('Unauthorized');
  });

  it('should generate petition and call save document', async () => {
    const results = await generatePetitionPdfInteractor(applicationContext, {
      caseCaptionExtension: 'TEST_caseCaptionExtension',
      caseTitle: 'TEST_caseTitle',
      contactPrimary: 'TEST_contactPrimary' as any,
      contactSecondary: 'TEST_contactSecondary' as any,
      hasIrsNotice: false,
      hasUploadedIrsNotice: true,
      irsNotices: [],
      originalCaseType: CASE_TYPES_MAP.deficiency,
      partyType: 'TEST_partyType',
      petitionFacts: ['TEST_petitionFacts'],
      petitionReasons: ['TEST_petitionReasons'],
      preferredTrialCity: 'TEST_preferredTrialCity',
      procedureType: 'TEST_procedureType',
    });

    const petitionCalls =
      applicationContext.getDocumentGenerators().petition.mock.calls;
    expect(petitionCalls.length).toEqual(1);
    expect(petitionCalls[0][0].data).toEqual({
      caseCaptionExtension: 'TEST_caseCaptionExtension',
      caseDescription: CASE_TYPES_MAP.deficiency,
      caseTitle: 'TEST_caseTitle',
      contactPrimary: 'TEST_contactPrimary',
      contactSecondary: 'TEST_contactSecondary',
      hasUploadedIrsNotice: true,
      irsNotices: [],
      partyType: 'TEST_partyType',
      petitionFacts: ['TEST_petitionFacts'],
      petitionReasons: ['TEST_petitionReasons'],
      preferredTrialCity: 'TEST_preferredTrialCity',
      procedureType: 'TEST_procedureType',
    });

    const saveFileAndGenerateUrlCalls =
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls;
    expect(saveFileAndGenerateUrlCalls.length).toEqual(1);
    expect(saveFileAndGenerateUrlCalls[0][0].document).toEqual(
      'RESULTS_getDocumentGenerators_petition',
    );

    expect(results.fileId).toEqual(mockFileId);
  });

  it('should generate petition with correct irsNotice information', async () => {
    const irsNotices: any[] = [
      {
        caseType: CASE_TYPES_MAP.deficiency,
        key: 'TEST_KEY',
        noticeIssuedDate: '2024-05-02T00:00:00.000-04:00',
        noticeIssuedFormatted: '05/02/24',
        originalCaseType: 'Deficiency',
        taxYear: 'TEST_TAX_YEAR',
      },
    ];

    const results = await generatePetitionPdfInteractor(applicationContext, {
      caseCaptionExtension: 'TEST_caseCaptionExtension',
      caseTitle: 'TEST_caseTitle',
      contactPrimary: 'TEST_contactPrimary' as any,
      contactSecondary: 'TEST_contactSecondary' as any,
      hasIrsNotice: true,
      hasUploadedIrsNotice: true,
      irsNotices,
      originalCaseType: CASE_TYPES_MAP.deficiency,
      partyType: 'TEST_partyType',
      petitionFacts: ['TEST_petitionFacts'],
      petitionReasons: ['TEST_petitionReasons'],
      preferredTrialCity: 'TEST_preferredTrialCity',
      procedureType: 'TEST_procedureType',
    });

    const petitionCalls =
      applicationContext.getDocumentGenerators().petition.mock.calls;
    expect(petitionCalls.length).toEqual(1);
    expect(petitionCalls[0][0].data).toMatchObject({
      irsNotices: [
        {
          caseDescription: 'Notice of Deficiency',
          caseType: 'Deficiency',
          key: 'TEST_KEY',
          noticeIssuedDate: '2024-05-02T00:00:00.000-04:00',
          taxYear: 'TEST_TAX_YEAR',
        },
      ],
    });
    expect(results.fileId).toEqual(mockFileId);
  });

  it('should generate petition with correct case description when case type is disclosure', async () => {
    const irsNotices: any[] = [
      {
        caseType: CASE_TYPES_MAP.disclosure,
        key: 'TEST_KEY',
        noticeIssuedDate: '2024-05-02T00:00:00.000-04:00',
        originalCaseType: 'Disclosure1',
        taxYear: 'TEST_TAX_YEAR',
      },
    ];

    const results = await generatePetitionPdfInteractor(applicationContext, {
      caseCaptionExtension: 'TEST_caseCaptionExtension',
      caseTitle: 'TEST_caseTitle',
      contactPrimary: 'TEST_contactPrimary' as any,
      contactSecondary: 'TEST_contactSecondary' as any,
      hasIrsNotice: true,
      hasUploadedIrsNotice: true,
      irsNotices,
      originalCaseType: 'Disclosure1',
      partyType: 'TEST_partyType',
      petitionFacts: ['TEST_petitionFacts'],
      petitionReasons: ['TEST_petitionReasons'],
      preferredTrialCity: 'TEST_preferredTrialCity',
      procedureType: 'TEST_procedureType',
    });

    const petitionCalls =
      applicationContext.getDocumentGenerators().petition.mock.calls;
    expect(petitionCalls.length).toEqual(1);
    expect(petitionCalls[0][0].data).toMatchObject({
      caseDescription: CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE.Disclosure1,
      irsNotices: [
        {
          caseDescription: CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE.Disclosure1,
        },
      ],
    });
    expect(results.fileId).toEqual(mockFileId);
  });
});
