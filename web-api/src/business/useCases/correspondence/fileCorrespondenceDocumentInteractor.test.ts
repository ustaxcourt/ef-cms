import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/caseCorrespondences/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { docketClerkUser } from '@shared/test/mockUsers';
import { fileCorrespondenceDocumentInteractor } from './fileCorrespondenceDocumentInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { upsertCaseCorrespondences as upsertCaseCorrespondencesMock } from '@web-api/persistence/postgres/caseCorrespondences/upsertCaseCorrespondences';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

describe('fileCorrespondenceDocumentInteractor', () => {
  const upsertCaseCorrespondences = upsertCaseCorrespondencesMock as jest.Mock;
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const mockCase = {
    caseCaption: 'Caption',
    caseType: CASE_TYPES_MAP.deficiency,
    docketEntries: [
      {
        docketEntryId: 'cf105788-5d34-4451-aa8d-dfd9a851b675',
        docketNumber: '123-45',
        documentTitle: 'Docket Record 1',
        documentType: 'Order that case is assigned',
        eventCode: 'OAJ',
        filedByRole: ROLES.docketClerk,
        filingDate: createISODateString(),
        index: 1,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: '611dc444-fd8f-43a0-8844-c4d57745c718',
        signedJudgeName: 'Judy',
        userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
      },
    ],
    docketNumber: '123-45',
    filingType: 'Myself',
    partyType: PARTY_TYPES.petitioner,
    petitioners: [
      {
        address1: '123 Main St',
        city: 'Somewhere',
        contactType: CONTACT_TYPES.primary,
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'contact@example.com',
        name: 'Contact Primary',
        phone: '123123134',
        postalCode: '12345',
        state: 'TN',
      },
    ],
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
  };
  const mockDocumentTitle = 'A title';
  const mockFilingDate = '2001-02-01T05:00:00.000Z';
  const mockCorrespondenceId = '14bb669b-0962-4781-87a0-50718f556e2b';

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    updateCaseAndAssociations.mockImplementation(({ caseToUpdate }) =>
      Promise.resolve(caseToUpdate),
    );
  });

  it('should throw an Unauthorized error when the user role does not have theCASE_CORRESPONDENCE permission', async () => {
    await expect(
      fileCorrespondenceDocumentInteractor(
        applicationContext,
        {
          documentMetadata: {
            docketNumber: mockCase.docketNumber,
          } as any,
          primaryDocumentFileId: mockCorrespondenceId,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw a Not Found error if the case can not be found', async () => {
    getCaseByDocketNumber.mockReturnValue(null);

    await expect(
      fileCorrespondenceDocumentInteractor(
        applicationContext,
        {
          documentMetadata: { docketNumber: mockCase.docketNumber } as any,
          primaryDocumentFileId: mockCorrespondenceId,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(`Case ${mockCase.docketNumber} was not found`);
  });

  it('should add the correspondence document to the case when the case entity is valid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);
    getCaseByDocketNumber.mockReturnValue(mockCase);

    await fileCorrespondenceDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: mockCase.docketNumber,
          documentTitle: mockDocumentTitle,
          filingDate: mockFilingDate,
        } as any,
        primaryDocumentFileId: mockCorrespondenceId,
      },
      docketClerkUser,
    );
    expect(upsertCaseCorrespondences.mock.calls[0][0]).toMatchObject([
      {
        correspondenceId: mockCorrespondenceId,
        docketNumber: mockCase.docketNumber,
        documentTitle: mockDocumentTitle,
        filedBy: docketClerkUser.name,
        filingDate: mockFilingDate,
        userId: docketClerkUser.userId,
      },
    ]);
  });

  it('should return an updated raw case object', async () => {
    getCaseByDocketNumber.mockReturnValue(mockCase);

    const result = await fileCorrespondenceDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: mockCase.docketNumber,
          documentTitle: mockDocumentTitle,
          filingDate: mockFilingDate,
        } as any,
        primaryDocumentFileId: mockCorrespondenceId,
      },
      mockDocketClerkUser,
    );
    expect(result).toMatchObject({
      ...mockCase,
      correspondence: [
        {
          correspondenceId: mockCorrespondenceId,
          docketNumber: mockCase.docketNumber,
          documentTitle: mockDocumentTitle,
          filedBy: docketClerkUser.name,
          filingDate: mockFilingDate,
          userId: docketClerkUser.userId,
        },
      ],
    });
  });
});
