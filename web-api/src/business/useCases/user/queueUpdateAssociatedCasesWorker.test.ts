import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import {
  MOCK_PRACTITIONER,
  petitionerUser,
} from '../../../../../shared/src/test/mockUsers';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { queueUpdateAssociatedCasesWorker } from './queueUpdateAssociatedCasesWorker';

describe('queueUpdateAssociatedCasesWorker', () => {
  it('should lookup the docket numbers for the current user', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue(['111-20', '222-20', '333-20']);
    applicationContext.getCurrentUser.mockReturnValue(MOCK_PRACTITIONER);

    await queueUpdateAssociatedCasesWorker(applicationContext, {
      user: MOCK_PRACTITIONER,
    });

    expect(
      await applicationContext.getPersistenceGateway().getDocketNumbersByUser,
    ).toHaveBeenCalledWith({
      applicationContext,
      userId: MOCK_PRACTITIONER.userId,
    });
  });

  it('should return an object that includes all of the docketNumbers associated with the practitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue(['111-20', '222-20', '333-20']);
    applicationContext.getCurrentUser.mockReturnValue(MOCK_PRACTITIONER);
    applicationContext.getWorkerGateway().initialize.mockReturnValue({});

    await queueUpdateAssociatedCasesWorker(applicationContext, {
      user: MOCK_PRACTITIONER,
    });

    expect(
      applicationContext.getWorkerGateway().initialize,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        payload: { docketNumber: '111-20', user: MOCK_PRACTITIONER },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
        user: MOCK_PRACTITIONER,
      },
    });
    expect(
      applicationContext.getWorkerGateway().initialize,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        payload: { docketNumber: '222-20', user: MOCK_PRACTITIONER },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
        user: MOCK_PRACTITIONER,
      },
    });
    expect(
      applicationContext.getWorkerGateway().initialize,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        payload: { docketNumber: '333-20', user: MOCK_PRACTITIONER },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
        user: MOCK_PRACTITIONER,
      },
    });
  });

  it('should attempt to send a message to update the petitioner cases via the worker gateway', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue(['111-20', '222-20', '333-20']);
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);
    applicationContext.getWorkerGateway().initialize.mockReturnValue({});

    await queueUpdateAssociatedCasesWorker(applicationContext, {
      user: petitionerUser,
    });

    expect(
      applicationContext.getWorkerGateway().initialize,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        payload: { docketNumber: '111-20', user: petitionerUser },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
        user: petitionerUser,
      },
    });
    expect(
      applicationContext.getWorkerGateway().initialize,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        payload: { docketNumber: '222-20', user: petitionerUser },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
        user: petitionerUser,
      },
    });
    expect(
      applicationContext.getWorkerGateway().initialize,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        payload: { docketNumber: '333-20', user: petitionerUser },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
        user: petitionerUser,
      },
    });
  });
});
