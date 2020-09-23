import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { assignPetitionToAuthenticatedUserAction } from './assignPetitionToAuthenticatedUserAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('assignPetitionToAuthenticatedUserAction', () => {
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();
  const { assignWorkItemsInteractor } = applicationContext.getUseCases();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Some One',
      userId: 'abc',
    });
  });

  it('should not assign the workitem if the qc work item is not present', async () => {
    await runAction(assignPetitionToAuthenticatedUserAction, {
      modules: {
        presenter,
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
      },
    });

    expect(assignWorkItemsInteractor).toHaveBeenCalled();
  });
});
