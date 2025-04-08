import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
jest.mock('@web-api/persistence/dynamo/cases/deleteUserFromCase');

import { MOCK_CASE } from '@shared/test/mockCase';
import { upsertPetitionersOnCase as upsertPetitonerOnCaseMock } from '@web-api/persistence/postgres/cases/parties/upsertPetitionersOnCase';
import { updatePetitionerOnCase as updatePetitionerOnCaseMock } from '@web-api/persistence/postgres/cases/parties/updatePetitionerOnCase';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { mockAdmissionsClerkUser } from '@shared/test/mockAuthUsers';
import { removePetitionerEmailInteractor } from '@web-api/business/useCases/removePetitionerEmailInteractor';
import { deleteUserFromCase as deleteUserFromCaseMock } from '@web-api/persistence/dynamo/cases/deleteUserFromCase';
import { SERVICE_INDICATOR_TYPES } from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';

describe('removePetitionerEmailInteractor', () => {
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);

  const upsertPetitionersOnCase = jest.mocked(upsertPetitonerOnCaseMock);

  const updatePetitionerOnCase = jest.mocked(updatePetitionerOnCaseMock);

  const deleteUserFromCase = jest.mocked(deleteUserFromCaseMock);

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
  });

  it('should remove the email from the petitioner and set serviceIndicator to Paper', async () => {
    await removePetitionerEmailInteractor(
      {
        docketNumber: MOCK_CASE.docketNumber,
        email: MOCK_CASE.petitioners[0].email!,
      },
      mockAdmissionsClerkUser,
    );

    const updatedPetitioner = {
      ...MOCK_CASE.petitioners[0],
      hasElectronicAccess: false,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      email: undefined,
    };

    const petitionerCase = new Case(
      {
        ...MOCK_CASE,
        petitioners: [updatedPetitioner],
      },
      { authorizedUser: mockAdmissionsClerkUser },
    );

    expect(upsertPetitionersOnCase).toHaveBeenCalledWith({
      docketNumber: MOCK_CASE.docketNumber,
      petitionerCase,
    });

    expect(
      updatePetitionerOnCase.mock.calls[0][0].petitioner.contactId,
    ).not.toEqual(updatedPetitioner.contactId);

    expect(deleteUserFromCase.mock.calls[0][0].docketNumber).toEqual(
      MOCK_CASE.docketNumber,
    );

    expect(deleteUserFromCase.mock.calls[0][0].userId).toEqual(
      updatedPetitioner.contactId,
    );
  });
});
