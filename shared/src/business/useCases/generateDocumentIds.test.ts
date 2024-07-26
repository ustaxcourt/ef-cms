import { applicationContext } from '../test/createTestApplicationContext';
import { generateDocumentIds } from './generateDocumentIds';
import {
  mockIrsPractitionerUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('generateDocumentIds', () => {
  let petitionMetadata: object;

  const mockFile = {};
  const mockFile2 = {};

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor.mockResolvedValue(
        'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      );
  });

  beforeEach(() => {
    petitionMetadata = {};
  });

  it('throws an error when an unauthorized user tries to access the case', async () => {
    await expect(
      generateDocumentIds(
        applicationContext,
        {
          petitionFile: null,
          petitionMetadata: null,
        } as any,
        mockIrsPractitionerUser,
      ),
    ).rejects.toThrow();
  });

  it('calls upload on a Petition file', async () => {
    await generateDocumentIds(
      applicationContext,
      {
        petitionMetadata,
        petitionUploadProgress: {
          file: mockFile,
          uploadProgress: jest.fn(),
        },
      } as any,
      mockPetitionerUser,
    );

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[0][1].document,
    ).toEqual(mockFile);
  });

  it('uploads a Petition file and a STIN file', async () => {
    await generateDocumentIds(
      applicationContext,
      {
        petitionMetadata,
        petitionUploadProgress: {
          file: mockFile,
          uploadProgress: jest.fn(),
        },
        stinUploadProgress: {
          file: mockFile,
          uploadProgress: jest.fn(),
        },
      } as any,
      mockPetitionerUser,
    );

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual(mockFile);
  });

  it('uploads a Corporate Disclosure Statement file and a petition', async () => {
    await generateDocumentIds(
      applicationContext,
      {
        corporateDisclosureUploadProgress: {
          file: mockFile,
          uploadProgress: jest.fn(),
        },
        petitionMetadata,
        petitionUploadProgress: {
          file: mockFile,
          uploadProgress: jest.fn(),
        },
      } as any,
      mockPetitionerUser,
    );

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual(mockFile);
  });

  it('uploads Attachment to Petition file and a Petition file', async () => {
    await generateDocumentIds(
      applicationContext,
      {
        attachmentToPetitionUploadProgress: [
          {
            file: mockFile,
            uploadProgress: jest.fn(),
          },
        ],
        petitionMetadata,
        petitionUploadProgress: {
          file: mockFile,
          uploadProgress: jest.fn(),
        },
      } as any,
      mockPetitionerUser,
    );
    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual(mockFile);
  });

  it('uploads multiple Attachment to Petition files and a Petition file', async () => {
    await generateDocumentIds(
      applicationContext,
      {
        attachmentToPetitionUploadProgress: [
          {
            file: mockFile,
            uploadProgress: jest.fn(),
          },
          {
            file: mockFile2,
            uploadProgress: jest.fn(),
          },
        ],
        petitionMetadata,
        petitionUploadProgress: {
          file: mockFile,
          uploadProgress: jest.fn(),
        },
      } as any,
      mockPetitionerUser,
    );

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls.length,
    ).toBe(3);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[0][1].document,
    ).toEqual(mockFile);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual(mockFile);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[2][1].document,
    ).toEqual(mockFile2);
  });

  it('throws an error if there is an error uploading documents', async () => {
    applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor.mockRejectedValue('something wrong');

    await expect(
      generateDocumentIds(
        applicationContext,
        {
          petitionMetadata,
          petitionUploadProgress: {
            file: mockFile,
            uploadProgress: jest.fn(),
          },
        } as any,
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Error generating document Ids');
  });
});
