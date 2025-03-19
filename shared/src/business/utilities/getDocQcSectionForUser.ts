import {
  CASE_SERVICES_SUPERVISOR_SECTION,
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '../entities/EntityConstants';

export const getDocQcSectionForUser = (user: { section?: string }): string => {
  if (!user.section) {
    return DOCKET_SECTION;
  }

  const showDocketSectionQC =
    user.section !== PETITIONS_SECTION &&
    user.section !== CASE_SERVICES_SUPERVISOR_SECTION;

  return showDocketSectionQC ? DOCKET_SECTION : user.section;
};
