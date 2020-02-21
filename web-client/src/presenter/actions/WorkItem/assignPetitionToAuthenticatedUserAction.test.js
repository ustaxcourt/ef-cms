import { applicationContext } from '../../../applicationContext';
import { assignPetitionToAuthenticatedUserAction } from './assignPetitionToAuthenticatedUserAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();

const assignWorkItemsInteractorStub = jest.fn();

presenter.providers.applicationContext = {
  ...applicationContext,
  getCurrentUser: () => ({
    name: 'Some One',
    userId: 'abc',
  }),
  getUseCases: () => ({
    assignWorkItemsInteractor: assignWorkItemsInteractorStub,
  }),
};

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

    expect(assignWorkItemsInteractorStub).not.toHaveBeenCalled();
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
              docuementType: INITIAL_DOCUMENT_TYPES.petition.documentType,
              workItems: [{ isQC: true, workItemId: '123' }],
            },
          ],
        },
      },
    });

    expect(assignWorkItemsInteractorStub).not.toHaveBeenCalled();
  });
});
