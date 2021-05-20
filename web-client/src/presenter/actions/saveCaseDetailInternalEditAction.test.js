import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { saveCaseDetailInternalEditAction } from './saveCaseDetailInternalEditAction';

describe('saveCaseDetailInternalEditAction', () => {
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();
  const mockUploadedKey = applicationContext.getUniqueId();

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor.mockImplementation(
        (_applicationContext, { key }) => {
          if (key) {
            return key;
          } else {
            return mockUploadedKey; //generated document id from upload
          }
        },
      );

    presenter.providers.applicationContext = applicationContext;
  });

  it('should replace a petition document file', async () => {
    const caseDetail = {
      ...MOCK_CASE,
      createdAt: '2019-03-01T21:40:46.415Z',
      status: CASE_STATUS_TYPES.new,
    };
    applicationContext
      .getUseCases()
      .saveCaseDetailInternalEditInteractor.mockReturnValue(caseDetail);

    await runAction(saveCaseDetailInternalEditAction, {
      modules: {
        presenter,
      },
      props: {
        formWithComputedDates: {
          ...caseDetail,
          petitionFile: {},
        },
      },
      state: {
        caseDetail: {
          ...caseDetail,
          docketEntries: [
            {
              docketEntryId: '123',
              eventCode: INITIAL_DOCUMENT_TYPES.petition.eventCode,
            },
          ],
        },
      },
    });

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[0][1].key,
    ).toEqual('123');
  });

  it('should not replace an initial filing document if it is not a petition document file', async () => {
    const caseDetail = {
      ...MOCK_CASE,
      createdAt: '2019-03-01T21:40:46.415Z',
      status: CASE_STATUS_TYPES.new,
    };
    applicationContext
      .getUseCases()
      .saveCaseDetailInternalEditInteractor.mockReturnValue(caseDetail);

    const formWithComputedDates = {
      ...caseDetail,
      ownershipDisclosureFile: {},
    };

    await runAction(saveCaseDetailInternalEditAction, {
      modules: {
        presenter,
      },
      props: {
        formWithComputedDates,
      },
      state: {
        caseDetail,
      },
    });

    const uploadedDocument = formWithComputedDates.docketEntries.find(
      document =>
        document.documentType ===
        INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
    );
    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[0][1].key,
    ).toBeUndefined();
    expect(uploadedDocument).toEqual({
      docketEntryId: mockUploadedKey,
      documentTitle: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentTitle,
      documentType: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
    });
  });

  it('should call the updateCaseTrialSortTags use case if case status is ready for trial', async () => {
    const caseDetail = {
      ...MOCK_CASE,
      createdAt: '2019-03-01T21:40:46.415Z',
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    };
    applicationContext
      .getUseCases()
      .saveCaseDetailInternalEditInteractor.mockReturnValue(caseDetail);

    await runAction(saveCaseDetailInternalEditAction, {
      modules: {
        presenter,
      },
      props: { formWithComputedDates: caseDetail },
      state: {
        caseDetail,
      },
    });
    expect(
      applicationContext.getUseCases().updateCaseTrialSortTagsInteractor.mock
        .calls[0][1].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
  });

  it('should not call the updateCaseTrialSortTags use case if case status is not ready for trial', async () => {
    const caseDetail = {
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.new,
    };
    applicationContext
      .getUseCases()
      .saveCaseDetailInternalEditInteractor.mockReturnValue(caseDetail);

    await runAction(saveCaseDetailInternalEditAction, {
      modules: {
        presenter,
      },
      props: { formWithComputedDates: caseDetail },
      state: {
        caseDetail,
      },
    });
    expect(
      applicationContext.getUseCases().updateCaseTrialSortTagsInteractor,
    ).not.toBeCalled();
  });

  it('should upload initial filing documents if they exist on the case', async () => {
    const mockRqtFile = {
      docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3850',
      documentType: 'Request for Place of Trial',
      eventCode: 'RQT',
      filedBy: 'Test Petitioner',
      userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
    };
    const caseDetail = {
      ...MOCK_CASE,
      docketEntries: [],
      requestForPlaceOfTrialFile: mockRqtFile,
      requestForPlaceOfTrialFileSize: 2,
    };

    await runAction(saveCaseDetailInternalEditAction, {
      modules: {
        presenter,
      },
      props: { formWithComputedDates: caseDetail },
    });

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[0][1].document,
    ).toEqual(mockRqtFile);
    expect(
      applicationContext.getUseCases().saveCaseDetailInternalEditInteractor.mock
        .calls[0][1].caseToUpdate.docketEntries,
    ).toMatchObject(
      expect.arrayContaining([
        {
          docketEntryId: mockUploadedKey,
          documentTitle: `Request for Place of Trial at ${MOCK_CASE.preferredTrialCity}`,
          documentType: 'Request for Place of Trial',
        },
      ]),
    );
  });

  it('should compute the RQT documentTitle based on the preferredTrialCity when an RQT already exists on the case', async () => {
    const mockRqtFile = {
      docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3850',
      documentType: 'Request for Place of Trial',
      eventCode: 'RQT',
      filedBy: 'Test Petitioner',
      userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
    };
    const caseDetail = {
      ...MOCK_CASE,
      docketEntries: [],
      preferredTrialCity: 'Atlantis',
      requestForPlaceOfTrialFile: mockRqtFile,
      requestForPlaceOfTrialFileSize: 2,
    };

    await runAction(saveCaseDetailInternalEditAction, {
      modules: {
        presenter,
      },
      props: { formWithComputedDates: caseDetail },
    });

    expect(
      applicationContext.getUtilities().replaceBracketed,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().saveCaseDetailInternalEditInteractor.mock
        .calls[0][1].caseToUpdate.docketEntries,
    ).toMatchObject(
      expect.arrayContaining([
        {
          docketEntryId: mockUploadedKey,
          documentTitle: 'Request for Place of Trial at Atlantis',
          documentType: 'Request for Place of Trial',
        },
      ]),
    );
  });
});
