import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateDocketEntryAction } from './validateDocketEntryAction';

describe('validateDocketEntryAction', () => {
  let successStub;
  let errorStub;

  let mockDocketEntry;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    mockDocketEntry = {
      data: 'hello world',
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateDocketEntryInteractor.mockReturnValue(null);

    await runAction(validateDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketEntry,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateDocketEntryInteractor.mockReturnValue('error');

    await runAction(validateDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketEntry,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });

  describe('receivedAt', () => {
    it('does not overwrite errors returned from the validateDocketEntryInteractor if the user enters a two-digit year', async () => {
      applicationContext
        .getUseCases()
        .validateDocketEntryInteractor.mockReturnValue({
          receivedAt: 'The date was invalid',
        });

      await runAction(validateDocketEntryAction, {
        modules: {
          presenter,
        },
        state: {
          form: {
            ...mockDocketEntry,
            receivedAt: '12/12/20',
          },
        },
      });

      expect(errorStub.mock.calls[0][0].errors.receivedAt).toEqual(
        'The date was invalid',
      );
    });
  });

  describe('serviceDate', () => {
    it('does not overwrite errors returned from the validateDocketEntryInteractor if the user enters a two-digit year', async () => {
      applicationContext
        .getUseCases()
        .validateDocketEntryInteractor.mockReturnValue({
          serviceDate: 'The date was invalid',
        });

      await runAction(validateDocketEntryAction, {
        modules: {
          presenter,
        },
        state: {
          form: {
            ...mockDocketEntry,
            serviceDate: '12/12/20',
          },
        },
      });

      expect(errorStub.mock.calls[0][0].errors.serviceDate).toEqual(
        'The date was invalid',
      );
    });
  });
});
