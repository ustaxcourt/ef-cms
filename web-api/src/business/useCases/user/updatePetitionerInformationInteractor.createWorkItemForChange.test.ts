import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  PARTY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import {
  MOCK_PRACTITIONER,
  docketClerkUser,
} from '../../../../../shared/src/test/mockUsers';
import { User } from '../../../../../shared/src/business/entities/User';
import { UserCase } from '../../../../../shared/src/business/entities/UserCase';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { updatePetitionerInformationInteractor } from './updatePetitionerInformationInteractor';
jest.mock('./addCoverToPdf');
import { addCoverToPdf } from '../../../../../shared/src/business/useCases/addCoverToPdf';

describe('updatePetitionerInformationInteractor createWorkItemForChange', () => {
  let mockUser;
  let mockCase;
  const PRIMARY_CONTACT_ID = MOCK_CASE.petitioners[0].contactId;

  const mockPetitioners = [
    {
      ...MOCK_CASE.petitioners[0],
      contactType: CONTACT_TYPES.petitioner,
      name: 'Test Primary Petitioner',
    },
    {
      ...MOCK_CASE.petitioners[0],
      contactId: '56387318-0092-49a3-8cc1-921b0432bd16',
      contactType: CONTACT_TYPES.petitioner,
      name: 'Test Secondary Petitioner',
    },
  ];

  const basePractitioner = {
    ...MOCK_PRACTITIONER,
    representing: [mockPetitioners[0].contactId],
  };

  beforeAll(() => {
    (addCoverToPdf as jest.Mock).mockResolvedValue({});

    applicationContext.getCurrentUser.mockImplementation(
      () => new User(mockUser),
    );

    applicationContext
      .getUseCaseHelpers()
      .addExistingUserToCase.mockImplementation(({ caseEntity }) => caseEntity);

    applicationContext
      .getUseCaseHelpers()
      .createUserForContact.mockImplementation(() => new UserCase(mockCase));
  });

  beforeEach(() => {
    mockUser = docketClerkUser;

    mockCase = {
      ...MOCK_CASE,
      petitioners: mockPetitioners,
      privatePractitioners: [],
      status: CASE_STATUS_TYPES.generalDocket,
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);
  });

  it('should create a work item for the NCA when the petitioner is unrepresented', async () => {
    mockCase = {
      ...mockCase,
      partyType: PARTY_TYPES.petitioner,
      petitioners: [mockPetitioners[0]],
      privatePractitioners: [
        {
          ...basePractitioner,
          representing: ['6c5b79e0-2429-4ebc-8e9c-483d0282d4e0'],
        },
      ],
    };

    const result = await updatePetitionerInformationInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[0],
          address1: 'A Changed Street',
        },
      },
    );

    const noticeOfChangeDocketEntryWithWorkItem =
      result.updatedCase.docketEntries.find(d => d.eventCode === 'NCA');

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeDefined();
    expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
      'for Test Primary Petitioner',
    );
  });

  it('should NOT create a work item for the NCA when the petitioner is represented and their service preference is NOT paper', async () => {
    mockCase = {
      ...mockCase,
      partyType: PARTY_TYPES.petitioner,
      petitioners: [mockPetitioners[0]],
      privatePractitioners: [
        { ...basePractitioner, representing: [PRIMARY_CONTACT_ID] },
      ],
    };

    const result = await updatePetitionerInformationInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[0],
          address1: 'A Changed Street',
        },
      },
    );

    const noticeOfChangeDocketEntryWithWorkItem =
      result.updatedCase.docketEntries.find(d => d.eventCode === 'NCA');
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
    expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeUndefined();
    expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
      'for Test Primary Petitioner',
    );
  });

  it('should create a work item for the NCA when the petitioner is represented and their service preference is paper', async () => {
    mockCase = {
      ...mockCase,
      partyType: PARTY_TYPES.petitioner,
      petitioners: [mockPetitioners[0]],
      privatePractitioners: [
        { ...basePractitioner, representing: [PRIMARY_CONTACT_ID] },
      ],
    };

    const result = await updatePetitionerInformationInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[0],
          address1: 'A Changed Street',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      },
    );

    const noticeOfChangeDocketEntryWithWorkItem =
      result.updatedCase.docketEntries.find(d => d.eventCode === 'NCA');

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeDefined();
    expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
      'for Test Primary Petitioner',
    );
  });

  it('should create a work item for the NCA when the petitioner is represented and a private practitioner on the case requests paper service', async () => {
    mockCase = {
      ...mockCase,
      privatePractitioners: [
        {
          ...basePractitioner,
          representing: [PRIMARY_CONTACT_ID],
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      ],
    };

    const result = await updatePetitionerInformationInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[1],
          address1: 'A Changed Street',
        },
      },
    );

    const noticeOfChangeDocketEntryWithWorkItem =
      result.updatedCase.docketEntries.find(d => d.eventCode === 'NCA');

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeDefined();
    expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
      'for Test Secondary Petitioner',
    );
  });
});
