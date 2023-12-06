import {
  CONTACT_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  OBJECTIONS_OPTIONS_MAP,
  PARTY_TYPES,
  SIMULTANEOUS_DOCUMENT_EVENT_CODES,
} from '../entities/EntityConstants';
import { Case } from '../entities/cases/Case';
import { MOCK_CASE } from '../../test/mockCase';
import { addCoverToPdf } from './addCoverToPdf';
import { addCoversheetInteractor } from './addCoversheetInteractor';
import { applicationContext } from '../test/createTestApplicationContext';
import { testPdfDoc } from '../test/getFakeFile';

jest.mock('./addCoverToPdf', () => ({
  __esModule: true,
  addCoverToPdf: jest
    .fn()
    .mockImplementation(jest.requireActual('./addCoverToPdf').addCoverToPdf),
}));

describe('addCoversheetInteractor', () => {
  const mockDocketEntryId = MOCK_CASE.docketEntries[0].docketEntryId;

  const testingCaseData = {
    ...MOCK_CASE,
    docketEntries: [
      {
        ...MOCK_CASE.docketEntries[0],
        certificateOfService: false,
        createdAt: '2019-04-19T14:45:15.595Z',
        documentType: 'Answer',
        eventCode: 'A',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: false,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
      },
    ],
  };

  const optionalTestingCaseData = {
    ...testingCaseData,
    docketEntries: [
      {
        ...testingCaseData.docketEntries[0],
        addToCoversheet: true,
        additionalInfo: 'Additional Info Something',
        certificateOfService: true,
        certificateOfServiceDate: '2019-04-20T05:00:00.000Z',
        docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
        docketNumber: '102-19',
        documentType:
          'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
        eventCode: 'M008',
        filedBy: 'Test Petitioner1',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: true,
        lodged: true,
        objections: OBJECTIONS_OPTIONS_MAP.NO,
      },
    ],
    docketNumber: '102-19',
    partyType: PARTY_TYPES.petitionerSpouse,
    petitioners: [
      {
        contactType: CONTACT_TYPES.primary,
        name: 'Janie Petitioner',
      },
      {
        contactType: CONTACT_TYPES.secondary,
        name: 'Janie Petitioner',
      },
    ],
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(testingCaseData);

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testPdfDoc,
      }),
    });
  });

  it('adds a cover page to a pdf document', async () => {
    await addCoversheetInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    } as any);

    expect(
      applicationContext.getDocumentGenerators().coverSheet,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it('replaces the cover page on a document', async () => {
    await addCoversheetInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
      replaceCoversheet: true,
    } as any);

    expect(
      applicationContext.getDocumentGenerators().coverSheet,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it("updates the docket entry's page numbers", async () => {
    await addCoversheetInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry,
    ).toHaveBeenCalled();
  });

  it('adds a cover page to a pdf document with optional data', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(optionalTestingCaseData);

    await addCoversheetInteractor(applicationContext, {
      docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
      docketNumber: MOCK_CASE.docketNumber,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it('returns the updated docket entry entity', async () => {
    const updatedDocketEntryEntity = await addCoversheetInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
      } as any,
    );

    expect(updatedDocketEntryEntity).toMatchObject({
      numberOfPages: 2,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    });
  });

  it('throws an error when unable to get the pdfData from s3', async () => {
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => Promise.reject(new Error('error')),
    });

    await expect(
      addCoversheetInteractor(applicationContext, {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
        replaceCoversheet: true,
      } as any),
    ).rejects.toThrow('error');
  });

  it('should call getCaseByDocketNumber to retrieve case entity if it is not passed in', async () => {
    await addCoversheetInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0].docketNumber,
    ).toBe(MOCK_CASE.docketNumber);
  });

  it('should not call getCaseByDocketNumber if case entity is passed in', async () => {
    await addCoversheetInteractor(applicationContext, {
      caseEntity: new Case(testingCaseData, { applicationContext }),
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('updates only the page numbers for the docket entires existing in the consolidated group case docket record', async () => {
    (addCoverToPdf as jest.Mock).mockResolvedValue({
      consolidatedCases: [
        {
          docketNumber: '101-19',
          documentNumber: null,
        },
        {
          docketNumber: '102-20',
          documentNumber: 2,
        },
        {
          docketNumber: '103-20',
          documentNumber: 5,
        },
      ],
      numberOfPages: 5,
      pdfData: 'gg',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce({
        ...testingCaseData,
        docketNumber: '102-20',
      })
      .mockResolvedValueOnce({
        ...testingCaseData,
        docketNumber: '103-20',
      });

    await addCoversheetInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry,
    ).toHaveBeenCalledTimes(2);

    const calls = applicationContext
      .getPersistenceGateway()
      .updateDocketEntry.mock.calls.map(call => ({
        docketNumber: call[0].docketNumber,
        numberOfPages: call[0].document.numberOfPages,
      }));

    const firstCase = calls.find(call => call.docketNumber === '102-20');
    const secondCase = calls.find(call => call.docketNumber === '103-20');

    expect(firstCase).toMatchObject({
      docketNumber: '102-20',
      numberOfPages: 5,
    });

    expect(secondCase).toMatchObject({
      docketNumber: '103-20',
      numberOfPages: 5,
    });
  });

  it('works as expected when feature flag is off and consolidated cases returns null', async () => {
    (addCoverToPdf as jest.Mock).mockResolvedValue({
      consolidatedCases: null,
      numberOfPages: 5,
      pdfData: 'gg',
    });

    await addCoversheetInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry,
    ).toHaveBeenCalledTimes(1);

    const calls = applicationContext
      .getPersistenceGateway()
      .updateDocketEntry.mock.calls.map(call => ({
        docketNumber: call[0].docketNumber,
        numberOfPages: call[0].document.numberOfPages,
      }));

    const firstCase = calls.find(
      call => call.docketNumber === MOCK_CASE.docketNumber,
    );

    expect(firstCase).toMatchObject({
      docketNumber: MOCK_CASE.docketNumber,
      numberOfPages: 5,
    });
  });

  it('should not update the processing status of a non-subject case, simultaneous doc type docket entry entity on a consolidated case', async () => {
    const mockProcessingStatus = DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING;
    const mockConsolidatedCaseNonSubjectCase = '102-20';
    (addCoverToPdf as jest.Mock).mockResolvedValue({
      consolidatedCases: [
        {
          docketNumber: mockConsolidatedCaseNonSubjectCase,
          documentNumber: 2,
        },
      ],
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce({
        ...testingCaseData,
        docketEntries: [
          {
            ...MOCK_CASE.docketEntries[0],
            createdAt: '2019-04-19T14:45:15.595Z',
            documentType: 'Simultaneous Answering Brief',
            eventCode: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
            processingStatus: mockProcessingStatus,
          },
        ],
        docketNumber: mockConsolidatedCaseNonSubjectCase,
      });

    await addCoversheetInteractor(applicationContext, {
      caseEntity: new Case(
        {
          ...testingCaseData,
          eventCode: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
        },
        { applicationContext },
      ),
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    } as any);

    const calls = applicationContext
      .getPersistenceGateway()
      .updateDocketEntry.mock.calls.map(call => ({
        docketNumber: call[0].docketNumber,
        processingStatus: call[0].document.processingStatus,
      }));

    const firstCase = calls.find(
      call => call.docketNumber === mockConsolidatedCaseNonSubjectCase,
    );

    expect(firstCase).toMatchObject({
      docketNumber: mockConsolidatedCaseNonSubjectCase,
      processingStatus: mockProcessingStatus,
    });
  });

  it('should not update the processing status of a non-subject case, simultaneous document title docket entry entity on a consolidated case', async () => {
    const mockProcessingStatus = DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING;
    const mockConsolidatedCaseNonSubjectCase = '102-20';
    (addCoverToPdf as jest.Mock).mockResolvedValue({
      consolidatedCases: [
        {
          docketNumber: mockConsolidatedCaseNonSubjectCase,
          documentNumber: 2,
        },
      ],
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce({
        ...testingCaseData,
        docketEntries: [
          {
            ...MOCK_CASE.docketEntries[0],
            createdAt: '2019-04-19T14:45:15.595Z',
            documentTitle: 'Super Duper Simultaneous but not really',
            documentType: 'Answer',
            processingStatus: mockProcessingStatus,
          },
        ],
        docketNumber: mockConsolidatedCaseNonSubjectCase,
      });

    await addCoversheetInteractor(applicationContext, {
      caseEntity: new Case(
        {
          ...testingCaseData,
          documentTitle: 'Super Duper Simultaneous but not really',
        },
        { applicationContext },
      ),
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    } as any);

    const calls = applicationContext
      .getPersistenceGateway()
      .updateDocketEntry.mock.calls.map(call => ({
        docketNumber: call[0].docketNumber,
        processingStatus: call[0].document.processingStatus,
      }));

    const firstCase = calls.find(
      call => call.docketNumber === mockConsolidatedCaseNonSubjectCase,
    );

    expect(firstCase).toMatchObject({
      docketNumber: mockConsolidatedCaseNonSubjectCase,
      processingStatus: mockProcessingStatus,
    });
  });
});
