import { Case } from '@shared/business/entities/cases/Case';
import {
  PRACTICE_TYPE,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawUser } from '@shared/business/entities/User';

export const canUserFileFirstIrsFiling = (
  user: RawUser,
  caseDetail: RawCase,
): boolean => {
  if (user.role === ROLES.irsPractitioner) {
    const isDojPractitioner =
      (user as RawPractitioner).practiceType === PRACTICE_TYPE.DOJ;

    return Case.isFirstIrsFiling(caseDetail) && !isDojPractitioner;
  }

  return false;
};
