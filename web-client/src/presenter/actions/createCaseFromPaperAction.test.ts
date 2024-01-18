import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  createCaseFromPaperAction,
  setupPercentDone,
} from './createCaseFromPaperAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

const { US_STATES } = applicationContext.getConstants();

describe('createCaseFromPaperAction', () => {
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
    applicationContext
      .getUseCases()
      .filePetitionFromPaperInteractor.mockReturnValue(MOCK_CASE);

    await runAction(createCaseFromPaperAction, {
      modules: {
        presenter,
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
        user: {
          email: 'petitionsclerk1@example.com',
        },
      },
    });

    expect(
      applicationContext.getUseCases().filePetitionFromPaperInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().filePetitionFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      applicationForWaiverOfFilingFeeFile: {},
      attachmentToPetitionFile: {},
      corporateDisclosureFile: {},
      petitionFile: {},
      petitionMetadata: MOCK_CASE,
      requestForPlaceOfTrialFile: {},
      stinFile: {},
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('should call filePetitionFromPaperInteractor and call path.error when finished if it throws an error', async () => {
    applicationContext
      .getUseCases()
      .filePetitionFromPaperInteractor.mockImplementation(() => {
        throw new Error('error');
      });

    await runAction(createCaseFromPaperAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          corporateDisclosureFile: {},
          petitionFile: {},
          stinFile: {},
          trialCities: [{ city: 'Birmingham', state: US_STATES.AL }],
          ...MOCK_CASE,
        },
        user: {
          email: 'petitioner1@example.com',
        },
      },
    });

    expect(
      applicationContext.getUseCases().filePetitionFromPaperInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().filePetitionFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      corporateDisclosureFile: {},
      petitionFile: {},
      petitionMetadata: MOCK_CASE,
      stinFile: {},
    });
    expect(errorStub).toHaveBeenCalled();
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
        atp: { size: 1 },
        ownership: { size: 1 },
        petition: { size: 2 },
        stin: { size: 3 },
        trial: { size: 4 },
        waiverOfFilingFee: { size: 5 },
      },
      store,
    );

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

    result.atp({ isDone: true });
    result.ownership({ isDone: true });
    result.petition({ isDone: true });
    result.stin({ isDone: true });
    result.trial({ isDone: true });
    result.waiverOfFilingFee({ loaded: 0, total: 1 });
    expect(storeObject['fileUploadProgress.percentComplete']).toEqual(91);
    result.waiverOfFilingFee({ isDone: true });
    expect(storeObject['fileUploadProgress.percentComplete']).toEqual(100);
  });
});
