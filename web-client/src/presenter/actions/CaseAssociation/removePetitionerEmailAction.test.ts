import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { removePetitionerEmailAction } from '@web-client/presenter/actions/CaseAssociation/removePetitionerEmailAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('removePetitionerEmailAction', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: mockErrorPath,
      success: mockSuccessPath,
    };
  });

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .removePetitionerEmailInteractor.mockResolvedValue({});
  });

  it('should return an error alert if the removePetitionerEmailAction fails', async () => {
    applicationContext
      .getUseCases()
      .removePetitionerEmailInteractor.mockRejectedValue(new Error('error'));

    await runAction(removePetitionerEmailAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '',
        },
        modal: {
          petitionerEmailToRemove: 'test@example.com',
        },
      },
    });

    expect(mockErrorPath).toHaveBeenCalledWith({
      alertError: { message: `Unable to remove email. Please try again.` },
    });
  });

  it('should return a success alert if the removePetitionerEmailAction succeeds', async () => {
    await runAction(removePetitionerEmailAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
          petitioners: [
            {
              email: 'test@example.com',
            },
          ],
        },
        modal: {
          petitionerEmailToRemove: 'test@example.com',
        },
      },
    });
    expect(mockSuccessPath).toHaveBeenCalledWith({
      alertSuccess: { message: `Changes saved.` },
    });
  });
});
