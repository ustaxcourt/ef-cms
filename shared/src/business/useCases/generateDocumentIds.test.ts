import { ROLES } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { generateDocumentIds } from './generateDocumentIds';

describe('generateDocumentIds', () => {
  let petitionMetadata: object;

  const mockFile = {};

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor.mockResolvedValue(
        'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      );
  });

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });
    petitionMetadata = {};
  });
  it('throws an error when a null user tries to access the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue(null);

    await expect(
      generateDocumentIds(applicationContext, {} as any),
    ).rejects.toThrow();
  });

  it('throws an error when an unauthorized user tries to access the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsPractitioner,
      userId: 'irsPractitioner',
    });

    await expect(
      generateDocumentIds(applicationContext, {
        petitionFile: null,
        petitionMetadata: null,
      } as any),
    ).rejects.toThrow();
  });

  it('calls upload on a Petition file', async () => {
    await generateDocumentIds(applicationContext, {
      petitionMetadata,
      petitionUploadProgress: {
        file: mockFile,
        uploadProgress: jest.fn(),
      },
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[0][1].document,
    ).toEqual(mockFile);
  });

  it('uploads a Petition file and a STIN file', async () => {
    await generateDocumentIds(applicationContext, {
      petitionMetadata,
      petitionUploadProgress: {
        file: mockFile,
        uploadProgress: jest.fn(),
      },
      stinUploadProgress: {
        file: mockFile,
        uploadProgress: jest.fn(),
      },
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual(mockFile);
  });

  it('uploads a Corporate Disclosure Statement file and a petition', async () => {
    await generateDocumentIds(applicationContext, {
      corporateDisclosureUploadProgress: {
        file: mockFile,
        uploadProgress: jest.fn(),
      },
      petitionMetadata,
      petitionUploadProgress: {
        file: mockFile,
        uploadProgress: jest.fn(),
      },
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual(mockFile);
  });

  it('uploads Attachment to Petition file and a Petition file', async () => {
    await generateDocumentIds(applicationContext, {
      attachmentToPetitionUploadProgress: {
        file: mockFile,
        uploadProgress: jest.fn(),
      },
      petitionMetadata,
      petitionUploadProgress: {
        file: mockFile,
        uploadProgress: jest.fn(),
      },
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual(mockFile);
  });

  it('throws an error if there is an error uploading documents', async () => {
    applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor.mockRejectedValue('something wrong');

    await expect(
      generateDocumentIds(applicationContext, {
        petitionMetadata,
        petitionUploadProgress: {
          file: mockFile,
          uploadProgress: jest.fn(),
        },
      } as any),
    ).rejects.toThrow('Error generating document Ids');
  });
});
