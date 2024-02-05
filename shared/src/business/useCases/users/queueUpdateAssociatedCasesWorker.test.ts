import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import { MOCK_PRACTITIONER, petitionerUser } from '../../../test/mockUsers';
import { applicationContext } from '../../test/createTestApplicationContext';
import { queueUpdateAssociatedCasesWorker } from './queueUpdateAssociatedCasesWorker';

describe('queueUpdateAssociatedCasesWorker', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue(['111-20', '222-20', '333-20']);
    applicationContext.getCurrentUser.mockReturnValue(MOCK_PRACTITIONER);
  });

  it('should lookup the docket numbers for the current user', async () => {
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
      },
    });
    expect(
      applicationContext.getWorkerGateway().initialize,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        payload: { docketNumber: '222-20', user: MOCK_PRACTITIONER },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
    expect(
      applicationContext.getWorkerGateway().initialize,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        payload: { docketNumber: '333-20', user: MOCK_PRACTITIONER },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
  });

  it('should attempt to send a message to update the petitioner cases via the worker gateway', async () => {
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
      },
    });
    expect(
      applicationContext.getWorkerGateway().initialize,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        payload: { docketNumber: '222-20', user: petitionerUser },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
    expect(
      applicationContext.getWorkerGateway().initialize,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        payload: { docketNumber: '333-20', user: petitionerUser },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
  });
});
