import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validatePetitionFromPaperAction } from './validatePetitionFromPaperAction';

describe('validatePetitionFromPaperAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
    presenter.providers.applicationContext = applicationContext;
  });

  it('runs validation on the petition from paper with a successful result', async () => {
    applicationContext
      .getUseCases()
      .validatePetitionFromPaperInteractor.mockReturnValue(null);

    await runAction(validatePetitionFromPaperAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('runs validation on the petition from paper with an invalid result', async () => {
    applicationContext
      .getUseCases()
      .validatePetitionFromPaperInteractor.mockReturnValue('validation errors');

    await runAction(validatePetitionFromPaperAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
