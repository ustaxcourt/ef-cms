import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateDocketEntryAction } from './validateDocketEntryAction';

presenter.providers.applicationContext = applicationContext;

describe('validateDocketEntryAction', () => {
  let successStub;
  let errorStub;

  let mockDocketEntry;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

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

  describe('dateReceived', () => {
    it('returns an error message if the user enters a two-digit year', async () => {
      applicationContext
        .getUseCases()
        .validateDocketEntryInteractor.mockReturnValue(null);

      await runAction(validateDocketEntryAction, {
        modules: {
          presenter,
        },
        state: {
          form: {
            ...mockDocketEntry,
            dateReceivedYear: '20',
          },
        },
      });

      expect(errorStub.mock.calls[0][0].errors.dateReceived).toEqual(
        'Enter a four-digit year',
      );
    });

    it('does not overwrite errors returned from the validateDocketEntryInteractor if the user enters a two-digit year', async () => {
      applicationContext
        .getUseCases()
        .validateDocketEntryInteractor.mockReturnValue({
          dateReceived: 'The date was invalid',
        });

      await runAction(validateDocketEntryAction, {
        modules: {
          presenter,
        },
        state: {
          form: {
            ...mockDocketEntry,
            dateReceivedYear: '20',
          },
        },
      });

      expect(errorStub.mock.calls[0][0].errors.dateReceived).toEqual(
        'The date was invalid',
      );
    });
  });

  describe('serviceDate', () => {
    it('returns an error message if the user enters a two-digit year', async () => {
      applicationContext
        .getUseCases()
        .validateDocketEntryInteractor.mockReturnValue(null);

      await runAction(validateDocketEntryAction, {
        modules: {
          presenter,
        },
        state: {
          form: {
            ...mockDocketEntry,
            serviceDateYear: '20',
          },
        },
      });

      expect(errorStub.mock.calls[0][0].errors.serviceDate).toEqual(
        'Enter a four-digit year',
      );
    });

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
            serviceDateYear: '20',
          },
        },
      });

      expect(errorStub.mock.calls[0][0].errors.serviceDate).toEqual(
        'The date was invalid',
      );
    });
  });
});
