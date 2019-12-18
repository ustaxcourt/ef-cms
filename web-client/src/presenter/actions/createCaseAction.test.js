import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { createCaseAction } from './createCaseAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let filePetitionInteractorStub;
let addCoversheetInteractorStub;

presenter.providers.applicationContext = {
  getCurrentUser: () => ({
    email: 'petitioner1@example.com',
  }),
  getUseCases: () => ({
    addCoversheetInteractor: addCoversheetInteractorStub,
    filePetitionInteractor: filePetitionInteractorStub,
  }),
};

const errorStub = sinon.stub();
const successStub = sinon.stub();

presenter.providers.path = {
  error: errorStub,
  success: successStub,
};

describe('createCaseAction', () => {
  it('should call filePetitionInteractor and addCoversheetInteractor with the petition metadata and files and call the success path when finished', async () => {
    filePetitionInteractorStub = sinon.stub().returns(MOCK_CASE);
    addCoversheetInteractorStub = sinon.stub();

    await runAction(createCaseAction, {
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
      },
    });

    expect(filePetitionInteractorStub.called).toEqual(true);
    expect(filePetitionInteractorStub.getCall(0).args[0]).toMatchObject({
      ownershipDisclosureFile: {},
      petitionFile: {},
      petitionMetadata: {
        ...MOCK_CASE,
      },
      stinFile: {},
    });
    expect(addCoversheetInteractorStub.called).toEqual(true);
    expect(successStub.called).toEqual(true);
  });

  it('should call filePetitionInteractor and call path.error when finished if it throws an error', async () => {
    filePetitionInteractorStub = sinon.stub().throws();
    addCoversheetInteractorStub = sinon.stub();

    await runAction(createCaseAction, {
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
      },
    });

    expect(filePetitionInteractorStub.called).toEqual(true);
    expect(filePetitionInteractorStub.getCall(0).args[0]).toMatchObject({
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
