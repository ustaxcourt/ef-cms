import { ATP_DOCKET_ENTRY } from '@shared/test/mockDocketEntry';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createCaseFromPaperAction } from './createCaseFromPaperAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('createCaseFromPaperAction', () => {
  let errorStub, successStub;

  const fileMetaData = {
    file: {},
    uploadProgress: () => {},
  };

  const MOCK_CASE_WITH_ATP = {
    ...MOCK_CASE,
    docketEntries: [...MOCK_CASE.docketEntries, ATP_DOCKET_ENTRY],
  };

  const mockProps = {
    fileUploadProgressMap: {
      applicationForWaiverOfFilingFee: fileMetaData,
      attachmentToPetition: fileMetaData,
      corporateDisclosure: fileMetaData,
      petition: fileMetaData,
      requestForPlaceOfTrial: fileMetaData,
      stin: fileMetaData,
    },
  };

  const mockState = {
    form: MOCK_CASE_WITH_ATP,
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    errorStub = jest.fn();
    successStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  beforeEach(() => {
    applicationContext.getUseCases().generateDocumentIds.mockReturnValue({
      applicationForWaiverOfFilingFeeFileId: '123',
      attachmentToPetitionFileIds: ['123'],
      corporateDisclosureFileId: '123',
      petitionFileId: '123',
      requestForPlaceOfTrialFileId: '123',
      stinFileId: '123',
    });
  });

  it('should generate document ids for files selected, then call createCaseFromPaperInteractor with the petition metadata and ids and call the success path when finished', async () => {
    applicationContext
      .getUseCases()
      .createCaseFromPaperInteractor.mockReturnValue(MOCK_CASE_WITH_ATP);

    await runAction(createCaseFromPaperAction, {
      modules: {
        presenter,
      },
      props: mockProps,
      state: mockState,
    });

    expect(
      applicationContext.getUseCases().generateDocumentIds.mock.calls[0][1],
    ).toMatchObject({
      applicationForWaiverOfFilingFeeUploadProgress: fileMetaData,
      attachmentToPetitionUploadProgress: [fileMetaData],
      corporateDisclosureUploadProgress: fileMetaData,
      petitionUploadProgress: fileMetaData,
      requestForPlaceOfTrialUploadProgress: fileMetaData,
      stinUploadProgress: fileMetaData,
    });

    expect(
      applicationContext.getUseCases().createCaseFromPaperInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().createCaseFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      applicationForWaiverOfFilingFeeFileId: '123',
      attachmentToPetitionFileId: '123',
      corporateDisclosureFileId: '123',
      petitionFileId: '123',
      petitionMetadata: MOCK_CASE_WITH_ATP,
      requestForPlaceOfTrialFileId: '123',
      stinFileId: '123',
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('generate document ids for files selected, but take path.error when finished if createCaseFromPaperInteractor throws an error', async () => {
    applicationContext
      .getUseCases()
      .createCaseFromPaperInteractor.mockImplementation(() => {
        throw new Error('error');
      });

    await runAction(createCaseFromPaperAction, {
      modules: {
        presenter,
      },
      props: {
        fileUploadProgressMap: {
          ...mockProps.fileUploadProgressMap,
          attachmentToPetition: undefined,
        },
      },
      state: mockState,
    });

    expect(
      applicationContext.getUseCases().generateDocumentIds.mock.calls[0][1],
    ).toMatchObject({
      applicationForWaiverOfFilingFeeUploadProgress: fileMetaData,
      corporateDisclosureUploadProgress: fileMetaData,
      petitionUploadProgress: fileMetaData,
      requestForPlaceOfTrialUploadProgress: fileMetaData,
      stinUploadProgress: fileMetaData,
    });
    expect(errorStub).toHaveBeenCalled();
  });
});
