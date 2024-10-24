import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { assignPetitionToAuthenticatedUserAction } from './assignPetitionToAuthenticatedUserAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('assignPetitionToAuthenticatedUserAction', () => {
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();
  const { assignWorkItemsInteractor } = applicationContext.getUseCases();

  const user = {
    name: 'Some One',
    userId: 'abc',
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should not assign the workitem if the qc work item is not present', async () => {
    await runAction(assignPetitionToAuthenticatedUserAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [],
        },
        user,
      },
    });

    expect(assignWorkItemsInteractor).not.toHaveBeenCalled();
  });

  it('should assign the workitem if the qc work item is present', async () => {
    await runAction(assignPetitionToAuthenticatedUserAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
              workItem: { workItemId: '123' },
            },
          ],
        },
        user,
      },
    });

    expect(assignWorkItemsInteractor).toHaveBeenCalled();
  });
});
