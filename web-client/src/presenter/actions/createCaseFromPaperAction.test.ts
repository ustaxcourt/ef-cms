import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createCaseFromPaperAction } from './createCaseFromPaperAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('createCaseFromPaperAction', () => {
  const { US_STATES } = applicationContext.getConstants();

  let errorStub, successStub;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    errorStub = jest.fn();
    successStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call filePetitionFromPaperInteractor with the petition metadata and files and call the success path when finished', async () => {
    const fileMetaData = {
      file: {},
      uploadProgress: () => {},
    };

    applicationContext
      .getUseCases()
      .filePetitionFromPaperInteractor.mockReturnValue(MOCK_CASE);

    await runAction(createCaseFromPaperAction, {
      modules: {
        presenter,
      },
      props: {
        fileUploadProgressMap: {
          atp: fileMetaData,
          corporate: fileMetaData,
          petition: fileMetaData,
          requestForPlaceOfTrial: fileMetaData,
          stin: fileMetaData,
          waiverOfFilingFee: fileMetaData,
        },
      },
      state: {
        form: {
          applicationForWaiverOfFilingFeeFile: {},
          attachmentToPetitionFile: {},
          corporateDisclosureFile: {},
          petitionFile: {},
          requestForPlaceOfTrialFile: {},
          stinFile: {},
          trialCities: [{ city: 'Birmingham', state: US_STATES.AL }],
          ...MOCK_CASE,
        },
      },
    });

    expect(
      applicationContext.getUseCases().filePetitionFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      applicationForWaiverOfFilingFeeUploadProgress: fileMetaData,
      atpUploadProgress: fileMetaData,
      corporateDisclosureUploadProgress: fileMetaData,
      petitionUploadProgress: fileMetaData,
      requestForPlaceOfTrialUploadProgress: fileMetaData,
      stinUploadProgress: fileMetaData,
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('should call filePetitionFromPaperInteractor and call path.error when finished if it throws an error', async () => {
    const fileMetaData = {
      file: {},
      uploadProgress: () => {},
    };
    applicationContext
      .getUseCases()
      .filePetitionFromPaperInteractor.mockImplementation(() => {
        throw new Error('error');
      });

    await runAction(createCaseFromPaperAction, {
      modules: {
        presenter,
      },

      props: {
        fileUploadProgressMap: {
          atp: fileMetaData,
          corporate: fileMetaData,
          petition: fileMetaData,
          requestForPlaceOfTrial: fileMetaData,
          stin: fileMetaData,
          waiverOfFilingFee: fileMetaData,
        },
      },
      state: {
        form: {
          applicationForWaiverOfFilingFeeFile: {},
          attachmentToPetitionFile: {},
          corporateDisclosureFile: {},
          petitionFile: {},
          requestForPlaceOfTrialFile: {},
          stinFile: {},
          trialCities: [{ city: 'Birmingham', state: US_STATES.AL }],
          ...MOCK_CASE,
        },
      },
    });

    expect(
      applicationContext.getUseCases().filePetitionFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      applicationForWaiverOfFilingFeeUploadProgress: fileMetaData,
      atpUploadProgress: fileMetaData,
      corporateDisclosureUploadProgress: fileMetaData,
      petitionUploadProgress: fileMetaData,
      requestForPlaceOfTrialUploadProgress: fileMetaData,
      stinUploadProgress: fileMetaData,
    });
    expect(errorStub).toHaveBeenCalled();
  });
});
