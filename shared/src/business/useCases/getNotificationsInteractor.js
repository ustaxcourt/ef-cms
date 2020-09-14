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
  judgeUser,
}) => {
  const currentUser = applicationContext.getCurrentUser();
  const { section, userId } = currentUser;

  const additionalFilters = applicationContext
    .getUtilities()
    .filterQcItemsByAssociatedJudge({
      applicationContext,
      judgeUser,
    });

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
      section,
    });

  let qcIndividialInboxCount = 0;
  let qcIndividualInProgressCount = 0;
  let qcSectionInboxCount = 0;
  let qcSectionInProgressCount = 0;

  documentQCIndividualInbox.forEach(item => {
    if (item.document.isFileAttached !== false && additionalFilters(item)) {
      if (item.caseIsInProgress) {
        qcIndividualInProgressCount++;
      } else {
        qcIndividialInboxCount++;
      }
    }
  });

  documentQCSectionInbox.forEach(item => {
    if (item.document.isFileAttached !== false && additionalFilters(item)) {
      if (item.caseIsInProgress) {
        qcSectionInProgressCount++;
      } else {
        qcSectionInboxCount++;
      }
    }
  });

  return {
    qcIndividialInboxCount,
    qcIndividualInProgressCount,
    qcSectionInProgressCount,
    qcSectionInboxCount,
    qcUnreadCount: documentQCIndividualInbox.filter(item => !item.isRead)
      .length,
  };
};
