import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateNoteOnCaseDetailAction } from './validateNoteOnCaseDetailAction';

describe('validateNoteOnCaseDetailAction', () => {
  let successStub;
  let errorStub;

  let mockNote;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    mockNote = {
      notes: 'hello notes',
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
      .validateCaseDetailInteractor.mockReturnValue(null);

    await runAction(validateNoteOnCaseDetailAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: mockNote,
        modal: {
          notes: mockNote,
        },
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateCaseDetailInteractor.mockReturnValue('error');
    await runAction(validateNoteOnCaseDetailAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: mockNote,
        modal: {
          notes: mockNote,
        },
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });

  it('should call validateCaseDetailInteractor with useCaseEntity true', async () => {
    await runAction(validateNoteOnCaseDetailAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: mockNote,
        modal: {
          notes: mockNote,
        },
      },
    });

    expect(
      applicationContext.getUseCases().validateCaseDetailInteractor.mock
        .calls[0][1],
    ).toMatchObject({ useCaseEntity: true });
  });
});
