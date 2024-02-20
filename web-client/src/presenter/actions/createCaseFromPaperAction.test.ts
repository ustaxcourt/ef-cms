import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  createCaseFromPaperAction,
  setupPercentDone,
} from './createCaseFromPaperAction';
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
        uploadProgressCallbackMap: {
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
        uploadProgressCallbackMap: {
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

// this goes to new function
// TODO: update
describe('setupPercentDone', () => {
  it('should return progress functions for each file passed in', () => {
    const storeObject = {};
    const store = {
      set: (stateReference, value) => {
        storeObject[stateReference.strings[0]] = value;
      },
    };

    const result = setupPercentDone(
      {
        atp: { size: 1 },
        ownership: { size: 1 },
        petition: { size: 2 },
        stin: { size: 3 },
        trial: { size: 4 },
        waiverOfFilingFee: { size: 5 },
      },
      store,
      // get: jest.fn(),
    );

    console.log('result', result);

    expect(result).toMatchObject({
      atp: {},
      ownership: {},
      petition: {},
      stin: {},
      trial: {},
      waiverOfFilingFee: {},
    });
    expect(storeObject['fileUploadProgress.percentComplete']).toEqual(0);
    expect(storeObject['fileUploadProgress.timeRemaining']).toEqual(
      Number.POSITIVE_INFINITY,
    );
    expect(storeObject['fileUploadProgress.isUploading']).toEqual(true);

    result.atp.uploadProgress({ isDone: true });
    result.ownership.uploadProgress({ isDone: true });
    result.petition.uploadProgress({ isDone: true });
    result.stin.uploadProgress({ isDone: true });
    result.trial.uploadProgress({ isDone: true });
    result.waiverOfFilingFee.uploadProgress({ loaded: 0, total: 1 });
    expect(storeObject['fileUploadProgress.percentComplete']).toEqual(91);
    // result.waiverOfFilingFee({ isDone: true });
    // expect(storeObject['fileUploadProgress.percentComplete']).toEqual(100);
  });
});
