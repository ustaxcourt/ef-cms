import { Case } from '../entities/cases/Case';

export const isProSe = ({ caseEntity }): boolean => {
  for (const petitioner of caseEntity.petitioners) {
    if (!Case.isPetitionerRepresented(caseEntity, petitioner.contactId)) {
      return true;
    }
  }
  return false;
};
