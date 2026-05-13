import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/userContacts/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock('@web-api/business/useCases/addCoverToPdf');
jest.mock('@web-api/business/useCaseHelper/service/createChangeItems');
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { addCoverToPdf } from '@web-api/business/useCases/addCoverToPdf';
import { addExistingUserToCase } from '@web-api/business/useCaseHelper/caseAssociation/addExistingUserToCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockAdmissionsClerkUser } from '@shared/test/mockAuthUsers';
import { updatePetitionerInformationInteractor } from './updatePetitionerInformationInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { generateAndServeDocketEntry as generateAndServeDocketEntryMock } from '@web-api/business/useCaseHelper/service/createChangeItems';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

describe('admissions clerk adds a verified petitioner email', () => {
  let mockCase;
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const generateAndServeDocketEntry = jest.mocked(
    generateAndServeDocketEntryMock,
  );
  const getUserById = jest.mocked(getUserByIdMock);
  const updateCaseAndAssociations = jest
    .mocked(updateCaseAndAssociationsMock)
    .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));
  const PRIMARY_CONTACT_ID = MOCK_CASE.petitioners[0].contactId;
  const mockUrl = 'madeUpurl.com';

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

  beforeAll(() => {
    (addCoverToPdf as jest.Mock).mockResolvedValue({});

    applicationContext
      .getUseCaseHelpers()
      .addExistingUserToCase.mockReturnValue(PRIMARY_CONTACT_ID);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockCase = {
      ...MOCK_CASE,
      petitioners: mockPetitioners,
      privatePractitioners: [],
      status: CASE_STATUS_TYPES.generalDocket,
    };

    applicationContext
      .getUseCaseHelpers()
      .createUserForContact.mockResolvedValue(mockCase);

    getCaseByDocketNumber.mockImplementation(() => mockCase);
    generateAndServeDocketEntry.mockResolvedValue({
      url: mockUrl,
      caseEntity: mockCase,
    });
  });

  const mockUpdatedEmail = 'changed-email@example.com';
  const foundMockVerifiedPetitioner = {
    email: mockUpdatedEmail,
    userId: applicationContext.getUniqueId(),
  };
  beforeAll(() => {
    applicationContext
      .getUserGateway()
      .getUserByEmail.mockReturnValue('someMockId');

    getUserById.mockResolvedValue(foundMockVerifiedPetitioner as DbUser);

    applicationContext
      .getUseCaseHelpers()
      .addExistingUserToCase.mockImplementation(addExistingUserToCase); // the real implementation, but inside, it is using the mocks above
  });

  it('should call the update addExistingUserToCase use case helper when the petitioner is adding an email address', async () => {
    await updatePetitionerInformationInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[0],
          updatedEmail: mockUpdatedEmail,
        },
      },
      mockAdmissionsClerkUser,
    );

    expect(
      applicationContext.getUseCaseHelpers().addExistingUserToCase,
    ).toHaveBeenCalled();

    expect(updateCaseAndAssociations).toHaveBeenCalledTimes(1);
    expect(generateAndServeDocketEntry).toHaveBeenCalledTimes(1);
  });

  it('should not call the update addExistingUserToCase use case helper when the petitioner is unchanged', async () => {
    await updatePetitionerInformationInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: mockPetitioners[0],
      },
      mockAdmissionsClerkUser,
    );

    expect(
      applicationContext.getUseCaseHelpers().addExistingUserToCase,
    ).not.toHaveBeenCalled();
  });

  it('should not call createUserForContact when the new email address is not available', async () => {
    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockImplementation(() => false);

    await updatePetitionerInformationInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[0],
          updatedEmail: 'changed-email@example.com',
        },
      },
      mockAdmissionsClerkUser,
    );

    expect(
      applicationContext.getUseCaseHelpers().createUserForContact,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getUseCaseHelpers().addExistingUserToCase,
    ).toHaveBeenCalled();
  });

  it('should call createUserForContact when the new email address is available', async () => {
    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockImplementation(() => true);

    await updatePetitionerInformationInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[0],
          updatedEmail: 'changed-email@example.com',
        },
      },
      mockAdmissionsClerkUser,
    );

    expect(
      applicationContext.getUseCaseHelpers().createUserForContact,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getUseCaseHelpers().addExistingUserToCase,
    ).not.toHaveBeenCalled();
  });
});
