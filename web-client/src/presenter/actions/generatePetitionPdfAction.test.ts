import { PETITION_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { generatePetitionPdfAction } from '@web-client/presenter/actions/generatePetitionPdfAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('generatePetitionPdfAction', () => {
  beforeEach(() => {
    applicationContext
      .getUseCases()
      .generatePetitionPdfInteractor.mockImplementation(() => {
        return new Promise(resolve =>
          resolve({
            fileId: 'TEST_FILE_ID',
          }),
        );
      });

    presenter.providers.applicationContext = applicationContext;
  });

  it('should not return/do anything if petition is not auto generated', async () => {
    const results = await runAction(generatePetitionPdfAction, {
      modules: {
        presenter,
      },
      state: {
        petitionFormatted: {
          petitionType: PETITION_TYPES.userUploaded,
        },
      },
    });
    const generatePetitionPdfInteractorCalls =
      applicationContext.getUseCases().generatePetitionPdfInteractor.mock.calls;

    expect(generatePetitionPdfInteractorCalls.length).toEqual(0);

    expect(results.output).toEqual(undefined);
  });

  it('should throw an error if data is invalid', async () => {
    await expect(
      runAction(generatePetitionPdfAction, {
        modules: {
          presenter,
        },
        state: {
          petitionFormatted: {
            petitionType: PETITION_TYPES.autoGenerated,
            testData: 'test',
          },
        },
      }),
    ).rejects.toThrow('Petition PDF generation failed due to invalid data.');
  });

  it('should generate the petition and save id in state when petition is auto generated', async () => {
    const results = await runAction(generatePetitionPdfAction, {
      modules: {
        presenter,
      },
      state: {
        petitionFormatted: {
          caseCaptionExtension: 'TEST_caseCaptionExtension',
          caseTitle: 'TEST_caseTitle',
          contactPrimary: {},
          hasIrsNotice: true,
          hasUploadedIrsNotice: true,
          originalCaseType: 'Deficiency',
          petitionFacts: ['TEST_petitionFacts'],
          petitionFileId: undefined,
          petitionProp: 'TEST_PROP',
          petitionReasons: ['TEST_petitionReasons'],
          petitionType: PETITION_TYPES.autoGenerated,
          preferredTrialCity: 'TEST_preferredTrialCity',
          procedureType: 'Regular',
        },
      },
    });

    const generatePetitionPdfInteractorCalls =
      applicationContext.getUseCases().generatePetitionPdfInteractor.mock.calls;

    expect(generatePetitionPdfInteractorCalls.length).toEqual(1);
    expect(generatePetitionPdfInteractorCalls[0][1]).toEqual({
      caseCaptionExtension: 'TEST_caseCaptionExtension',
      caseTitle: 'TEST_caseTitle',
      contactPrimary: {},
      entityName: 'GeneratePetitionPdf',
      hasIrsNotice: true,
      hasUploadedIrsNotice: true,
      originalCaseType: 'Deficiency',
      petitionFacts: ['TEST_petitionFacts'],
      petitionReasons: ['TEST_petitionReasons'],
      preferredTrialCity: 'TEST_preferredTrialCity',
      procedureType: 'Regular',
    });

    expect(results.state.petitionFormatted.petitionFileId).toEqual(
      'TEST_FILE_ID',
    );
  });
});
