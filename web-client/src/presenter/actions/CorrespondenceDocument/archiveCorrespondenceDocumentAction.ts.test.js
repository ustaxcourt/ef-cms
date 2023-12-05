import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { archiveCorrespondenceDocumentAction } from './archiveCorrespondenceDocumentAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('archiveCorrespondenceDocumentAction', () => {
  const successStub = jest.fn();
  const errorStub = jest.fn();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should return the success path when the correspondence document was successfully removed from the case', async () => {
    await runAction(archiveCorrespondenceDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        modal: {
          correspondenceToDelete: {
            correspondenceId: 'abc',
          },
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
  });

  it('should return the error path when an error occurred removing the correspondence document', async () => {
    applicationContext
      .getUseCases()
      .archiveCorrespondenceDocumentInteractor.mockRejectedValueOnce(
        new Error(),
      );

    await runAction(archiveCorrespondenceDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        modal: {
          correspondenceToDelete: {
            correspondenceId: 'abc',
          },
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
  });
});
