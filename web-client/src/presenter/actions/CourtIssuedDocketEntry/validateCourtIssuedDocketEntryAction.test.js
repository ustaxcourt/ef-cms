import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateCourtIssuedDocketEntryAction } from './validateCourtIssuedDocketEntryAction';

describe('validateCourtIssuedDocketEntryAction', () => {
  let validateCourtIssuedDocketEntryStub;
  let successStub;
  let errorStub;

  let mockDocketEntry;

  beforeEach(() => {
    validateCourtIssuedDocketEntryStub = jest.fn();
    successStub = jest.fn();
    errorStub = jest.fn();

    mockDocketEntry = {
      data: 'hello world',
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateCourtIssuedDocketEntryInteractor: validateCourtIssuedDocketEntryStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateCourtIssuedDocketEntryStub = jest.fn().mockReturnValue(null);
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
    validateCourtIssuedDocketEntryStub = jest.fn().mockReturnValue('error');
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
});
