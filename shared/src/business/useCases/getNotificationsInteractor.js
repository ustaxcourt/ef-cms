const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * getNotificationsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.judgeUser optional judgeUser for additional filtering
 * @returns {object} inbox unread message counts for the individual and section inboxes
 */
exports.getNotificationsInteractor = async ({
  applicationContext,
  judgeUserId,
}) => {
  const appContextUser = applicationContext.getCurrentUser();
  const currentUser = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: appContextUser.userId });

  let judgeUser = null;

  if (judgeUserId) {
    judgeUser = await applicationContext
      .getPersistenceGateway()
      .getUserById({ applicationContext, userId: judgeUserId });
  }

  if (!isAuthorized(currentUser, ROLE_PERMISSIONS.MESSAGES)) {
    throw new UnauthorizedError('Unauthorized to get inbox counts');
  }

  const { section, userId } = currentUser;
  const sectionToShow = applicationContext
    .getUtilities()
    .getDocQcSectionForUser(currentUser);

  const additionalFilters = applicationContext
    .getUtilities()
    .filterQcItemsByAssociatedJudge({
      applicationContext,
      judgeUser,
    });

  const filters = applicationContext
    .getUtilities()
    .getWorkQueueFilters({ additionalFilters, user: currentUser });

  const userInbox = await applicationContext
    .getPersistenceGateway()
    .getUserInboxMessages({ applicationContext, userId });

  const sectionInbox = await applicationContext
    .getPersistenceGateway()
    .getSectionInboxMessages({ applicationContext, section });

  const documentQCIndividualInbox = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInboxForUser({
      applicationContext,
      userId,
    });

  const documentQCSectionInbox = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInboxForSection({
      applicationContext,
      section: sectionToShow,
    });

  let qcIndividualInboxCount = 0;
  let qcIndividualInProgressCount = 0;

  applicationContext
    .getUtilities()
    .filterWorkItemsForUser({
      user: currentUser,
      workItems: documentQCIndividualInbox,
    })
    .forEach(item => {
      if (
        item.docketEntry.isFileAttached !== false &&
        additionalFilters(item)
      ) {
        if (item.caseIsInProgress) {
          qcIndividualInProgressCount++;
        } else {
          qcIndividualInboxCount++;
        }
      }
    });

  const qcSectionInProgressCount = documentQCSectionInbox.filter(
    filters['section']['inProgress'],
  ).length;
  const qcSectionInboxCount = documentQCSectionInbox.filter(
    filters['section']['inbox'],
  ).length;

  return {
    qcIndividualInProgressCount,
    qcIndividualInboxCount,
    qcSectionInProgressCount,
    qcSectionInboxCount,
    qcUnreadCount: documentQCIndividualInbox.filter(item => !item.isRead)
      .length,
    userInboxCount: userInbox.length,
    userSectionCount: sectionInbox.length,
  };
};
