import { ATP_DOCKET_ENTRY, MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createCaseAction } from './createCaseAction';
import { getContactPrimary } from '../../../../shared/src/business/entities/cases/Case';
import { omit } from 'lodash';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('createCaseAction', () => {
  const errorStub = jest.fn();
  const successStub = jest.fn();

  const fileUploadProgressMap = {
    applicationForWaiverOfFilingFee: { file: {}, uploadProgress: jest.fn() },
    attachmentToPetition: { file: {}, uploadProgress: jest.fn() },
    corporateDisclosure: { file: {}, uploadProgress: jest.fn() },
    petition: { file: {}, uploadProgress: jest.fn() },
    requestForPlaceOfTrial: { file: {}, uploadProgress: jest.fn() },
    stin: { file: {}, uploadProgress: jest.fn() },
  };

  presenter.providers.applicationContext = applicationContext;
  presenter.providers.path = { error: errorStub, success: successStub };

  const { US_STATES } = applicationContext.getConstants();

  const mockCaseWithATP = {
    ...MOCK_CASE,
    docketEntries: [...MOCK_CASE.docketEntries, ATP_DOCKET_ENTRY],
  };

  const mockPetitionMetadata = {
    ...mockCaseWithATP,
    contactPrimary: { ...getContactPrimary(MOCK_CASE) },
    trialCities: [{ city: 'Birmingham', state: US_STATES.AL }],
  };

  const mockForm = omit(mockPetitionMetadata, 'trialCities');

  const { addCoversheetInteractor, createCaseInteractor, generateDocumentIds } =
    applicationContext.getUseCases();

  beforeAll(() => {
    generateDocumentIds.mockReturnValue({
      attachmentToPetitionFileIds: ['123'],
      corporateDisclosureFileId: '123',
      petitionFileId: '123',
      stinFileId: '123',
    });
  });

  it('should call createCaseInteractor and addCoversheetInteractor FOUR times when there is a CDS form, and then call the success path', async () => {
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
        ATP_DOCKET_ENTRY,
      ],
    });

    await runAction(createCaseAction, {
      modules: { presenter },
      props: { fileUploadProgressMap },
      state: {
        form: mockPetitionMetadata,
        user: { email: 'petitioner1@example.com' },
      },
    });

    expect(generateDocumentIds).toHaveBeenCalled();
    expect(generateDocumentIds).toHaveBeenCalledWith(
      expect.anything(),
      {
        attachmentToPetitionUploadProgress: [
          fileUploadProgressMap.attachmentToPetition,
        ],
        corporateDisclosureUploadProgress:
          fileUploadProgressMap.corporateDisclosure,
        petitionUploadProgress: fileUploadProgressMap.petition,
        stinUploadProgress: fileUploadProgressMap.stin,
      },
      { email: 'petitioner1@example.com' },
    );

    expect(createCaseInteractor).toHaveBeenCalled();

    expect(createCaseInteractor).toHaveBeenCalledWith(expect.anything(), {
      attachmentToPetitionFileIds: ['123'],
      corporateDisclosureFileId: '123',
      petitionFileId: '123',
      petitionMetadata: mockForm,
      stinFileId: '123',
    });

    expect(addCoversheetInteractor).toHaveBeenCalledTimes(4); // STIN, Petition, ATP and CDS
    expect(successStub).toHaveBeenCalled();
  });

  it('should call createCaseInteractor and call path.error if it throws an error', async () => {
    generateDocumentIds.mockReturnValueOnce({
      corporateDisclosureFileId: '123',
      petitionFileId: '123',
      stinFileId: '123',
    });
    createCaseInteractor.mockImplementationOnce(() => {
      throw new Error('error');
    });

    await runAction(createCaseAction, {
      modules: { presenter },
      props: {
        fileUploadProgressMap: {
          ...fileUploadProgressMap,
          attachmentToPetition: undefined,
        },
      },
      state: {
        form: mockPetitionMetadata,
        user: { email: 'petitioner1@example.com' },
      },
    });

    expect(generateDocumentIds).toHaveBeenCalled();
    expect(generateDocumentIds).toHaveBeenCalledWith(
      expect.anything(),
      {
        corporateDisclosureUploadProgress:
          fileUploadProgressMap.corporateDisclosure,
        petitionUploadProgress: fileUploadProgressMap.petition,
        stinUploadProgress: fileUploadProgressMap.stin,
      },
      { email: 'petitioner1@example.com' },
    );

    expect(createCaseInteractor).toHaveBeenCalled();
    expect(createCaseInteractor).toHaveBeenCalledWith(expect.anything(), {
      corporateDisclosureFileId: '123',
      petitionFileId: '123',
      petitionMetadata: mockForm,
      stinFileId: '123',
    });

    expect(addCoversheetInteractor).not.toHaveBeenCalled();
    expect(errorStub).toHaveBeenCalled();
  });
});
