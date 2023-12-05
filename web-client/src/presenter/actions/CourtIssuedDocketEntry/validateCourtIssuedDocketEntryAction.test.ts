import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
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

  describe('date', () => {
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
            filingDate: '12/12/20',
          },
        },
      });

      expect(errorStub.mock.calls[0][0].errors.date).toEqual(
        'The date was invalid',
      );
    });
  });

  describe('filingDate', () => {
    it('should not overwrite errors returned from the validateCourtIssuedDocketEntryInteractor if the user enters a two-digit year', async () => {
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
            filingDate: '12/12/20',
          },
        },
      });

      expect(errorStub.mock.calls[0][0].errors.filingDate).toEqual(
        'The date was invalid',
      );
    });
  });

  describe('documentType', () => {
    it('should add a validation error for documentType when the document requires a signature and is unsigned', async () => {
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
            ...mockDocketEntry,
            eventCode: 'O', // Event code requiring a signature
          },
        },
      });

      expect(errorStub.mock.calls[0][0].errors).toMatchObject({
        documentType: 'Signature required for this document.',
      });
    });

    it('should not overwrite errors returned from the validateCourtIssuedDocketEntryInteractor when the document requires a signature and is unsigned', async () => {
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
          caseDetail: {
            docketEntries: [
              {
                docketEntryId: '123',
              },
            ],
          },
          docketEntryId: '123',
          form: {
            ...mockDocketEntry,
            eventCode: 'O', // Event code requiring a signature
          },
        },
      });

      expect(errorStub.mock.calls[0][0].errors).toMatchObject({
        documentType: 'Signature required for this document.',
        filingDate: 'The date was invalid',
      });
    });

    it('should not add a validation error for documentType when the document requires a signature and is signed', async () => {
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
                signedAt: '2019-01-01T00:00:00.000Z',
              },
            ],
          },
          docketEntryId: '123',
          form: {
            ...mockDocketEntry,
            eventCode: 'O', // Event code requiring a signature
          },
        },
      });

      expect(successStub).toHaveBeenCalled();
    });

    it('should not throw an error when the docket entry was not found on the case', async () => {
      applicationContext
        .getUseCases()
        .validateCourtIssuedDocketEntryInteractor.mockReturnValue(null);

      await runAction(validateCourtIssuedDocketEntryAction, {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketEntries: [],
          },
          docketEntryId: '123',
          form: {
            ...mockDocketEntry,
            eventCode: 'O', // Event code requiring a signature
          },
        },
      });

      expect(errorStub).toHaveBeenCalled();
    });
  });
});
