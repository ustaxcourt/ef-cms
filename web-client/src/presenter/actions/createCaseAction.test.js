import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { createCaseAction } from './createCaseAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

const {
  addCoversheetInteractor,
  filePetitionInteractor,
} = applicationContext.getUseCases();

applicationContext.getCurrentUser.mockReturnValue({
  email: 'petitioner1@example.com',
});

const errorStub = jest.fn();
const successStub = jest.fn();

presenter.providers.path = {
  error: errorStub,
  success: successStub,
};

describe('createCaseAction', () => {
  it('should call filePetitionInteractor and addCoversheetInteractor with the petition metadata and files and call the success path when finished', async () => {
    filePetitionInteractor.mockReturnValue(MOCK_CASE);

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

    expect(filePetitionInteractor).toBeCalled();
    expect(filePetitionInteractor.mock.calls[0][0]).toMatchObject({
      ownershipDisclosureFile: {},
      petitionFile: {},
      petitionMetadata: {
        ...MOCK_CASE,
      },
      stinFile: {},
    });
    expect(addCoversheetInteractor).toBeCalled();
    expect(successStub).toBeCalled();
  });

  it('should call filePetitionInteractor and call path.error when finished if it throws an error', async () => {
    filePetitionInteractor.mockImplementation(() => {
      throw new Error('error');
    });

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

    expect(filePetitionInteractor).toBeCalled();
    expect(filePetitionInteractor.mock.calls[0][0]).toMatchObject({
      ownershipDisclosureFile: {},
      petitionFile: {},
      petitionMetadata: {
        ...MOCK_CASE,
      },
      stinFile: {},
    });
    expect(addCoversheetInteractor).not.toBeCalled();
    expect(errorStub).toBeCalled();
  });
});
