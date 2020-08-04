import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteCorrespondenceDocumentAction } from './deleteCorrespondenceDocumentAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('deleteCorrespondenceDocumentAction', () => {
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
    await runAction(deleteCorrespondenceDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        modal: {
          correspondenceToDelete: {
            documentId: 'abc',
          },
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
  });

  it('should return the error path when an error occurred removing the correspondence document', async () => {
    applicationContext
      .getUseCases()
      .deleteCorrespondenceDocumentInteractor.mockRejectedValue(new Error());

    await runAction(deleteCorrespondenceDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        modal: {
          correspondenceToDelete: {
            documentId: 'abc',
          },
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
  });
});
