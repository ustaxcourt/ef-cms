import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateCourtIssuedDocketEntryAction } from './validateCourtIssuedDocketEntryAction';

describe('validateCourtIssuedDocketEntryAction', () => {
  let successStub;
  let errorStub;
  let mockDocketEntry;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    mockDocketEntry = {
      data: 'hello world',
      docketEntryId: '123',
    };

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateCourtIssuedDocketEntryInteractor.mockReturnValue(null);
    await runAction(validateCourtIssuedDocketEntryAction, {
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
      .validateCourtIssuedDocketEntryInteractor.mockReturnValue('error');
    await runAction(validateCourtIssuedDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketEntry,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });

  it('should add a validation error for documentType if the document requires a signature and is unsigned', async () => {
    applicationContext
      .getUseCases()
      .validateCourtIssuedDocketEntryInteractor.mockReturnValue(null);

    await runAction(validateCourtIssuedDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: '123',
            },
          ],
        },
        docketEntryId: '123',
        form: {
          eventCode: 'O', // Event code requiring a signature
          mockDocketEntry,
        },
      },
    });

    expect(errorStub.mock.calls[0][0].errors).toMatchObject({
      documentType: 'Signature required for this document.',
    });
  });

  describe('date', () => {
    it('returns an error message if the user enters a two-digit year', async () => {
      applicationContext
        .getUseCases()
        .validateCourtIssuedDocketEntryInteractor.mockReturnValue(null);

      await runAction(validateCourtIssuedDocketEntryAction, {
        modules: {
          presenter,
        },
        state: {
          form: {
            ...mockDocketEntry,
            year: '20',
          },
        },
      });

      expect(errorStub.mock.calls[0][0].errors.date).toEqual(
        'Enter a four-digit year',
      );
    });

    it('does not overwrite errors returned from the validateCourtIssuedDocketEntryInteractor if the user enters a two-digit year', async () => {
      applicationContext
        .getUseCases()
        .validateCourtIssuedDocketEntryInteractor.mockReturnValue({
          date: 'The date was invalid',
        });

      await runAction(validateCourtIssuedDocketEntryAction, {
        modules: {
          presenter,
        },
        state: {
          form: {
            ...mockDocketEntry,
            year: '20',
          },
        },
      });

      expect(errorStub.mock.calls[0][0].errors.date).toEqual(
        'The date was invalid',
      );
    });
  });

  describe('filingDate', () => {
    it('returns an error message if the user enters a two-digit year', async () => {
      applicationContext
        .getUseCases()
        .validateCourtIssuedDocketEntryInteractor.mockReturnValue(null);

      await runAction(validateCourtIssuedDocketEntryAction, {
        modules: {
          presenter,
        },
        state: {
          form: {
            ...mockDocketEntry,
            filingDateYear: '20',
          },
        },
      });

      expect(errorStub.mock.calls[0][0].errors.filingDate).toEqual(
        'Enter a four-digit year',
      );
    });

    it('does not overwrite errors returned from the validateCourtIssuedDocketEntryInteractor if the user enters a two-digit year', async () => {
      applicationContext
        .getUseCases()
        .validateCourtIssuedDocketEntryInteractor.mockReturnValue({
          filingDate: 'The date was invalid',
        });

      await runAction(validateCourtIssuedDocketEntryAction, {
        modules: {
          presenter,
        },
        state: {
          form: {
            ...mockDocketEntry,
            filingDateYear: '20',
          },
        },
      });

      expect(errorStub.mock.calls[0][0].errors.filingDate).toEqual(
        'The date was invalid',
      );
    });
  });
});
