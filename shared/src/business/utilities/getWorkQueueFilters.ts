import {
  CASE_SERVICES_SUPERVISOR_SECTION,
  CASE_STATUS_TYPES,
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} from '../entities/EntityConstants';

export const getDocQcSectionForUser = user => {
  const showDocketSectionQC =
    user.section !== PETITIONS_SECTION &&
    user.section !== CASE_SERVICES_SUPERVISOR_SECTION;

  return showDocketSectionQC ? DOCKET_SECTION : user.section;
};

export const getWorkQueueFilters = ({ section, user }) => {
  const sectionToDisplay = section || getDocQcSectionForUser(user);
  const isCaseServicesSupervisor = user.role === ROLES.caseServicesSupervisor;
  const isDocketClerk = user.role === ROLES.docketClerk;
  const isPetitionsClerk = user.role === ROLES.petitionsClerk;

  const canViewPetitionsSection = isPetitionsClerk || isCaseServicesSupervisor;
  const canViewDocketSection = isDocketClerk || isCaseServicesSupervisor;

  let sectionToMatch;

  if (isCaseServicesSupervisor) {
    sectionToMatch = section || sectionToDisplay;
  } else {
    sectionToMatch = user.section;
  }

  return {
    my: {
      inProgress: item => {
        return (
          // DocketClerks
          (item.assigneeId === user.userId &&
            canViewDocketSection &&
            !item.completedAt &&
            item.section === sectionToMatch &&
            (item.docketEntry.isFileAttached === false || item.inProgress)) ||
          // PetitionsClerks
          (item.assigneeId === user.userId &&
            canViewPetitionsSection &&
            ((item.caseStatus === CASE_STATUS_TYPES.new &&
              item.caseIsInProgress === true) || // caseIsInProgress only looked at for petitions clerks
              item.inProgress === true))
        );
      },
      inbox: item => {
        return (
          item.assigneeId === user.userId &&
          !item.completedAt &&
          item.section === sectionToMatch &&
          item.docketEntry.isFileAttached !== false &&
          !item.inProgress &&
          item.caseIsInProgress !== true
        );
      },
      outbox: item => {
        return (
          (canViewPetitionsSection ? !!item.section : true) &&
          item.completedByUserId &&
          item.completedByUserId === user.userId &&
          !!item.completedAt
        );
      },
    },
    section: {
      inProgress: item => {
        return (
          // DocketClerks
          (!item.completedAt &&
            canViewDocketSection &&
            item.section === sectionToMatch &&
            (item.docketEntry.isFileAttached === false || item.inProgress)) ||
          // PetitionsClerks
          (canViewPetitionsSection &&
            ((item.caseStatus === CASE_STATUS_TYPES.new &&
              item.caseIsInProgress === true) ||
              item.inProgress === true))
        );
      },
      inbox: item => {
        return (
          !item.completedAt &&
          item.section === sectionToDisplay &&
          item.docketEntry.isFileAttached !== false &&
          !item.inProgress &&
          item.caseIsInProgress !== true
        );
      },
      outbox: item => {
        return (
          !!item.completedAt &&
          (canViewPetitionsSection ? !!item.section : true)
        );
      },
    },
  };
};
