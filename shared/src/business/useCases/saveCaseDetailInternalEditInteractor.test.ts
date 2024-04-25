import {
  CONTACT_TYPES,
  PARTY_TYPES,
  PETITIONS_SECTION,
  ROLES,
} from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_LOCK } from '../../test/mockLock';
import { MOCK_PRACTITIONER, petitionsClerkUser } from '../../test/mockUsers';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../test/createTestApplicationContext';
import { getContactPrimary, getContactSecondary } from '../entities/cases/Case';
import { omit } from 'lodash';
import { saveCaseDetailInternalEditInteractor } from './saveCaseDetailInternalEditInteractor';

describe('updateCase', () => {
  const mockCase = {
    ...MOCK_CASE,
    docketEntries: [
      {
        ...MOCK_CASE.docketEntries[0],
        workItem: {
          docketEntry: MOCK_CASE.docketEntries[0],
          docketNumber: MOCK_CASE.docketNumber,
          isInitializeCase: true,
          section: PETITIONS_SECTION,
          sentBy: 'petitioner',
          workItemId: '4a57f4fe-991f-4d4b-bca4-be2a3f5bb5f8',
        },
      },
    ],
  };

  const mockContactSecondaryId = 'dce93a76-9c95-4dad-8c02-ea4b7ccb0c57';

  const mockCaseWithContactSecondary = {
    ...mockCase,
    partyType: PARTY_TYPES.petitionerSpouse,
    petitioners: [
      ...mockCase.petitioners,
      {
        ...mockCase.petitioners[0],
        contactId: mockContactSecondaryId,
        contactType: CONTACT_TYPES.secondary,
      },
    ],
  };
  let mockLock;
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(petitionsClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);
  });

  it('should throw an error if caseToUpdate is not passed in', async () => {
    await expect(
      saveCaseDetailInternalEditInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
      } as any),
    ).rejects.toThrow('cannot process');
  });

  it('should throw an error if the user is unauthorized to update a case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'nope',
      userId: 'nope',
    });

    await expect(
      saveCaseDetailInternalEditInteractor(applicationContext, {
        caseToUpdate: mockCase,
        docketNumber: mockCase.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for update case');
  });

  it('should throw an error if the caseToUpdate passed in is an invalid case', async () => {
    await expect(
      saveCaseDetailInternalEditInteractor(applicationContext, {
        caseToUpdate: omit({ ...mockCase }, 'caseCaption'),
        docketNumber: mockCase.docketNumber,
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });

  it('should update contactSecondary', async () => {
    const mockAddress = '1234 Something Lane';

    const result = await saveCaseDetailInternalEditInteractor(
      applicationContext,
      {
        caseToUpdate: {
          ...mockCaseWithContactSecondary,
          caseCaption: 'Iola Snow & Linda Singleton, Petitioners',
          contactPrimary: getContactPrimary(mockCase),
          contactSecondary: {
            ...getContactSecondary(mockCaseWithContactSecondary),
            address1: mockAddress,
          },
        },
        docketNumber: mockCase.docketNumber,
      },
    );

    expect(result.petitioners[1].address1).toEqual(mockAddress);
  });

  it("should move the initialize case work item into the current user's in-progress box if the case is not paper", async () => {
    const caseToUpdate = Object.assign(mockCase);

    await saveCaseDetailInternalEditInteractor(applicationContext, {
      caseToUpdate: {
        ...caseToUpdate,
        caseCaption: 'Iola Snow & Linda Singleton, Petitioners',
        contactPrimary: getContactPrimary(mockCase),
      },
      docketNumber: caseToUpdate.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[0][0]
        .workItem,
    ).toMatchObject({
      assigneeId: petitionsClerkUser.userId,
      assigneeName: petitionsClerkUser.name,
      caseIsInProgress: true,
    });
  });

  it('should not update work items if the case is paper', async () => {
    const caseToUpdate = Object.assign(mockCase);
    caseToUpdate.isPaper = true;
    caseToUpdate.mailingDate = 'yesterday';

    await saveCaseDetailInternalEditInteractor(applicationContext, {
      caseToUpdate: {
        ...caseToUpdate,
        caseCaption: 'Iola Snow & Linda Singleton, Petitioners',
        contactPrimary: getContactPrimary(mockCase),
      },
      docketNumber: caseToUpdate.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
  });

  it('should fail if the primary or secondary contact is empty', async () => {
    const caseToUpdate = Object.assign(mockCase);

    await expect(
      saveCaseDetailInternalEditInteractor(applicationContext, {
        caseToUpdate: {
          ...caseToUpdate,
          contactPrimary: null,
          contactSecondary: {},
        },
        docketNumber: caseToUpdate.docketNumber,
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });

  it('should remove a new initial filing document from the case', async () => {
    const mockRQT = {
      docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3850',
      docketNumber: MOCK_CASE.docketNumber,
      documentType: 'Request for Place of Trial',
      eventCode: 'RQT',
      filedBy: 'Test Petitioner',
      filedByRole: ROLES.petitioner,
      userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        docketEntries: [...mockCase.docketEntries, mockRQT],
        isPaper: true,
      });

    await saveCaseDetailInternalEditInteractor(applicationContext, {
      caseToUpdate: {
        ...mockCase,
        contactPrimary: getContactPrimary(mockCase),
        docketEntries: [...mockCase.docketEntries, mockRQT],
        isPaper: true,
        mailingDate: 'yesterday',
      },
      docketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateInitialFilingDocuments,
    ).toHaveBeenCalled();
  });

  it('should update which orders are needed', async () => {
    const caseToUpdate = Object.assign(mockCase);
    caseToUpdate.isPaper = true;
    caseToUpdate.orderDesignatingPlaceOfTrial = true;
    caseToUpdate.orderForAmendedPetition = true;
    caseToUpdate.orderForAmendedPetitionAndFilingFee = true;
    caseToUpdate.orderForFilingFee = true;
    caseToUpdate.orderForCds = true;
    caseToUpdate.orderForRatification = true;
    caseToUpdate.orderToShowCause = true;

    const result = await saveCaseDetailInternalEditInteractor(
      applicationContext,
      {
        caseToUpdate: {
          ...caseToUpdate,
          contactPrimary: getContactPrimary(mockCase),
        },
        docketNumber: caseToUpdate.docketNumber,
      },
    );

    expect(result.orderDesignatingPlaceOfTrial).toBeTruthy();
    expect(result.orderForAmendedPetition).toBeTruthy();
    expect(result.orderForAmendedPetitionAndFilingFee).toBeTruthy();
    expect(result.orderForFilingFee).toBeTruthy();
    expect(result.orderForCds).toBeTruthy();
    expect(result.orderForRatification).toBeTruthy();
    expect(result.orderToShowCause).toBeTruthy();
  });

  it('should not change contact primary contactId when saving case', async () => {
    const result = await saveCaseDetailInternalEditInteractor(
      applicationContext,
      {
        caseToUpdate: {
          ...mockCase,
          contactPrimary: {
            ...getContactPrimary(mockCase),
          },
          petitioners: undefined,
        },
        docketNumber: mockCase.docketNumber,
      },
    );

    expect(result.petitioners[0].contactId).toEqual(
      mockCase.petitioners[0].contactId,
    );
  });

  it('should remove contactSecondary if changing from a party type with primary and secondary to a party type with only primary', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCaseWithContactSecondary);

    const result = await saveCaseDetailInternalEditInteractor(
      applicationContext,
      {
        caseToUpdate: {
          ...mockCaseWithContactSecondary,
          contactPrimary: getContactPrimary(mockCase),
          partyType: PARTY_TYPES.petitioner,
        },
        docketNumber: mockCase.docketNumber,
      },
    );

    expect(result.petitioners.length).toEqual(1);
  });

  it('should remove contactSecondary from privatePractitioner representing array if changing from a party type with primary and secondary to a party type with only primary', async () => {
    const mockCaseWithContactSecondaryRepresented = {
      ...mockCaseWithContactSecondary,
      privatePractitioners: [
        {
          ...MOCK_PRACTITIONER,
          representing: [
            mockCase.petitioners[0].contactId,
            mockContactSecondaryId,
          ],
        },
        {
          ...MOCK_PRACTITIONER,
          representing: [mockCase.petitioners[0].contactId],
          userId: 'fed59505-2abd-4a93-b504-b90ad73da0ac',
        },
      ],
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        mockCaseWithContactSecondaryRepresented,
      );

    const result = await saveCaseDetailInternalEditInteractor(
      applicationContext,
      {
        caseToUpdate: {
          ...mockCaseWithContactSecondaryRepresented,
          contactPrimary: getContactPrimary(mockCase),
          partyType: PARTY_TYPES.petitioner,
        },
        docketNumber: mockCase.docketNumber,
      },
    );

    expect(result.privatePractitioners).toBeDefined();
    expect(result.privatePractitioners![0].representing).toEqual([
      mockCase.petitioners[0].contactId,
    ]);
    expect(result.privatePractitioners![1].representing).toEqual([
      mockCase.petitioners[0].contactId,
    ]);
  });

  it('should not allow the recevedAt field to be updated if it is an electronic filing', async () => {
    const currentCaseDetail = {
      ...mockCase,
      isPaper: false,
      receivedAt: '2021-01-01T16:00:00.000Z',
    };
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({ ...currentCaseDetail });

    const result = await saveCaseDetailInternalEditInteractor(
      applicationContext,
      {
        caseToUpdate: {
          ...mockCase,
          contactPrimary: getContactPrimary(mockCase),
          receivedAt: '2021-08-08T16:00:00.000Z', // a new receivedAt
        },
        docketNumber: mockCase.docketNumber,
      },
    );

    expect(result.receivedAt).toEqual(currentCaseDetail.receivedAt);
  });
  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      saveCaseDetailInternalEditInteractor(applicationContext, {
        caseToUpdate: {
          ...mockCase,
          contactPrimary: {
            ...getContactPrimary(mockCase),
          },
          petitioners: undefined,
        },
        docketNumber: mockCase.docketNumber,
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await saveCaseDetailInternalEditInteractor(applicationContext, {
      caseToUpdate: {
        ...mockCase,
        contactPrimary: {
          ...getContactPrimary(mockCase),
        },
        petitioners: undefined,
      },
      docketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });
});
