import { applicationContext } from '../test/createTestApplicationContext';
import { getUploadPolicyInteractor } from './getUploadPolicyInteractor';
import {
  mockAdminUser,
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('getUploadPolicyInteractor', () => {
  it('throw unauthorized error on invalid role', async () => {
    let error;
    try {
      await getUploadPolicyInteractor(
        applicationContext,
        {} as any,
        mockAdminUser,
      );
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('returns the expected policy when the file does not already exist', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUploadPolicy.mockReturnValue('policy');
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockReturnValue(false);

    const url = await getUploadPolicyInteractor(
      applicationContext,
      {} as any,
      mockPetitionerUser,
    );
    expect(url).toEqual('policy');
  });

  it('does not check if the file exists if the user is internal', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUploadPolicy.mockReturnValue('policy');

    await getUploadPolicyInteractor(
      applicationContext,
      {} as any,
      mockDocketClerkUser,
    );
    expect(
      applicationContext.getPersistenceGateway().isFileExists,
    ).not.toHaveBeenCalled();
  });

  it('throws an unauthorized exception when file already exists', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUploadPolicy.mockReturnValue('policy');
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockReturnValue(true);

    let error;
    try {
      await getUploadPolicyInteractor(
        applicationContext,
        {} as any,
        mockPetitionerUser,
      );
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });
});
