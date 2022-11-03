import { ROLES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { uploadDocumentInteractor } from './uploadDocumentInteractor';

describe('uploadDocumentInteractor', () => {
  it('throws an error when an unauthorized user tries to access the use case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'other',
      userId: 'other',
    });

    await expect(
      uploadDocumentInteractor(applicationContext, {
        documentFile: {
          primary: 'something',
        },
        key: 'abc',
        onUploadProgress: () => {},
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('runs successfully with no errors with a valid user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });

    await expect(
      uploadDocumentInteractor(applicationContext, {
        documentFile: {
          primary: 'something',
        },
        key: 'abc',
        onUploadProgress: () => {},
      }),
    ).resolves.not.toThrow();
  });

  it('runs successfully with no errors with all data and valid user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });

    await expect(
      uploadDocumentInteractor(applicationContext, {
        documentFile: {
          primary: 'something',
          primarySupporting0: 'something3',
          secondary: 'something2',
          secondarySupporting0: 'something4',
        },
        key: 'abc',
        onUploadProgress: () => {},
      }),
    ).resolves.not.toThrow();
  });

  it('runs successfully with no errors with all data and valid user who is a docketclerk', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketclerk',
    });

    await expect(
      uploadDocumentInteractor(applicationContext, {
        documentFile: {
          primary: 'something',
          primarySupporting0: 'something3',
          secondary: 'something2',
          secondarySupporting0: 'something4',
        },
        key: 'abc',
        onUploadProgress: () => {},
      }),
    ).resolves.not.toThrow();
  });
});
