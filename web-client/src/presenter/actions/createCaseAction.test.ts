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

  const { addCoversheetInteractor, filePetitionInteractor } =
    applicationContext.getUseCases();

  applicationContext.getCurrentUser.mockReturnValue({
    email: 'petitioner1@example.com',
  });

  it('should call filePetitionInteractor and addCoversheetInteractor TWICE with the petition metadata and files and call the success path when finished', async () => {
    filePetitionInteractor.mockReturnValue({
      caseDetail: {
        ...MOCK_CASE,
        docketEntries: [
          MOCK_DOCUMENTS[0],
          {
            ...MOCK_DOCUMENTS[0],
            docketEntryId: '2b1e5fb3-e7f2-48c4-9a43-4f856ae46d66',
            documentTitle:
              'Request for Place of Trial at Little Rock, Arkansas',
            documentType: 'Request for Place of Trial',
            eventCode: 'RQT',
            isFileAttached: false,
          },
        ],
      },
      stinFileId: '123',
    });

    await runAction(createCaseAction, {
      modules: {
        presenter,
      },
      props: {
        fileUploadProgressMap,
      },
      state: {
        form: {
          trialCities: [{ city: 'Birmingham', state: US_STATES.AL }],
          ...MOCK_CASE,
          contactPrimary: {
            ...getContactPrimary(MOCK_CASE),
          },
        },
      },
    });

    expect(filePetitionInteractor).toHaveBeenCalled();
    expect(filePetitionInteractor.mock.calls[0][1]).toMatchObject({
      atpUploadProgress: fileUploadProgressMap.attachmentToPetition,
      corporateDisclosureUploadProgress:
        fileUploadProgressMap.corporateDisclosure,
      petitionMetadata: MOCK_CASE,
      petitionUploadProgress: fileUploadProgressMap.petition,
      stinUploadProgress: fileUploadProgressMap.stin,
    });
    expect(addCoversheetInteractor).toHaveBeenCalledTimes(2);
    expect(successStub).toHaveBeenCalled();
  });

  it('should call filePetitionInteractor and addCoversheetInteractor THREE times (when we have an CDS form) with the petition metadata and files, then call the success path after completion', async () => {
    filePetitionInteractor.mockReturnValue({
      caseDetail: {
        ...MOCK_CASE,
        docketEntries: [
          MOCK_DOCUMENTS[0],
          {
            ...MOCK_DOCUMENTS[0],
            docketEntryId: '2b1e5fb3-e7f2-48c4-9a43-4f856ae46d66',
            documentTitle:
              'Request for Place of Trial at Little Rock, Arkansas',
            documentType: 'Request for Place of Trial',
            eventCode: 'RQT',
            isFileAttached: false,
          },
          {
            ...MOCK_DOCUMENTS[0],
            docketEntryId: 'aaec01d8-98e7-4534-959f-6c384c4cf0e0',
            documentTitle: 'Corporate Disclosure Statement',
            documentType: 'Corporate Disclosure Statement',
            eventCode: 'RQT',
            isFileAttached: true,
          },
        ],
      },
      stinFileId: '123',
    });

    await runAction(createCaseAction, {
      modules: {
        presenter,
      },
      props: {
        fileUploadProgressMap,
      },
      state: {
        form: {
          trialCities: [{ city: 'Birmingham', state: US_STATES.AL }],
          ...MOCK_CASE,
          contactPrimary: {
            ...getContactPrimary(MOCK_CASE),
          },
        },
      },
    });

    expect(filePetitionInteractor).toHaveBeenCalled();
    expect(filePetitionInteractor.mock.calls[0][1]).toMatchObject({
      atpUploadProgress: fileUploadProgressMap.attachmentToPetition,
      corporateDisclosureUploadProgress:
        fileUploadProgressMap.corporateDisclosure,
      petitionMetadata: MOCK_CASE,
      petitionUploadProgress: fileUploadProgressMap.petition,
      stinUploadProgress: fileUploadProgressMap.stin,
    });
    expect(addCoversheetInteractor).toHaveBeenCalledTimes(3); // STIN, Petition, and CDS
    expect(successStub).toHaveBeenCalled();
  });

  it('should call filePetitionInteractor and call path.error when finished if it throws an error', async () => {
    filePetitionInteractor.mockImplementation(() => {
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
        form: {
          trialCities: [{ city: 'Birmingham', state: US_STATES.AL }],
          ...MOCK_CASE,
          contactPrimary: {
            ...getContactPrimary(MOCK_CASE),
          },
        },
      },
    });

    expect(filePetitionInteractor).toHaveBeenCalled();
    expect(filePetitionInteractor.mock.calls[0][1]).toMatchObject({
      atpUploadProgress: fileUploadProgressMap.attachmentToPetition,
      corporateDisclosureUploadProgress:
        fileUploadProgressMap.corporateDisclosure,
      petitionMetadata: MOCK_CASE,
      petitionUploadProgress: fileUploadProgressMap.petition,
      stinUploadProgress: fileUploadProgressMap.stin,
    });
    expect(addCoversheetInteractor).not.toHaveBeenCalled();
    expect(errorStub).toHaveBeenCalled();
  });
});
