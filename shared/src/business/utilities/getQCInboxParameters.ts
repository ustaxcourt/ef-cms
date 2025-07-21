import { AuthUser } from '../entities/authUser/AuthUser';
import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} from '../entities/EntityConstants';

export const getQCInboxParameters = ({
  judgeId,
  user,
  section,
  selectedSection,
}: {
  judgeId: string | undefined;
  user: AuthUser;
  section: string;
  selectedSection?: string;
}): {
  section: typeof PETITIONS_SECTION | typeof DOCKET_SECTION;
  judgeId: string | null | undefined;
} => {
  let judgeToSearchFor: string | null | undefined = judgeId;
  if (user.role === ROLES.adc) {
    judgeToSearchFor = null;
  }

  const sectionToShow = selectedSection || section;
  const onlyTwoSections =
    sectionToShow !== PETITIONS_SECTION ? DOCKET_SECTION : PETITIONS_SECTION;

  return {
    section: onlyTwoSections,
    judgeId: judgeToSearchFor,
  };
};
