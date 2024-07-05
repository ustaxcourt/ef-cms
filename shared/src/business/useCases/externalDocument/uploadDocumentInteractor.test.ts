import { applicationContext } from '../../test/createTestApplicationContext';
import {
  mockDocketClerkUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { uploadDocumentInteractor } from './uploadDocumentInteractor';

describe('uploadDocumentInteractor', () => {
  it('throws an error when an unauthorized user tries to access the use case', async () => {
    await expect(
      uploadDocumentInteractor(
        applicationContext,
        {
          documentFile: {
            primary: 'something',
          },
          key: 'abc',
          onUploadProgress: () => {},
        },
        undefined,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('runs successfully with no errors with a valid user', async () => {
    await expect(
      uploadDocumentInteractor(
        applicationContext,
        {
          documentFile: {
            primary: 'something',
          },
          key: 'abc',
          onUploadProgress: () => {},
        },
        mockPetitionsClerkUser,
      ),
    ).resolves.not.toThrow();
  });

  it('runs successfully with no errors with all data and valid user', async () => {
    await expect(
      uploadDocumentInteractor(
        applicationContext,
        {
          documentFile: {
            primary: 'something',
            primarySupporting0: 'something3',
            secondary: 'something2',
            secondarySupporting0: 'something4',
          },
          key: 'abc',
          onUploadProgress: () => {},
        },
        mockPetitionsClerkUser,
      ),
    ).resolves.not.toThrow();
  });

  it('runs successfully with no errors with all data and valid user who is a docketclerk', async () => {
    await expect(
      uploadDocumentInteractor(
        applicationContext,
        {
          documentFile: {
            primary: 'something',
            primarySupporting0: 'something3',
            secondary: 'something2',
            secondarySupporting0: 'something4',
          },
          key: 'abc',
          onUploadProgress: () => {},
        },
        mockDocketClerkUser,
      ),
    ).resolves.not.toThrow();
  });
});
