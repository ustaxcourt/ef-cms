import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createISODateString } from '../../../../../shared/src/business/utilities/DateHandler';
import {
  docketClerkUser,
  petitionerUser,
} from '../../../../../shared/src/test/mockUsers';
import { fileCorrespondenceDocumentInteractor } from './fileCorrespondenceDocumentInteractor';

describe('fileCorrespondenceDocumentInteractor', () => {
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
    applicationContext.getCurrentUser.mockImplementation(() => docketClerkUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(caseToUpdate => caseToUpdate);
  });

  it('should throw an Unauthorized error if the user role does not have theCASE_CORRESPONDENCE permission', async () => {
    const user = petitionerUser;
    applicationContext.getCurrentUser.mockReturnValue(user);

    await expect(
      fileCorrespondenceDocumentInteractor(applicationContext, {
        documentMetadata: {
          docketNumber: mockCase.docketNumber,
        } as any,
        primaryDocumentFileId: mockCorrespondenceId,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw a Not Found error if the case can not be found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(null);

    await expect(
      fileCorrespondenceDocumentInteractor(applicationContext, {
        documentMetadata: { docketNumber: mockCase.docketNumber } as any,
        primaryDocumentFileId: mockCorrespondenceId,
      }),
    ).rejects.toThrow(`Case ${mockCase.docketNumber} was not found`);
  });

  it('should add the correspondence document to the case when the case entity is valid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);

    await fileCorrespondenceDocumentInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: mockCase.docketNumber,
        documentTitle: mockDocumentTitle,
        filingDate: mockFilingDate,
      } as any,
      primaryDocumentFileId: mockCorrespondenceId,
    });
    expect(
      applicationContext.getPersistenceGateway().updateCaseCorrespondence.mock
        .calls[0][0],
    ).toMatchObject({
      correspondence: {
        correspondenceId: mockCorrespondenceId,
        documentTitle: mockDocumentTitle,
        filedBy: docketClerkUser.name,
        filingDate: mockFilingDate,
        userId: docketClerkUser.userId,
      },
      docketNumber: mockCase.docketNumber,
    });
  });

  it('should return an updated raw case object', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);

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
    );
    expect(result).toMatchObject({
      ...mockCase,
      correspondence: [
        {
          correspondenceId: mockCorrespondenceId,
          documentTitle: mockDocumentTitle,
          filedBy: docketClerkUser.name,
          filingDate: mockFilingDate,
          userId: docketClerkUser.userId,
        },
      ],
    });
  });
});
