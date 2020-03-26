import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import {
  createCaseFromPaperAction,
  setupPercentDone,
} from './createCaseFromPaperAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { applicationContextForClient } from '../../../../shared/src/business/test/createTestApplicationContext';

describe('createCaseFromPaperAction', () => {
  let errorStub, successStub, filePetitionFromPaperInteractor;

  beforeEach(() => {
    const applicationContext = applicationContextForClient;
    presenter.providers.applicationContext = applicationContext;

    filePetitionFromPaperInteractor = applicationContext.getUseCases()
      .filePetitionFromPaperInteractor;

    errorStub = jest.fn();
    successStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call filePetitionFromPaperInteractor with the petition metadata and files and call the success path when finished', async () => {
    filePetitionFromPaperInteractor.mockReturnValue(MOCK_CASE);

    await runAction(createCaseFromPaperAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '2019-11-05',
      },
      state: {
        form: {
          applicationForWaiverOfFilingFeeFile: {},
          ownershipDisclosureFile: {},
          petitionFile: {},
          requestForPlaceOfTrialFile: {},
          stinFile: {},
          trialCities: [{ city: 'Birmingham', state: 'Alabama' }],
          ...MOCK_CASE,
        },
        user: {
          email: 'petitionsclerk1@example.com',
        },
      },
    });

    expect(filePetitionFromPaperInteractor).toBeCalled();
    expect(filePetitionFromPaperInteractor.mock.calls[0][0]).toMatchObject({
      applicationForWaiverOfFilingFeeFile: {},
      ownershipDisclosureFile: {},
      petitionFile: {},
      petitionMetadata: {
        ...MOCK_CASE,
      },
      requestForPlaceOfTrialFile: {},
      stinFile: {},
    });
    expect(successStub).toBeCalled();
  });

  it('should call filePetitionFromPaperInteractor and call path.error when finished if it throws an error', async () => {
    filePetitionFromPaperInteractor.mockImplementation(() => {
      throw new Error('error');
    });

    await runAction(createCaseFromPaperAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          ownershipDisclosureFile: {},
          petitionFile: {},
          stinFile: {},
          trialCities: [{ city: 'Birmingham', state: 'Alabama' }],
          ...MOCK_CASE,
        },
        user: {
          email: 'petitioner1@example.com',
        },
      },
    });

    expect(filePetitionFromPaperInteractor).toBeCalled();
    expect(filePetitionFromPaperInteractor.mock.calls[0][0]).toMatchObject({
      ownershipDisclosureFile: {},
      petitionFile: {},
      petitionMetadata: {
        ...MOCK_CASE,
      },
      stinFile: {},
    });
    expect(errorStub).toBeCalled();
  });
});

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
        ownership: { size: 1 },
        petition: { size: 2 },
        stin: { size: 3 },
        trial: { size: 4 },
        waiverOfFilingFee: { size: 5 },
      },
      store,
    );

    expect(result).toMatchObject({
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

    result.ownership({ isDone: true });
    result.petition({ isDone: true });
    result.stin({ isDone: true });
    result.trial({ isDone: true });
    result.waiverOfFilingFee({ loaded: 0, total: 1 });
    expect(storeObject['fileUploadProgress.percentComplete']).toEqual(90);
    result.waiverOfFilingFee({ isDone: true });
    expect(storeObject['fileUploadProgress.percentComplete']).toEqual(100);
  });
});
