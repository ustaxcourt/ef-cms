import { isSealedCase } from '@shared/business/entities/cases/Case';
import {
  PRACTICE_TYPE,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawUser } from '@shared/business/entities/User';

const isUserADojPractitioner = (user: RawPractitioner): boolean => {
  return user.practiceType === PRACTICE_TYPE.DOJ;
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
    const isDojPractitioner = isUserADojPractitioner(user as RawPractitioner);
    return (
      caseHasRespondent &&
      !isCaseSealed &&
      !!(!isDojPractitioner || canDojPractitionersRepresentParty)
    );
  }

  return false;
};
