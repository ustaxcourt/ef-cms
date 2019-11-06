import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import {
  createCaseFromPaperAction,
  setupPercentDone,
} from './createCaseFromPaperAction';
import { prepareDateFromString } from '../../../../shared/src/business/utilities/DateHandler';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let filePetitionFromPaperInteractorStub;
let addCoversheetInteractorStub;

presenter.providers.applicationContext = {
  getUseCases: () => ({
    addCoversheetInteractor: addCoversheetInteractorStub,
    filePetitionFromPaperInteractor: filePetitionFromPaperInteractorStub,
  }),
  getUtilities: () => ({
    prepareDateFromString,
  }),
};

const errorStub = sinon.stub();
const successStub = sinon.stub();

presenter.providers.path = {
  error: errorStub,
  success: successStub,
};

describe('createCaseFromPaperAction', () => {
  it('should call filePetitionFromPaperInteractor and addCoversheetInteractor with the petition metadata and files and call the success path when finished', async () => {
    filePetitionFromPaperInteractorStub = sinon.stub().returns(MOCK_CASE);
    addCoversheetInteractorStub = sinon.stub();

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

    expect(filePetitionFromPaperInteractorStub.called).toEqual(true);
    expect(
      filePetitionFromPaperInteractorStub.getCall(0).args[0],
    ).toMatchObject({
      applicationForWaiverOfFilingFeeFile: {},
      ownershipDisclosureFile: {},
      petitionFile: {},
      petitionMetadata: {
        ...MOCK_CASE,
      },
      requestForPlaceOfTrialFile: {},
      stinFile: {},
    });
    expect(addCoversheetInteractorStub.called).toEqual(true);
    expect(successStub.called).toEqual(true);
  });

  it('should call filePetitionFromPaperInteractor and call path.error when finished if it throws an error', async () => {
    filePetitionFromPaperInteractorStub = sinon.stub().throws();
    addCoversheetInteractorStub = sinon.stub();

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

    expect(filePetitionFromPaperInteractorStub.called).toEqual(true);
    expect(
      filePetitionFromPaperInteractorStub.getCall(0).args[0],
    ).toMatchObject({
      ownershipDisclosureFile: {},
      petitionFile: {},
      petitionMetadata: {
        ...MOCK_CASE,
      },
      stinFile: {},
    });
    expect(addCoversheetInteractorStub.called).toEqual(false);
    expect(errorStub.called).toEqual(true);
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
    expect(storeObject.percentComplete).toEqual(0);
    expect(storeObject.timeRemaining).toEqual(Number.POSITIVE_INFINITY);
    expect(storeObject.isUploading).toEqual(true);

    result.ownership({ isDone: true });
    result.petition({ isDone: true });
    result.stin({ isDone: true });
    result.trial({ isDone: true });
    result.waiverOfFilingFee({ loaded: 0, total: 1 });
    expect(storeObject.percentComplete).toEqual(90);
    result.waiverOfFilingFee({ isDone: true });
    expect(storeObject.percentComplete).toEqual(100);
  });
});
