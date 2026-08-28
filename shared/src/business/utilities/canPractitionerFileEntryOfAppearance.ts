import { isSealedCase } from '@shared/business/entities/cases/Case';
import {
  PRACTICE_TYPE,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawUser } from '@shared/business/entities/User';

const isUserADojPractitioner = (
  user: RawUser | RawPractitioner | RawIrsPractitioner,
): boolean => {
  if (user.role !== ROLES.irsPractitioner) return false;
  const irsPractitioner: RawPractitioner = user as RawPractitioner;
  if (irsPractitioner.practiceType !== PRACTICE_TYPE.DOJ) return false;
  return true;
};

export const canPractitionerFileEntryOfAppearance = ({
  user,
  caseDetail,
  canDojPractitionersRepresentParty,
  hasPendingAssociation,
}: {
  user: RawUser;
  caseDetail: RawCase;
  canDojPractitionersRepresentParty?: boolean;
  hasPendingAssociation?: boolean;
}): boolean => {
  if (user.role === ROLES.privatePractitioner) {
    const isCaseSealed = isSealedCase(caseDetail);
    return !hasPendingAssociation && !isCaseSealed;
  }
  if (user.role === ROLES.irsPractitioner) {
    const caseHasRespondent = !!caseDetail.irsPractitioners?.length;
    const isCaseSealed = isSealedCase(caseDetail);
    const isDojPractitioner = isUserADojPractitioner(user);
    return (
      caseHasRespondent &&
      !isCaseSealed &&
      !!(!isDojPractitioner || canDojPractitionersRepresentParty)
    );
  }

  return false;
};
