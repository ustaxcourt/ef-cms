const {
  CASE_STATUS_TYPES,
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} = require('../entities/EntityConstants');

const getDocQcSectionForUser = user => {
  if (user.section !== PETITIONS_SECTION) {
    return DOCKET_SECTION;
  } else {
    return user.section;
  }
};

const getWorkQueueFilters = ({ additionalFilters = item => item, user }) => {
  const docQCUserSection = getDocQcSectionForUser(user);

  return {
    my: {
      inProgress: item => {
        return (
          // DocketClerks
          (item.assigneeId === user.userId &&
            user.role === ROLES.docketClerk &&
            !item.completedAt &&
            item.section === user.section &&
            (item.docketEntry.isFileAttached === false || item.inProgress)) ||
          // PetitionsClerks
          (item.assigneeId === user.userId &&
            user.role === ROLES.petitionsClerk &&
            item.caseStatus === CASE_STATUS_TYPES.new &&
            item.caseIsInProgress === true) // caseIsInProgress only looked at for petitionsclerks
        );
      },
      inbox: item => {
        return (
          item.assigneeId === user.userId &&
          !item.completedAt &&
          item.section === user.section &&
          item.docketEntry.isFileAttached !== false &&
          !item.inProgress &&
          item.caseIsInProgress !== true
        );
      },
      outbox: item => {
        return (
          (user.role === ROLES.petitionsClerk ? !!item.section : true) &&
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
            user.role === ROLES.docketClerk &&
            item.section === user.section &&
            (item.docketEntry.isFileAttached === false || item.inProgress)) ||
          // PetitionsClerks
          (user.role === ROLES.petitionsClerk &&
            item.caseStatus === CASE_STATUS_TYPES.new &&
            item.caseIsInProgress === true)
        );
      },
      inbox: item => {
        return (
          !item.completedAt &&
          item.section === docQCUserSection &&
          item.docketEntry.isFileAttached !== false &&
          !item.inProgress &&
          additionalFilters(item) &&
          item.caseIsInProgress !== true
        );
      },
      outbox: item => {
        return (
          !!item.completedAt &&
          (user.role === ROLES.petitionsClerk ? !!item.section : true)
        );
      },
    },
  };
};

module.exports = {
  getDocQcSectionForUser,
  getWorkQueueFilters,
};
