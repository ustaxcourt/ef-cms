import { FileUploadProgressMapType } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createCaseAction } from './createCaseAction';
import { getContactPrimary } from '../../../../shared/src/business/entities/cases/Case';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('createCaseAction', () => {
  const errorStub = jest.fn();
  const successStub = jest.fn();
  const fileUploadProgressMap: FileUploadProgressMapType = {
    applicationForWaiverOfFilingFee: {
      file: {},
      uploadProgress: jest.fn(),
    },
    attachmentToPetition: {
      file: {},
      uploadProgress: jest.fn(),
    },
    corporateDisclosure: {
      file: {},
      uploadProgress: jest.fn(),
    },
    petition: {
      file: {},
      uploadProgress: jest.fn(),
    },
    requestForPlaceOfTrial: {
      file: {},
      uploadProgress: jest.fn(),
    },
    stin: {
      file: {},
      uploadProgress: jest.fn(),
    },
  };

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    error: errorStub,
    success: successStub,
  };

  const { US_STATES } = applicationContext.getConstants();

  const mockPetitionMetadata = {
    trialCities: [{ city: 'Birmingham', state: US_STATES.AL }],
    ...MOCK_CASE,
    contactPrimary: {
      ...getContactPrimary(MOCK_CASE),
    },
  };

  const { addCoversheetInteractor, createCaseInteractor, generateDocumentIds } =
    applicationContext.getUseCases();

  beforeEach(() => {
    generateDocumentIds.mockReturnValue({
      attachmentToPetitionFileId: '123',
      corporateDisclosureFileId: '123',
      petitionFileId: '123',
      stinFileId: '123',
    });
    applicationContext.getCurrentUser.mockReturnValue({
      email: 'petitioner1@example.com',
    });
  });

  it('should call createCaseInteractor and addCoversheetInteractor THREE times (when we have an CDS form) with the petition metadata and files, then call the success path after completion', async () => {
    createCaseInteractor.mockReturnValue({
      ...MOCK_CASE,
      docketEntries: [
        MOCK_DOCUMENTS[0],
        {
          ...MOCK_DOCUMENTS[0],
          docketEntryId: '2b1e5fb3-e7f2-48c4-9a43-4f856ae46d66',
          documentTitle: 'Request for Place of Trial at Little Rock, Arkansas',
          documentType: 'Request for Place of Trial',
          eventCode: 'RQT',
          isFileAttached: false,
        },
        {
          ...MOCK_DOCUMENTS[0],
          docketEntryId: 'aaec01d8-98e7-4534-959f-6c384c4cf0e0',
          documentTitle: 'Corporate Disclosure Statement',
          documentType: 'Corporate Disclosure Statement',
          eventCode: 'CDS',
          isFileAttached: true,
        },
      ],
    });

    await runAction(createCaseAction, {
      modules: {
        presenter,
      },
      props: {
        fileUploadProgressMap,
      },
      state: {
        form: mockPetitionMetadata,
      },
    });

    expect(generateDocumentIds).toHaveBeenCalled();
    expect(generateDocumentIds.mock.calls[0][1]).toMatchObject({
      attachmentToPetitionUploadProgress:
        fileUploadProgressMap.attachmentToPetition,
      corporateDisclosureUploadProgress:
        fileUploadProgressMap.corporateDisclosure,
      petitionUploadProgress: fileUploadProgressMap.petition,
      stinUploadProgress: fileUploadProgressMap.stin,
    });

    expect(createCaseInteractor).toHaveBeenCalled();
    expect(createCaseInteractor.mock.calls[0][1]).toMatchObject({
      attachmentToPetitionFileId: '123',
      corporateDisclosureFileId: '123',
      petitionFileId: '123',
      petitionMetadata: mockPetitionMetadata,
      stinFileId: '123',
    });
    expect(addCoversheetInteractor).toHaveBeenCalledTimes(3); // STIN, Petition, and CDS
    expect(successStub).toHaveBeenCalled();
  });

  it('should call createCaseInteractor and call path.error when finished if it throws an error', async () => {
    createCaseInteractor.mockImplementation(() => {
      throw new Error('error');
    });

    await runAction(createCaseAction, {
      modules: {
        presenter,
      },
      props: {
        fileUploadProgressMap,
      },
      state: {
        form: mockPetitionMetadata,
      },
    });

    expect(generateDocumentIds).toHaveBeenCalled();
    expect(generateDocumentIds.mock.calls[0][1]).toMatchObject({
      attachmentToPetitionUploadProgress:
        fileUploadProgressMap.attachmentToPetition,
      corporateDisclosureUploadProgress:
        fileUploadProgressMap.corporateDisclosure,
      petitionUploadProgress: fileUploadProgressMap.petition,
      stinUploadProgress: fileUploadProgressMap.stin,
    });

    expect(createCaseInteractor).toHaveBeenCalled();
    expect(createCaseInteractor.mock.calls[0][1]).toMatchObject({
      attachmentToPetitionFileId: '123',
      corporateDisclosureFileId: '123',
      petitionFileId: '123',
      petitionMetadata: mockPetitionMetadata,
      stinFileId: '123',
    });
    expect(addCoversheetInteractor).not.toHaveBeenCalled();
    expect(errorStub).toHaveBeenCalled();
  });
});
