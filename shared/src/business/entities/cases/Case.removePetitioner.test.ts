import { Case, getContactPrimary } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockAdmissionsClerkUser } from '@shared/test/mockAuthUsers';

describe('removePetitioner', () => {
  it('should remove the petitioner by contactId from the petitioners array', () => {
    const caseEntity = new Case(MOCK_CASE, {
      authorizedUser: mockAdmissionsClerkUser,
    });
    const numberOfPetitionersOnCase = caseEntity.petitioners.length;
    expect(caseEntity.petitioners.length).toEqual(numberOfPetitionersOnCase);

    caseEntity.removePetitioner(getContactPrimary(MOCK_CASE).contactId);

    expect(caseEntity.petitioners.length).toEqual(
      numberOfPetitionersOnCase - 1,
    );
  });
});
