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

    await queueUpdateAssociatedCasesWorker(
      applicationContext,
      {
        user: MOCK_PRACTITIONER,
      },
      {
        email: MOCK_PRACTITIONER.email!,
        name: MOCK_PRACTITIONER.name,
        role: MOCK_PRACTITIONER.role,
        userId: MOCK_PRACTITIONER.userId,
      },
    );

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
    applicationContext.getWorkerGateway().queueWork.mockReturnValue({});
    const authorizedUser = {
      email: MOCK_PRACTITIONER.email!,
      name: MOCK_PRACTITIONER.name,
      role: MOCK_PRACTITIONER.role,
      userId: MOCK_PRACTITIONER.userId,
    };

    await queueUpdateAssociatedCasesWorker(
      applicationContext,
      {
        user: MOCK_PRACTITIONER,
      },
      authorizedUser,
    );

    expect(
      applicationContext.getWorkerGateway().queueWork,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        authorizedUser,
        payload: { docketNumber: '111-20', user: MOCK_PRACTITIONER },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
    expect(
      applicationContext.getWorkerGateway().queueWork,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        authorizedUser,
        payload: { docketNumber: '222-20', user: MOCK_PRACTITIONER },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
    expect(
      applicationContext.getWorkerGateway().queueWork,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        authorizedUser,
        payload: { docketNumber: '333-20', user: MOCK_PRACTITIONER },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
  });

  it('should attempt to send a message to update the petitioner cases via the worker gateway', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue(['111-20', '222-20', '333-20']);
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);
    applicationContext.getWorkerGateway().queueWork.mockReturnValue({});
    const authorizedUser = {
      email: petitionerUser.email,
      name: petitionerUser.name,
      role: petitionerUser.role,
      userId: petitionerUser.userId,
    };

    await queueUpdateAssociatedCasesWorker(
      applicationContext,
      {
        user: petitionerUser,
      },
      authorizedUser,
    );

    expect(
      applicationContext.getWorkerGateway().queueWork,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        authorizedUser,
        payload: { docketNumber: '111-20', user: petitionerUser },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
    expect(
      applicationContext.getWorkerGateway().queueWork,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        authorizedUser,
        payload: { docketNumber: '222-20', user: petitionerUser },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
    expect(
      applicationContext.getWorkerGateway().queueWork,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        authorizedUser,
        payload: { docketNumber: '333-20', user: petitionerUser },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
  });
});
