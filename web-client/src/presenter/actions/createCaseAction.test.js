import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { createCaseAction } from './createCaseAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

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

const errorStub = jest.fn();
const successStub = jest.fn();

presenter.providers.path = {
  error: errorStub,
  success: successStub,
};

describe('createCaseAction', () => {
  it('should call filePetitionInteractor and addCoversheetInteractor with the petition metadata and files and call the success path when finished', async () => {
    filePetitionInteractorStub = jest.fn().mockReturnValue(MOCK_CASE);
    addCoversheetInteractorStub = jest.fn();

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

    expect(filePetitionInteractorStub).toBeCalled();
    expect(filePetitionInteractorStub.mock.calls[0][0]).toMatchObject({
      ownershipDisclosureFile: {},
      petitionFile: {},
      petitionMetadata: {
        ...MOCK_CASE,
      },
      stinFile: {},
    });
    expect(addCoversheetInteractorStub).toBeCalled();
    expect(successStub).toBeCalled();
  });

  it('should call filePetitionInteractor and call path.error when finished if it throws an error', async () => {
    filePetitionInteractorStub = jest.fn().mockImplementation(() => {
      throw new Error('error');
    });
    addCoversheetInteractorStub = jest.fn();

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

    expect(filePetitionInteractorStub).toBeCalled();
    expect(filePetitionInteractorStub.mock.calls[0][0]).toMatchObject({
      ownershipDisclosureFile: {},
      petitionFile: {},
      petitionMetadata: {
        ...MOCK_CASE,
      },
      stinFile: {},
    });
    expect(addCoversheetInteractorStub).not.toBeCalled();
    expect(errorStub).toBeCalled();
  });
});
