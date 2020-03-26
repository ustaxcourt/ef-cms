import { assignPetitionToAuthenticatedUserAction } from './assignPetitionToAuthenticatedUserAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
const applicationContext = applicationContextForClient;
presenter.providers.applicationContext = applicationContext;
const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();

applicationContext.getCurrentUser.mockReturnValue({
  name: 'Some One',
  userId: 'abc',
});
const assignWorkItemsInteractor = applicationContext.getUseCases()
  .assignWorkItemsInteractor;

describe('assignPetitionToAuthenticatedUserAction', () => {
  afterEach(() => {
    jest.restoreAllMocks();
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
          documents: [
            {
              documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
              workItems: [{ isQC: true, workItemId: '123' }],
            },
          ],
        },
      },
    });

    expect(assignWorkItemsInteractor).toHaveBeenCalled();
  });
});
