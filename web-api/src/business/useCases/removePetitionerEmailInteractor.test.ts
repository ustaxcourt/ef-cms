import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
jest.mock('@web-api/persistence/dynamo/cases/deleteUserFromCase');
jest.mock('@shared/sharedAppContext');
import { MOCK_CASE } from '@shared/test/mockCase';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  mockAdmissionsClerkUser,
  mockDocketClerkUser,
} from '@shared/test/mockAuthUsers';
import { removePetitionerEmailInteractor } from '@web-api/business/useCases/removePetitionerEmailInteractor';
import { deleteUserFromCase as deleteUserFromCaseMock } from '@web-api/persistence/dynamo/cases/deleteUserFromCase';
import { SERVICE_INDICATOR_TYPES } from '@shared/business/entities/EntityConstants';
import { updateCase as updateCaseMock } from '@web-api/persistence/postgres/cases/updateCase';
import { getUniqueId as getUniqueIdMock } from '@shared/sharedAppContext';

describe('removePetitionerEmailInteractor', () => {
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const deleteUserFromCase = jest.mocked(deleteUserFromCaseMock);
  const updateCase = jest.mocked(updateCaseMock);
  const mockedUniqueId = 'f87136a7-0d4c-4051-9501-b035f4f13e7e';
  jest.mocked(getUniqueIdMock).mockReturnValue(mockedUniqueId);

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
  });

  it('should remove the email from the petitioner and set serviceIndicator to Paper', async () => {
    const oldContactId = MOCK_CASE.petitioners[0].contactId;
    const result = await removePetitionerEmailInteractor(
      {
        docketNumber: MOCK_CASE.docketNumber,
        email: MOCK_CASE.petitioners[0].email!,
      },
      mockAdmissionsClerkUser,
    );

    const updatedPetitioner = {
      ...MOCK_CASE.petitioners[0],
      contactId: mockedUniqueId,
      hasElectronicAccess: false,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      email: undefined,
    };

    expect(
      updateCase.mock.calls[0][0].caseToUpdate.petitioners[0],
    ).toMatchObject({
      contactId: mockedUniqueId,
      hasElectronicAccess: false,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      email: undefined,
    });
    expect(deleteUserFromCase.mock.calls[0][0].docketNumber).toEqual(
      MOCK_CASE.docketNumber,
    );
    expect(deleteUserFromCase.mock.calls[0][0].userId).toEqual(oldContactId);
    expect(result).toBeDefined();
    expect(result).toEqual({ ...updatedPetitioner, contactId: mockedUniqueId });
  });

  it('should throw an unauthorized error when user does not have permission', async () => {
    await expect(
      removePetitionerEmailInteractor(
        {
          docketNumber: MOCK_CASE.docketNumber,
          email: MOCK_CASE.petitioners[0].email!,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when petitioner with given email is not found', async () => {
    const nonExistentEmail = 'nonexistent@example.com';

    await expect(
      removePetitionerEmailInteractor(
        {
          docketNumber: MOCK_CASE.docketNumber,
          email: nonExistentEmail,
        },
        mockAdmissionsClerkUser,
      ),
    ).rejects.toThrow(`Petitioner with email ${nonExistentEmail} not found`);
  });
});
