import { AuthUser } from '../entities/authUser/AuthUser';
import {
  CASE_STATUS_TYPES,
  CaseStatus,
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
  judgeId?: string;
  user: AuthUser;
  section: string;
  selectedSection?: string;
}): {
  caseStatus: CaseStatus | undefined;
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

  let caseStatus: CaseStatus | undefined;
  if (sectionToShow === PETITIONS_SECTION) {
    caseStatus = CASE_STATUS_TYPES.new;
  }

  return {
    caseStatus,
    section: onlyTwoSections,
    judgeId: judgeToSearchFor,
  };
};
