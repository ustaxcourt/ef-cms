/* eslint-disable max-lines */
import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
jest.mock('@shared/business/utilities/DateHandler', () => {
  const mockDateHandler = jest.requireActual(
    '@shared/business/utilities/DateHandler',
  );
  return {
    __esModule: true,
    ...mockDateHandler,
    createISODateString: jest.fn(),
  };
});
import {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  OBJECTIONS_OPTIONS_MAP,
  PARTY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
  SIMULTANEOUS_DOCUMENT_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import {
  InvalidEntityError,
  InvalidRequest,
  NotFoundError,
  ServiceUnavailableError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { ConsolidatedCaseSummary } from '@shared/business/dto/cases/ConsolidatedCaseSummary';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  calculateISODate,
  createISODateString,
} from '@shared/business/utilities/DateHandler';
import { casePetitioner, petitionerUser } from '@shared/test/mockUsers';
import { fileExternalDocumentInteractor } from './fileExternalDocumentInteractor';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import {
  mockDocketClerkUser,
  mockIrsPractitionerUser,
  mockPetitionerUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { upsertWorkItems as upsertWorkItemsMock } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { MOCK_CASE_DEADLINE } from '@shared/test/mockCaseDeadline';
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { verifyPendingCaseForUser as verifyPendingCaseForUserMock } from '@web-api/persistence/postgres/cases/pendingCases/verifyPendingCaseForUser';
import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

const getUserById = jest.mocked(getUserByIdMock);
const verifyPendingCaseForUser = jest.mocked(verifyPendingCaseForUserMock);
const mockDateHandler = jest.requireActual(
  '@shared/business/utilities/DateHandler',
);
const mockCreateIsoDateString = createISODateString as jest.Mock;

describe('fileExternalDocumentInteractor', () => {
  const getCaseDeadlinesByDocketNumber = jest.mocked(
    getCaseDeadlinesByDocketNumberMock,
  );

  const upsertWorkItems = upsertWorkItemsMock as jest.Mock;
  const mockDocketEntryId = applicationContext.getUniqueId();
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
  const updateCaseAndAssociations = jest
    .mocked(updateCaseAndAssociationsMock)
    .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  let caseRecord;

  beforeEach(() => {
    mockCreateIsoDateString.mockImplementation(() =>
      mockDateHandler.createISODateString(),
    );

    caseRecord = {
      caseCaption: 'Caption',
      caseType: CASE_TYPES_MAP.deficiency,
      createdAt: '',
      docketEntries: [
        {
          docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
          docketNumber: '45678-18',
          documentTitle: 'first record',
          documentType: 'Petition',
          eventCode: 'P',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          filingDate: '2018-03-01T00:01:00.000Z',
          index: 1,
          isOnDocketRecord: true,
          servedAt: '2020-07-17T19:28:29.675Z',
          servedParties: [],
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
      ],
      docketNumber: '45678-18',
      filingType: 'Myself',
      leadDocketNumber: '45678-18',
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          address1: '123 Main St',
          city: 'Somewhere',
          contactType: CONTACT_TYPES.primary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'fieri@example.com',
          name: 'Roslindis Angelino',
          phone: '1234567890',
          postalCode: '12345',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          state: 'CA',
        },
      ],
      irsPractitioners: [mockIrsPractitionerUser],
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      role: ROLES.petitioner,
      userId: '0e97c6b4-d299-44f5-af99-2ce905d520f2',
    };

    getUserById.mockResolvedValue(mockIrsPractitionerUser as DbUser);

    getCaseByDocketNumber.mockResolvedValue(caseRecord);
    getCasesByDocketNumbers.mockResolvedValue([caseRecord]);
    verifyPendingCaseForUser.mockResolvedValue(false);
  });

  it('should throw an error when the user is not authorized to file an external document on a case', async () => {
    const result = fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          primaryDocumentId: mockDocketEntryId,
        },
      },
      mockDocketClerkUser,
    );

    await expect(result).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(result).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if the user is not found', async () => {
    getUserById.mockResolvedValue(undefined);
    const result = fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          primaryDocumentId: mockDocketEntryId,
        },
      },
      mockIrsPractitionerUser,
    );

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toThrow(
      `User not found with user id ${mockIrsPractitionerUser.userId}`,
    );
  });

  it('should throw an invalid request error if supporting documents are filed without a valid primaryDocumentId', async () => {
    const result = fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          primaryDocumentId: 'not-a-uuid',
          supportingDocuments: [{ docketEntryId: mockDocketEntryId }],
        },
      },
      mockIrsPractitionerUser,
    );

    await expect(result).rejects.toBeInstanceOf(InvalidRequest);
    await expect(result).rejects.toThrow(
      'Supporting documents require a valid primary document docketEntryId',
    );

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
    expect(updateCaseAndAssociations).not.toHaveBeenCalled();
  });

  it('should throw an invalid request error if secondary supporting documents are filed without a valid secondary document docketEntryId', async () => {
    const result = fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          primaryDocumentId: mockDocketEntryId,
          secondaryDocument: { docketEntryId: 'not-a-uuid' },
          secondarySupportingDocuments: [{ docketEntryId: mockDocketEntryId }],
        },
      },
      mockIrsPractitionerUser,
    );

    await expect(result).rejects.toBeInstanceOf(InvalidRequest);
    await expect(result).rejects.toThrow(
      'Secondary supporting documents require a valid secondary document docketEntryId',
    );

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
    expect(updateCaseAndAssociations).not.toHaveBeenCalled();
  });

  it('should throw an invalid request error if secondary supporting documents are filed without a secondary document', async () => {
    const result = fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          primaryDocumentId: mockDocketEntryId,
          secondarySupportingDocuments: [{ docketEntryId: mockDocketEntryId }],
        },
      },
      mockIrsPractitionerUser,
    );

    await expect(result).rejects.toBeInstanceOf(InvalidRequest);
    await expect(result).rejects.toThrow(
      'Secondary supporting documents require a valid secondary document docketEntryId',
    );

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
    expect(updateCaseAndAssociations).not.toHaveBeenCalled();
  });

  it('should validate docket entry entities before adding them to the case and not call service or persistence methods', async () => {
    const result = fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'XYZ',
          filedBy: 'Test Petitioner',
          primaryDocumentId: mockDocketEntryId,
        },
      },
      mockIrsPractitionerUser,
    );

    await expect(result).rejects.toBeInstanceOf(InvalidEntityError);
    await expect(result).rejects.toThrow('The DocketEntry entity was invalid.');

    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(upsertWorkItems).not.toHaveBeenCalled();
    expect(updateCaseAndAssociations).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).not.toHaveBeenCalled();
  });

  it('should not send served parties emails if updateCaseAndAssociations fails', async () => {
    updateCaseAndAssociations.mockRejectedValueOnce(
      new Error('Database error'),
    );

    await expect(
      fileExternalDocumentInteractor(
        applicationContext,
        {
          documentMetadata: {
            docketNumber: caseRecord.docketNumber,
            documentTitle: 'Memorandum in Support',
            documentType: 'Memorandum in Support',
            eventCode: 'A',
            filedBy: 'Test Petitioner',
            primaryDocumentId: mockDocketEntryId,
          },
        },
        mockIrsPractitionerUser,
      ),
    ).rejects.toThrow('Database error');

    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).not.toHaveBeenCalled();
  });

  it('should link same-filing primary supporting documents to the primary document docket entry id', async () => {
    const briefDocketEntryId = applicationContext.getUniqueId();
    const primaryDocumentId = applicationContext.getUniqueId();

    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Motion for Continuance',
          documentType: 'Motion for Continuance',
          eventCode: 'M006',
          filedBy: 'Test Practitioner',
          objections: OBJECTIONS_OPTIONS_MAP.NO,
          primaryDocumentId,
          supportingDocuments: [
            {
              docketEntryId: briefDocketEntryId,
              documentTitle: 'Brief in Support of Motion for Continuance',
              documentType: 'Brief in Support',
              eventCode: 'BRF',
              previousDocument: {
                documentType: 'Motion for Continuance',
                documentTitle: 'Motion for Continuance',
              },
            },
          ],
        },
      },
      mockIrsPractitionerUser,
    );

    const savedCase = updateCaseAndAssociations.mock.calls[0][0].caseToUpdate;
    const brief = savedCase.docketEntries.find(
      de => de.docketEntryId === briefDocketEntryId,
    );

    expect(brief?.previousDocument).toMatchObject({
      docketEntryId: primaryDocumentId,
      documentType: 'Motion for Continuance',
    });
  });

  it('should add documents and workitems and auto-serve the documents on the parties with an electronic service indicator', async () => {
    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          primaryDocumentId: mockDocketEntryId,
        },
      },
      mockIrsPractitionerUser,
    );

    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(upsertWorkItems).toHaveBeenCalled();
    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();

    const savedCase = updateCaseAndAssociations.mock.calls[0][0].caseToUpdate;
    const entry = savedCase.docketEntries.find(
      de => de.documentType === 'Memorandum in Support',
    );
    expect(entry).toBeDefined();
    expect(entry?.servedAt).toBeDefined();

    expect(
      applicationContext.getWorkerGateway().queueWork,
    ).toHaveBeenCalledWith(
      applicationContext,
      expect.objectContaining({
        message: expect.objectContaining({
          type: 'ADD_COVERSHEET',
          payload: {
            docketEntryId: mockDocketEntryId,
            docketNumber: caseRecord.docketNumber,
          },
        }),
      }),
    );
  });

  describe('consolidated cases', () => {
    const consolidatedCase = {
      caseCaption: 'Caption',
      caseType: CASE_TYPES_MAP.deficiency,
      createdAt: '',
      docketEntries: [
        {
          docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
          docketNumber: '45678-18',
          documentTitle: 'first record',
          documentType: 'Petition',
          eventCode: 'P',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          filingDate: '2018-03-01T00:01:00.000Z',
          index: 1,
          isOnDocketRecord: true,
          servedAt: '2020-07-17T19:28:29.675Z',
          servedParties: [],
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
      ],
      docketNumber: '45679-18',
      filingType: 'Myself',
      leadDocketNumber: '45678-18',
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          address1: '123 Main St',
          city: 'Somewhere',
          contactType: CONTACT_TYPES.primary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'fieri@example.com',
          name: 'Roslindis Angelino',
          phone: '1234567890',
          postalCode: '12345',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          state: 'CA',
        },
      ],
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      role: ROLES.petitioner,
      userId: '0e97c6b4-d299-44f5-af99-2ce905d520f2',
    };

    it('should add documents and workitems and auto-serve the documents on the parties with an electronic service indicator across consolidated cases', async () => {
      const consolidatedCasesToFileAcross = [
        {
          docketNumber: caseRecord.docketNumber,
          leadDocketNumber: caseRecord.docketNumber,
        },
        {
          docketNumber: consolidatedCase.docketNumber,
          leadDocketNumber: caseRecord.docketNumber,
        },
      ];

      getCaseByDocketNumber.mockResolvedValueOnce({
        ...caseRecord,
        consolidatedCases: consolidatedCasesToFileAcross,
      });
      getCasesByDocketNumbers.mockResolvedValueOnce([
        caseRecord,
        { ...caseRecord, ...consolidatedCase },
      ]);

      await fileExternalDocumentInteractor(
        applicationContext,
        {
          documentMetadata: {
            consolidatedCasesToFileAcross,
            docketNumber: caseRecord.docketNumber,
            documentTitle: 'Memorandum in Support',
            documentType: 'Memorandum in Support',
            eventCode: 'A',
            filedBy: 'Test Petitioner',
            primaryDocumentId: mockDocketEntryId,
          },
        },
        mockIrsPractitionerUser,
      );

      expect(getCaseByDocketNumber).toHaveBeenCalledTimes(1);
      expect(getCasesByDocketNumbers).toHaveBeenCalledTimes(1);
      expect(upsertWorkItems).toHaveBeenCalledTimes(1);
      expect(updateCaseAndAssociations).toHaveBeenCalledTimes(2);
      expect(
        applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
      ).toHaveBeenCalledTimes(2);

      const savedCase = updateCaseAndAssociations.mock.calls[0][0].caseToUpdate;
      const entry = savedCase.docketEntries.find(
        de => de.documentType === 'Memorandum in Support',
      );
      expect(entry).toBeDefined();
      expect(entry?.servedAt).toBeDefined();
      expect(entry).toMatchObject({
        docketNumber: caseRecord.docketNumber,
        multiDocketedOn: [
          caseRecord.docketNumber,
          consolidatedCase.docketNumber,
        ],
        originallyFiledDocketNumber: caseRecord.docketNumber,
        isOnDocketRecord: true,
        documentStorageId: mockDocketEntryId,
      });
      const savedCase2 =
        updateCaseAndAssociations.mock.calls[1][0].caseToUpdate;
      const entry2 = savedCase2.docketEntries.find(
        de => de.documentType === 'Memorandum in Support',
      );
      expect(entry2).toBeDefined();
      expect(entry2?.servedAt).toBeDefined();
      expect(entry2).toMatchObject({
        docketNumber: consolidatedCase.docketNumber,
        multiDocketedOn: [
          caseRecord.docketNumber,
          consolidatedCase.docketNumber,
        ],
        originallyFiledDocketNumber: caseRecord.docketNumber,
        isOnDocketRecord: true,
        documentStorageId: mockDocketEntryId,
      });
    });

    it('should set the same motion visibility fields on each consolidated case', async () => {
      const consolidatedCasesToFileAcross = [
        {
          docketNumber: caseRecord.docketNumber,
          leadDocketNumber: caseRecord.docketNumber,
        },
        {
          docketNumber: consolidatedCase.docketNumber,
          leadDocketNumber: caseRecord.docketNumber,
        },
      ];
      const primaryDocumentId = applicationContext.getUniqueId();
      const secondaryDocumentId = applicationContext.getUniqueId();

      getCaseByDocketNumber.mockResolvedValueOnce({
        ...caseRecord,
        consolidatedCases: consolidatedCasesToFileAcross,
      });
      getCasesByDocketNumbers.mockResolvedValueOnce([
        caseRecord,
        { ...caseRecord, ...consolidatedCase },
      ]);

      await fileExternalDocumentInteractor(
        applicationContext,
        {
          documentMetadata: {
            consolidatedCasesToFileAcross,
            docketNumber: caseRecord.docketNumber,
            documentTitle: 'Motion for Continuance',
            documentType: 'Motion for Continuance',
            eventCode: 'M006',
            filedBy: 'Test Practitioner',
            objections: OBJECTIONS_OPTIONS_MAP.NO,
            primaryDocumentId,
            docketEntryId: primaryDocumentId,
            secondaryDocument: {
              docketEntryId: secondaryDocumentId,
              documentTitle: 'Motion for Continuance',
              documentType: 'Motion for Continuance',
              eventCode: 'M006',
              filedBy: 'Test Practitioner',
              objections: OBJECTIONS_OPTIONS_MAP.NO,
            },
          },
        },
        mockIrsPractitionerUser,
      );

      const savedCases = updateCaseAndAssociations.mock.calls.map(
        call => call[0].caseToUpdate,
      );

      expect(savedCases).toHaveLength(2);

      savedCases.forEach(savedCase => {
        const primaryMotion = savedCase.docketEntries.find(
          de =>
            de.docketEntryId === primaryDocumentId && de.eventCode === 'M006',
        );
        const lodgedMotion = savedCase.docketEntries.find(
          de =>
            de.docketEntryId === secondaryDocumentId && de.eventCode === 'M006',
        );

        expect(primaryMotion).toMatchObject({
          eventCode: 'M006',
          filedByRole: ROLES.irsPractitioner,
          isOnDocketRecord: true,
          lodged: undefined,
        });
        expect(lodgedMotion).toMatchObject({
          eventCode: 'M006',
          filedByRole: ROLES.irsPractitioner,
          isOnDocketRecord: true,
          lodged: true,
        });
        expect(primaryMotion?.filingDate).toEqual(lodgedMotion?.filingDate);
      });
    });

    it('should set the same filling date for all documents to add', async () => {
      const primaryDocketEntryId = 'c54ba5a9-b37b-479d-9201-067ec6e335b0';
      const secondaryDocketEntryId = 'c54ba5a9-b37b-479d-9201-067ec6e335b1';
      const supportingDocketEntryId = 'c54ba5a9-b37b-479d-9201-067ec6e335b2';

      const consolidatedCasesToFileAcross = [
        {
          docketNumber: caseRecord.docketNumber,
          leadDocketNumber: caseRecord.docketNumber,
        },
        {
          docketNumber: consolidatedCase.docketNumber,
          leadDocketNumber: caseRecord.docketNumber,
        },
      ];

      getCaseByDocketNumber.mockResolvedValueOnce({
        ...caseRecord,
        consolidatedCases: consolidatedCasesToFileAcross,
      });
      getCasesByDocketNumbers.mockResolvedValueOnce([
        caseRecord,
        { ...caseRecord, ...consolidatedCase },
      ]);
      const secondaryDocument = {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Motion for Continuance 2',
        documentType: 'Motion for Continuance',
        eventCode: 'M006',
        filedBy: 'Test Petitioner',
        primaryDocumentId: secondaryDocketEntryId,
        docketEntryId: applicationContext.getUniqueId(),
      };
      const supportingDocument = {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Motion for Continuance Support',
        documentType: 'Motion for Continuance',
        eventCode: 'M006',
        filedBy: 'Test Petitioner',
        primaryDocumentId: supportingDocketEntryId,
        docketEntryId: applicationContext.getUniqueId(),
      };

      const documentMetadata = {
        consolidatedCasesToFileAcross,
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Motion for Continuance',
        documentType: 'Motion for Continuance',
        eventCode: 'M006',
        filedBy: 'Test Petitioner',
        primaryDocumentId: primaryDocketEntryId,
        docketEntryId: applicationContext.getUniqueId(),
        secondaryDocument,
        supportingDocuments: [supportingDocument],
      };

      await fileExternalDocumentInteractor(
        applicationContext,
        {
          documentMetadata,
        },
        mockIrsPractitionerUser,
      );

      const primary =
        updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
          d => d.docketEntryId === primaryDocketEntryId,
        );

      const secondary =
        updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
          d => d.docketEntryId === secondaryDocument.docketEntryId,
        );

      const supporting =
        updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
          d => d.docketEntryId === supportingDocument.docketEntryId,
        );

      expect(secondary.filingDate).toBe(primary.filingDate);
      expect(secondary.filingDate).toBe(supporting.filingDate);
    });

    it('should recompute cases that are consolidated with current case to prevent injection of cases from request', async () => {
      const consolidatedCasesToFileAcross = [
        {
          docketNumber: caseRecord.docketNumber,
          leadDocketNumber: caseRecord.docketNumber,
        },
        {
          docketNumber: consolidatedCase.docketNumber,
          leadDocketNumber: caseRecord.docketNumber,
        },
      ];

      const injectedConsolidatedCasesToFileAcross = [
        {
          docketNumber: caseRecord.docketNumber,
          leadDocketNumber: caseRecord.docketNumber,
        },
        {
          docketNumber: '998-99',
          leadDocketNumber: caseRecord.docketNumber,
        },
        {
          docketNumber: '999-99',
          leadDocketNumber: caseRecord.docketNumber,
        },
      ];

      getCaseByDocketNumber.mockResolvedValueOnce({
        ...caseRecord,
        consolidatedCases: consolidatedCasesToFileAcross,
      });
      getCasesByDocketNumbers.mockResolvedValueOnce([
        caseRecord,
        { ...caseRecord, ...consolidatedCase },
      ]);

      await fileExternalDocumentInteractor(
        applicationContext,
        {
          documentMetadata: {
            consolidatedCasesToFileAcross:
              injectedConsolidatedCasesToFileAcross,
            docketNumber: caseRecord.docketNumber,
            documentTitle: 'Memorandum in Support',
            documentType: 'Memorandum in Support',
            eventCode: 'A',
            filedBy: 'Test Petitioner',
            primaryDocumentId: mockDocketEntryId,
          },
        },
        mockIrsPractitionerUser,
      );

      expect(updateCaseAndAssociations).toHaveBeenCalledTimes(2);
      expect(
        applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
      ).toHaveBeenCalledTimes(2);

      const savedCase = updateCaseAndAssociations.mock.calls[0][0].caseToUpdate;
      const entry = savedCase.docketEntries.find(
        de => de.documentType === 'Memorandum in Support',
      );
      expect(entry).toBeDefined();
      expect(entry?.servedAt).toBeDefined();
      expect(entry).toMatchObject({
        docketNumber: caseRecord.docketNumber,
        multiDocketedOn: [
          caseRecord.docketNumber,
          consolidatedCase.docketNumber,
        ],
        originallyFiledDocketNumber: caseRecord.docketNumber,
        isOnDocketRecord: true,
        documentStorageId: mockDocketEntryId,
      });
      const savedCase2 =
        updateCaseAndAssociations.mock.calls[1][0].caseToUpdate;
      const entry2 = savedCase2.docketEntries.find(
        de => de.documentType === 'Memorandum in Support',
      );
      expect(entry2).toBeDefined();
      expect(entry2?.servedAt).toBeDefined();
      expect(entry2).toMatchObject({
        docketNumber: consolidatedCase.docketNumber,
        multiDocketedOn: [
          caseRecord.docketNumber,
          consolidatedCase.docketNumber,
        ],
        originallyFiledDocketNumber: caseRecord.docketNumber,
        isOnDocketRecord: true,
        documentStorageId: mockDocketEntryId,
      });
    });
  });

  describe('filing to visibility chain', () => {
    const visibilityChangeDate = mockDateHandler.createISODateString(
      '2023-08-01',
      'yyyy-MM-dd',
    );
    const motionVisibilityChangeDate = calculateISODate({
      dateString: mockDateHandler.createISODateString(),
      howMuch: -60,
      units: 'days',
    });
    const afterMotionFilingDate = calculateISODate({
      dateString: motionVisibilityChangeDate,
      howMuch: 1,
      units: 'days',
    });
    const beforeMotionFilingDate = calculateISODate({
      dateString: motionVisibilityChangeDate,
      howMuch: -1,
      units: 'days',
    });
    const laterBriefFilingDate = calculateISODate({
      dateString: afterMotionFilingDate,
      howMuch: 1,
      units: 'days',
    });

    const publicSiteUser = {
      email: '',
      entityName: 'User',
      name: '',
      role: ROLES.petitioner,
      userId: '',
    };

    const unassociatedPetitionerUser: AuthUser = {
      ...petitionerUser,
      userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    };

    const memberDocketNumber = '45679-18';

    const prepareEntryForDownload = (
      entry: RawDocketEntry,
    ): RawDocketEntry => ({
      ...entry,
      isFileAttached: true,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    });

    const withPartyContactIds = (petitioners: TPetitioner[]): TPetitioner[] =>
      petitioners.map((petitioner, index) =>
        index === 0 && !petitioner.contactId
          ? { ...petitioner, contactId: casePetitioner.contactId }
          : petitioner,
      );

    const buildRawCase = (
      savedCase: RawCase,
      {
        allSavedCases = [],
        consolidated = false,
      }: { allSavedCases?: RawCase[]; consolidated?: boolean } = {},
    ): RawCase => {
      const rawCase = {
        ...savedCase,
        petitioners: withPartyContactIds(savedCase.petitioners),
        status: CASE_STATUS_TYPES.generalDocket,
      };

      if (consolidated) {
        return {
          ...rawCase,
          consolidatedCases: allSavedCases.map(memberCase =>
            new ConsolidatedCaseSummary({
              ...memberCase,
              petitioners: withPartyContactIds(memberCase.petitioners),
            }).toRawObject(),
          ),
        };
      }

      return {
        ...rawCase,
        leadDocketNumber: undefined,
      };
    };

    const expectDownloadable = (
      entry: RawDocketEntry,
      rawCase: RawCase,
      expected: boolean,
      {
        isTerminalUser = false,
        user = publicSiteUser,
      }: {
        isTerminalUser?: boolean;
        user?: AuthUser;
      } = {},
    ): void => {
      expect(
        DocketEntry.isDownloadable(prepareEntryForDownload(entry), {
          isTerminalUser,
          motionVisibilityChangeDate,
          rawCase,
          user,
          visibilityChangeDate,
        }),
      ).toEqual(expected);
    };

    const expectDownloadabilityForViewers = (
      entry: RawDocketEntry,
      rawCase: RawCase,
      expected: {
        party: boolean;
        public: boolean;
        terminal: boolean;
        unassociated: boolean;
      },
    ): void => {
      expectDownloadable(entry, rawCase, expected.public, {
        user: publicSiteUser,
      });
      expectDownloadable(entry, rawCase, expected.unassociated, {
        user: unassociatedPetitionerUser,
      });
      expectDownloadable(entry, rawCase, expected.party, {
        user: {
          ...petitionerUser,
          userId: rawCase.petitioners[0].contactId!,
        },
      });
      expectDownloadable(entry, rawCase, expected.terminal, {
        isTerminalUser: true,
        user: publicSiteUser,
      });
    };

    const setupConsolidatedMocks = (leadCase: RawCase = caseRecord): void => {
      const memberCase = {
        ...leadCase,
        docketNumber: memberDocketNumber,
        leadDocketNumber: leadCase.docketNumber,
      };
      const consolidatedCasesToFileAcross = [leadCase, memberCase].map(
        consolidatedCase =>
          new ConsolidatedCaseSummary({
            ...consolidatedCase,
            leadDocketNumber: leadCase.docketNumber,
          }).toRawObject(),
      );

      getCaseByDocketNumber.mockResolvedValueOnce({
        ...leadCase,
        consolidatedCases: consolidatedCasesToFileAcross,
      });
      getCasesByDocketNumbers.mockResolvedValueOnce([leadCase, memberCase]);
    };

    const filePractitionerMotionBundle = async ({
      consolidated = false,
      filingDate,
      filingUser = mockIrsPractitionerUser,
      includeOtherSupportingDoc = false,
      leadCase = caseRecord,
    }: {
      consolidated?: boolean;
      filingDate: string;
      filingUser?: typeof mockIrsPractitionerUser;
      includeOtherSupportingDoc?: boolean;
      leadCase?: RawCase;
    }): Promise<{
      brfEntry: RawDocketEntry;
      mispEntry: RawDocketEntry;
      motionEntry: RawDocketEntry;
      otherSupportingEntry?: RawDocketEntry;
      savedCases: RawCase[];
    }> => {
      mockCreateIsoDateString.mockImplementation(
        (dateString?: string, inputFormat?: string) => {
          if (dateString === undefined) {
            return filingDate;
          }
          return mockDateHandler.createISODateString(dateString, inputFormat);
        },
      );
      getUserById.mockResolvedValue(filingUser as DbUser);

      const primaryDocumentId = applicationContext.getUniqueId();
      const mispDocketEntryId = applicationContext.getUniqueId();
      const brfDocketEntryId = applicationContext.getUniqueId();
      const otherSupportingDocketEntryId = applicationContext.getUniqueId();

      const supportingDocuments: Record<string, unknown>[] = [
        {
          docketEntryId: mispDocketEntryId,
          documentTitle: 'Memorandum in Support of Motion for Continuance',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          previousDocument: {
            documentTitle: 'Motion for Continuance',
            documentType: 'Motion for Continuance',
          },
        },
        {
          docketEntryId: brfDocketEntryId,
          documentTitle: 'Brief in Support of Motion for Continuance',
          documentType: 'Brief in Support',
          eventCode: 'BRF',
          previousDocument: {
            documentTitle: 'Motion for Continuance',
            documentType: 'Motion for Continuance',
          },
        },
      ];

      if (includeOtherSupportingDoc) {
        supportingDocuments.push({
          docketEntryId: otherSupportingDocketEntryId,
          documentTitle: 'Civil Penalty Approval Form',
          documentType: 'Civil Penalty Approval Form',
          eventCode: 'CIVP',
          previousDocument: {
            documentTitle: 'Motion for Continuance',
            documentType: 'Motion for Continuance',
          },
        });
      }

      const consolidatedCasesToFileAcross = consolidated
        ? [
            {
              docketNumber: leadCase.docketNumber,
              leadDocketNumber: leadCase.docketNumber,
            },
            {
              docketNumber: memberDocketNumber,
              leadDocketNumber: leadCase.docketNumber,
            },
          ]
        : undefined;

      if (consolidated) {
        setupConsolidatedMocks(leadCase);
      } else {
        getCaseByDocketNumber.mockResolvedValue(leadCase);
        getCasesByDocketNumbers.mockResolvedValue([leadCase]);
      }

      const updateCallsBeforeFiling =
        updateCaseAndAssociations.mock.calls.length;

      await fileExternalDocumentInteractor(
        applicationContext,
        {
          documentMetadata: {
            consolidatedCasesToFileAcross,
            docketNumber: leadCase.docketNumber,
            documentTitle: 'Motion for Continuance',
            documentType: 'Motion for Continuance',
            eventCode: 'M006',
            filedBy: 'Test Practitioner',
            objections: OBJECTIONS_OPTIONS_MAP.NO,
            primaryDocumentId,
            supportingDocuments,
          },
        },
        filingUser,
      );

      const savedCases = updateCaseAndAssociations.mock.calls
        .slice(updateCallsBeforeFiling)
        .map(call => call[0].caseToUpdate);

      const savedCase = savedCases[0];
      const findEntry = (docketEntryId: string): RawDocketEntry =>
        savedCase.docketEntries.find(de => de.docketEntryId === docketEntryId)!;

      return {
        brfEntry: findEntry(brfDocketEntryId),
        mispEntry: findEntry(mispDocketEntryId),
        motionEntry: findEntry(primaryDocumentId),
        otherSupportingEntry: includeOtherSupportingDoc
          ? findEntry(otherSupportingDocketEntryId)
          : undefined,
        savedCases,
      };
    };

    const fileMotionForLeaveWithLodgedSecondary = async ({
      consolidated = false,
      filingDate,
      leadCase = caseRecord,
    }: {
      consolidated?: boolean;
      filingDate: string;
      leadCase?: RawCase;
    }): Promise<{
      leaveEntry: RawDocketEntry;
      lodgedBrfEntry: RawDocketEntry;
      lodgedMispEntry: RawDocketEntry;
      lodgedSecondaryEntry: RawDocketEntry;
      savedCases: RawCase[];
    }> => {
      mockCreateIsoDateString.mockImplementation(
        (dateString?: string, inputFormat?: string) => {
          if (dateString === undefined) {
            return filingDate;
          }
          return mockDateHandler.createISODateString(dateString, inputFormat);
        },
      );
      getUserById.mockResolvedValue(mockIrsPractitionerUser as DbUser);

      const primaryDocumentId = applicationContext.getUniqueId();
      const secondaryDocumentId = applicationContext.getUniqueId();
      const leaveMispId = applicationContext.getUniqueId();
      const leaveBrfId = applicationContext.getUniqueId();
      const lodgedMispId = applicationContext.getUniqueId();
      const lodgedBrfId = applicationContext.getUniqueId();

      const consolidatedCasesToFileAcross = consolidated
        ? [
            {
              docketNumber: leadCase.docketNumber,
              leadDocketNumber: leadCase.docketNumber,
            },
            {
              docketNumber: memberDocketNumber,
              leadDocketNumber: leadCase.docketNumber,
            },
          ]
        : undefined;

      if (consolidated) {
        setupConsolidatedMocks(leadCase);
      } else {
        getCaseByDocketNumber.mockResolvedValue(leadCase);
        getCasesByDocketNumbers.mockResolvedValue([leadCase]);
      }

      const updateCallsBeforeFiling =
        updateCaseAndAssociations.mock.calls.length;

      await fileExternalDocumentInteractor(
        applicationContext,
        {
          documentMetadata: {
            consolidatedCasesToFileAcross,
            docketNumber: leadCase.docketNumber,
            documentTitle: 'Motion for Leave to File',
            documentType: 'Motion for Leave to File',
            eventCode: 'M115',
            filedBy: 'Test Practitioner',
            objections: OBJECTIONS_OPTIONS_MAP.NO,
            primaryDocumentId,
            scenario: 'Nonstandard H',
            secondaryDocument: {
              docketEntryId: secondaryDocumentId,
              documentTitle: 'Motion for Judgment on the Pleadings',
              documentType: 'Motion for Judgment on the Pleadings',
              eventCode: 'M121',
              filedBy: 'Test Practitioner',
              objections: OBJECTIONS_OPTIONS_MAP.NO,
            },
            secondarySupportingDocuments: [
              {
                docketEntryId: lodgedMispId,
                documentTitle:
                  'Memorandum in Support of Motion for Judgment on the Pleadings',
                documentType: 'Memorandum in Support',
                eventCode: 'MISP',
                filedBy: 'Test Practitioner',
                objections: OBJECTIONS_OPTIONS_MAP.NO,
                previousDocument: {
                  documentTitle: 'Motion for Judgment on the Pleadings',
                  documentType: 'Motion for Judgment on the Pleadings',
                },
              },
              {
                docketEntryId: lodgedBrfId,
                documentTitle:
                  'Brief in Support of Motion for Judgment on the Pleadings',
                documentType: 'Brief in Support',
                eventCode: 'BRF',
                filedBy: 'Test Practitioner',
                objections: OBJECTIONS_OPTIONS_MAP.NO,
                previousDocument: {
                  documentTitle: 'Motion for Judgment on the Pleadings',
                  documentType: 'Motion for Judgment on the Pleadings',
                },
              },
            ],
            supportingDocuments: [
              {
                docketEntryId: leaveMispId,
                documentTitle:
                  'Memorandum in Support of Motion for Leave to File',
                documentType: 'Memorandum in Support',
                eventCode: 'MISP',
                previousDocument: {
                  documentTitle: 'Motion for Leave to File',
                  documentType: 'Motion for Leave to File',
                },
              },
              {
                docketEntryId: leaveBrfId,
                documentTitle: 'Brief in Support of Motion for Leave to File',
                documentType: 'Brief in Support',
                eventCode: 'BRF',
                previousDocument: {
                  documentTitle: 'Motion for Leave to File',
                  documentType: 'Motion for Leave to File',
                },
              },
            ],
          },
        },
        mockIrsPractitionerUser,
      );

      const savedCases = updateCaseAndAssociations.mock.calls
        .slice(updateCallsBeforeFiling)
        .map(call => call[0].caseToUpdate);

      const savedCase = savedCases[0];
      const findEntry = (docketEntryId: string): RawDocketEntry =>
        savedCase.docketEntries.find(de => de.docketEntryId === docketEntryId)!;

      return {
        leaveEntry: findEntry(primaryDocumentId),
        lodgedBrfEntry: findEntry(lodgedBrfId),
        lodgedMispEntry: findEntry(lodgedMispId),
        lodgedSecondaryEntry: findEntry(secondaryDocumentId),
        savedCases,
      };
    };

    const assertOnSavedCases = (
      savedCases: RawCase[],
      assertion: (rawCase: RawCase) => void,
      consolidated = false,
    ): void => {
      savedCases.forEach(savedCase =>
        assertion(
          buildRawCase(savedCase, { allSavedCases: savedCases, consolidated }),
        ),
      );
    };

    it.each([
      { consolidated: false, description: 'a single case' },
      { consolidated: true, description: 'lead and member consolidated cases' },
    ])(
      'should make a practitioner-filed motion, MISP, and BRF public after the policy date on $description',
      async ({ consolidated }) => {
        const { brfEntry, mispEntry, motionEntry, savedCases } =
          await filePractitionerMotionBundle({
            consolidated,
            filingDate: afterMotionFilingDate,
          });

        assertOnSavedCases(
          savedCases,
          rawCase => {
            const expected = {
              party: true,
              public: true,
              terminal: true,
              unassociated: true,
            };
            expectDownloadabilityForViewers(motionEntry, rawCase, expected);
            expectDownloadabilityForViewers(mispEntry, rawCase, expected);
            expectDownloadabilityForViewers(brfEntry, rawCase, expected);
          },
          consolidated,
        );
      },
    );

    it.each([
      { consolidated: false, description: 'a single case' },
      { consolidated: true, description: 'lead and member consolidated cases' },
    ])(
      'should not make a practitioner-filed motion, MISP, or BRF public before the policy date on $description',
      async ({ consolidated }) => {
        const { brfEntry, mispEntry, motionEntry, savedCases } =
          await filePractitionerMotionBundle({
            consolidated,
            filingDate: beforeMotionFilingDate,
          });

        assertOnSavedCases(
          savedCases,
          rawCase => {
            const notPublic = {
              party: true,
              public: false,
              terminal: true,
              unassociated: false,
            };
            expectDownloadabilityForViewers(motionEntry, rawCase, notPublic);
            expectDownloadabilityForViewers(mispEntry, rawCase, notPublic);
            expectDownloadabilityForViewers(brfEntry, rawCase, notPublic);
          },
          consolidated,
        );
      },
    );

    it.each([
      { consolidated: false, description: 'a single case' },
      { consolidated: true, description: 'lead and member consolidated cases' },
    ])(
      'should keep a petitioner-filed motion from being public after the policy date on $description',
      async ({ consolidated }) => {
        const petitionerCase = {
          ...caseRecord,
          petitioners: [
            {
              ...caseRecord.petitioners[0],
              contactId: mockPetitionerUser.userId,
            },
          ],
        };

        const { motionEntry, savedCases } = await filePractitionerMotionBundle({
          consolidated,
          filingDate: afterMotionFilingDate,
          filingUser: mockPetitionerUser,
          leadCase: petitionerCase,
        });

        assertOnSavedCases(
          savedCases,
          rawCase => {
            expectDownloadabilityForViewers(motionEntry, rawCase, {
              party: true,
              public: false,
              terminal: true,
              unassociated: false,
            });
          },
          consolidated,
        );
      },
    );

    it('should not make a non-MISP/BRF supporting document public after the policy date', async () => {
      const { motionEntry, otherSupportingEntry, savedCases } =
        await filePractitionerMotionBundle({
          filingDate: afterMotionFilingDate,
          includeOtherSupportingDoc: true,
        });

      assertOnSavedCases(savedCases, rawCase => {
        expectDownloadabilityForViewers(motionEntry, rawCase, {
          party: true,
          public: true,
          terminal: true,
          unassociated: true,
        });
        expectDownloadabilityForViewers(otherSupportingEntry!, rawCase, {
          party: true,
          public: false,
          terminal: true,
          unassociated: false,
        });
      });
    });

    it('should not make a later-filed BRF public when the root motion is not public', async () => {
      const { brfEntry, savedCases } = await filePractitionerMotionBundle({
        filingDate: beforeMotionFilingDate,
      });

      const laterFiledBrf = {
        ...brfEntry,
        filingDate: laterBriefFilingDate,
      };

      assertOnSavedCases(savedCases, rawCase => {
        expectDownloadabilityForViewers(laterFiledBrf, rawCase, {
          party: true,
          public: false,
          terminal: true,
          unassociated: false,
        });
      });
    });

    it.each([
      { consolidated: false, description: 'a single case' },
      { consolidated: true, description: 'lead and member consolidated cases' },
    ])(
      'should expose leave to the public but not lodged secondary documents on $description',
      async ({ consolidated }) => {
        const {
          leaveEntry,
          lodgedBrfEntry,
          lodgedMispEntry,
          lodgedSecondaryEntry,
          savedCases,
        } = await fileMotionForLeaveWithLodgedSecondary({
          consolidated,
          filingDate: afterMotionFilingDate,
        });

        assertOnSavedCases(
          savedCases,
          rawCase => {
            expectDownloadabilityForViewers(leaveEntry, rawCase, {
              party: true,
              public: true,
              terminal: true,
              unassociated: true,
            });

            const lodgedGroup = {
              party: true,
              public: false,
              terminal: true,
              unassociated: false,
            };
            expectDownloadabilityForViewers(
              lodgedSecondaryEntry,
              rawCase,
              lodgedGroup,
            );
            expectDownloadabilityForViewers(
              lodgedMispEntry,
              rawCase,
              lodgedGroup,
            );
            expectDownloadabilityForViewers(
              lodgedBrfEntry,
              rawCase,
              lodgedGroup,
            );
          },
          consolidated,
        );
      },
    );
  });

  it('should set secondary document and secondary supporting documents to lodged', async () => {
    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Motion for Leave to File',
          documentType: 'Motion for Leave to File',
          eventCode: 'M115',
          filedBy: 'Test Petitioner',
          objections: OBJECTIONS_OPTIONS_MAP.NO,
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          scenario: 'Nonstandard H',
          secondaryDocument: {
            docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
            documentTitle: 'Motion for Judgment on the Pleadings',
            documentType: 'Motion for Judgment on the Pleadings',
            eventCode: 'M121',
            filedBy: 'Test Petitioner',
            objections: OBJECTIONS_OPTIONS_MAP.NO,
          },
          secondarySupportingDocuments: [
            {
              docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
              documentTitle: 'Motion for in Camera Review',
              documentType: 'Motion for in Camera Review',
              eventCode: 'M135',
              filedBy: 'Test Petitioner',
              objections: OBJECTIONS_OPTIONS_MAP.NO,
              previousDocument: {
                docketEntryId: 'incorrect-parent-id',
                documentTitle: 'Motion for Judgment on the Pleadings',
                documentType: 'Motion for Judgment on the Pleadings',
              },
            },
          ],
          supportingDocuments: [
            {
              docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335be',
              documentTitle: 'Civil Penalty Approval Form',
              documentType: 'Civil Penalty Approval Form',
              eventCode: 'CIVP',
              filedBy: 'Test Petitioner',
            },
          ],
        },
      },
      mockIrsPractitionerUser,
    );
    expect(updateCaseAndAssociations).toHaveBeenCalled();

    const savedCase = updateCaseAndAssociations.mock.calls[0][0].caseToUpdate;
    expect(savedCase.docketEntries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({}),
        expect.objectContaining({}),
        expect.objectContaining({}),
        expect.objectContaining({}),
        expect.objectContaining({}),
        expect.objectContaining({
          eventCode: 'M115',
          isOnDocketRecord: true,
          // primary document
          lodged: undefined,
        }),
        expect.objectContaining({
          eventCode: 'CIVP',
          isOnDocketRecord: true,
          // supporting document
          lodged: undefined,
          previousDocument: expect.objectContaining({
            docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          }),
        }),
        expect.objectContaining({
          eventCode: 'M121', //secondary document
          isOnDocketRecord: true,
          lodged: true,
        }),
        expect.objectContaining({
          eventCode: 'M135', // secondary supporting document
          isOnDocketRecord: true,
          lodged: true,
          previousDocument: expect.objectContaining({
            docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
            documentTitle: 'Motion for Judgment on the Pleadings',
          }),
        }),
      ]),
    );
  });

  it('should set the logged-in practitioner as filedBy on every document when a practitioner files a Nonstandard H filing targeting an M112, ignoring the submitted filedBy', async () => {
    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle:
            'Motion for Leave to File Motion to Withdraw as Counsel',
          documentType: 'Motion for Leave to File',
          eventCode: 'M115',
          filedBy: 'Some Other Practitioner',
          objections: OBJECTIONS_OPTIONS_MAP.NO,
          partyIrsPractitioner: true,
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          scenario: 'Nonstandard H',
          secondaryDocument: {
            docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
            documentTitle: 'Motion to Withdraw as Counsel',
            documentType: 'Motion to Withdraw as Counsel',
            eventCode: 'M112',
            objections: OBJECTIONS_OPTIONS_MAP.NO,
          },
          secondarySupportingDocuments: [
            {
              docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
              documentTitle:
                'Exhibit in Support of Motion to Withdraw as Counsel',
              documentType: 'Exhibit in Support',
              eventCode: 'EXS',
              previousDocument: {
                documentTitle: 'Motion to Withdraw as Counsel',
                documentType: 'Motion to Withdraw as Counsel',
              },
            },
          ],
          supportingDocuments: [
            {
              docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335be',
              documentTitle: 'Exhibit in Support of Motion for Leave to File',
              documentType: 'Exhibit in Support',
              eventCode: 'EXS',
              previousDocument: {
                documentTitle: 'Motion for Leave to File',
                documentType: 'Motion for Leave to File',
              },
            },
          ],
        },
      },
      mockIrsPractitionerUser,
    );

    const savedCase = updateCaseAndAssociations.mock.calls[0][0].caseToUpdate;
    const filedEntries = savedCase.docketEntries.filter(entry =>
      [
        'c54ba5a9-b37b-479d-9201-067ec6e335bc',
        'c54ba5a9-b37b-479d-9201-067ec6e335bd',
        'c54ba5a9-b37b-479d-9201-067ec6e335be',
      ].includes(entry.docketEntryId),
    );
    const primaryEntry = savedCase.docketEntries.find(
      entry => entry.eventCode === 'M115',
    );

    expect(filedEntries).toHaveLength(3);
    [primaryEntry, ...filedEntries].forEach(entry => {
      expect(entry.filedBy).toEqual(mockIrsPractitionerUser.name);
    });
  });

  it('should generate filedBy from the filing parties when a practitioner files a Nonstandard H filing that does not target an M112', async () => {
    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Motion for Leave to File',
          documentType: 'Motion for Leave to File',
          eventCode: 'M115',
          filedBy: mockIrsPractitionerUser.name,
          objections: OBJECTIONS_OPTIONS_MAP.NO,
          partyIrsPractitioner: true,
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          scenario: 'Nonstandard H',
          secondaryDocument: {
            docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
            documentTitle: 'Motion for Judgment on the Pleadings',
            documentType: 'Motion for Judgment on the Pleadings',
            eventCode: 'M121',
            objections: OBJECTIONS_OPTIONS_MAP.NO,
          },
        },
      },
      mockIrsPractitionerUser,
    );

    const savedCase = updateCaseAndAssociations.mock.calls[0][0].caseToUpdate;
    const secondaryEntry = savedCase.docketEntries.find(
      entry => entry.docketEntryId === 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
    );

    expect(secondaryEntry.filedBy).toEqual('Resp.');
  });

  it('should add documents and workitems but NOT auto-serve Simultaneous documents on the parties', async () => {
    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Simultaneous Memoranda of Law',
          documentType: 'Simultaneous Memoranda of Law',
          eventCode: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
          filedBy: 'Test Petitioner',
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      },
      mockIrsPractitionerUser,
    );

    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(upsertWorkItems).toHaveBeenCalled();
    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).not.toHaveBeenCalled();

    const savedCase = updateCaseAndAssociations.mock.calls[0][0].caseToUpdate;
    const entry = savedCase.docketEntries.find(
      de => de.documentType === 'Simultaneous Memoranda of Law',
    );
    expect(entry).toBeDefined();
    expect(entry?.servedAt).toBeUndefined();
  });

  it('should automatically block the case if the document filed is a tracked document', async () => {
    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          category: 'Application',
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Application for Waiver of Filing Fee',
          documentType: 'Application for Waiver of Filing Fee',
          eventCode: 'APPW',
          filedBy: 'Test Petitioner',
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      },
      mockIrsPractitionerUser,
    );

    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
    });
  });

  it('should automatically block the case with deadlines if the document filed is a tracked document and the case has a deadline', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      new CaseDeadline(MOCK_CASE_DEADLINE),
    ]);

    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          category: 'Application',
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Application for Waiver of Filing Fee',
          documentType: 'Application for Waiver of Filing Fee',
          eventCode: 'APPW',
          filedBy: 'Test Petitioner',
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      },
      mockIrsPractitionerUser,
    );

    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
    });
  });

  it('should not sendServedPartiesEmails if docketEntryId is undefined', async () => {
    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'XYZ',
          filedBy: 'Test Petitioner',
          primaryDocumentId: undefined,
        },
      },
      mockIrsPractitionerUser,
    );

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).not.toHaveBeenCalled();
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    await expect(
      fileExternalDocumentInteractor(
        applicationContext,
        {
          documentMetadata: {
            category: 'Application',
            docketNumber: caseRecord.docketNumber,
            documentTitle: 'Application for Waiver of Filing Fee',
            documentType: 'Application for Waiver of Filing Fee',
            eventCode: 'APPW',
            filedBy: 'Test Petitioner',
            primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          },
        },
        mockIrsPractitionerUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          category: 'Application',
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Application for Waiver of Filing Fee',
          documentType: 'Application for Waiver of Filing Fee',
          eventCode: 'APPW',
          filedBy: 'Test Petitioner',
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      },
      mockIrsPractitionerUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${caseRecord.docketNumber}`],
      }),
    );
  });

  it('should throw an unauthorized error if the user is not related to a case', async () => {
    getUserById.mockResolvedValue(mockPetitionerUser as DbUser);
    const result = fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          category: 'Application',
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Application for Waiver of Filing Fee',
          documentType: 'Application for Waiver of Filing Fee',
          eventCode: 'APPW',
          filedBy: 'Test Petitioner',
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      },
      mockPetitionerUser,
    );

    await expect(result).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(result).rejects.toThrow(
      `User is not associated with case: ${caseRecord.docketNumber}`,
    );
  });

  it('should throw an unauthorized error if the private practitioner has a pending case association', async () => {
    getUserById.mockResolvedValue(mockPrivatePractitionerUser as DbUser);
    verifyPendingCaseForUser.mockResolvedValue(true);
    const result = fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Entry of Appearance for IRS Practitioner',
          documentType: 'Entry of Appearance',
          eventCode: 'EA',
          filedBy: 'IRS Practitioner',
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      },
      mockPrivatePractitionerUser,
    );

    await expect(result).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(result).rejects.toThrow(
      `User is not associated with case: ${caseRecord.docketNumber}`,
    );
  });

  it('should allow private practitioner to file an entry of appearance', async () => {
    getUserById.mockResolvedValue(mockPrivatePractitionerUser as DbUser);
    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Entry of Appearance for Private Practitioner',
          documentType: 'Entry of Appearance',
          eventCode: 'EA',
          filedBy: 'Private Practitioner',
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      },
      mockPrivatePractitionerUser,
    );

    expect(updateCaseAndAssociations).toHaveBeenCalled();
  });

  it('should allow IRS practitioner to file an entry of appearance', async () => {
    getUserById.mockResolvedValue({
      ...mockIrsPractitionerUser,
      email: 'mockIrsPractitioner2@example.com',
      userId: '4eb0a70d-ed4c-4715-a95f-261cb1441db0',
    } as DbUser);
    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Entry of Appearance for IRS Practitioner',
          documentType: 'Entry of Appearance',
          eventCode: 'EA',
          filedBy: 'IRS Practitioner',
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      },
      mockIrsPractitionerUser,
    );

    expect(updateCaseAndAssociations).toHaveBeenCalled();
  });
});
