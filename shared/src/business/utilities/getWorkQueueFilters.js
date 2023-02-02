const {
  CASE_SERVICES_SUPERVISOR_SECTION,
  CASE_STATUS_TYPES,
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} = require('../entities/EntityConstants');

const getDocQcSectionForUser = user => {
  if (
    user.section !== PETITIONS_SECTION &&
    user.section !== CASE_SERVICES_SUPERVISOR_SECTION
  ) {
    return DOCKET_SECTION;
  } else {
    return user.section;
  }
};

const getWorkQueueFilters = ({ section, user }) => {
  const docQCUserSection = section || getDocQcSectionForUser(user);
  const isCaseServicesSupervisor = user.role === ROLES.caseServicesSupervisor;

  let sectionToMatch;

  if (isCaseServicesSupervisor) {
    sectionToMatch = section || docQCUserSection;
  } else {
    sectionToMatch = user.section;
  }

  return {
    my: {
      inProgress: item => {
        return (
          // DocketClerks
          (item.assigneeId === user.userId &&
            (user.role === ROLES.docketClerk || isCaseServicesSupervisor) &&
            !item.completedAt &&
            item.section === sectionToMatch &&
            (item.docketEntry.isFileAttached === false || item.inProgress)) ||
          // PetitionsClerks
          (item.assigneeId === user.userId &&
            (user.role === ROLES.petitionsClerk || isCaseServicesSupervisor) &&
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
          (user.role === ROLES.petitionsClerk || isCaseServicesSupervisor
            ? !!item.section
            : true) &&
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
            (user.role === ROLES.docketClerk || isCaseServicesSupervisor) &&
            item.section === sectionToMatch &&
            (item.docketEntry.isFileAttached === false || item.inProgress)) ||
          // PetitionsClerks
          ((user.role === ROLES.petitionsClerk || isCaseServicesSupervisor) &&
            ((item.caseStatus === CASE_STATUS_TYPES.new &&
              item.caseIsInProgress === true) ||
              item.inProgress === true))
        );
      },
      inbox: item => {
        return (
          !item.completedAt &&
          item.section === docQCUserSection &&
          item.docketEntry.isFileAttached !== false &&
          !item.inProgress &&
          item.caseIsInProgress !== true
        );
      },
      outbox: item => {
        return (
          !!item.completedAt &&
          (user.role === ROLES.petitionsClerk || isCaseServicesSupervisor
            ? !!item.section
            : true)
        );
      },
    },
  };
};

module.exports = {
  getDocQcSectionForUser,
  getWorkQueueFilters,
};
