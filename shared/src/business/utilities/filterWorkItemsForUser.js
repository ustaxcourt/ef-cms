/**
 * filterWorkItemsForUser - filters workItem records based on the provided user
 *
 * @param {object} params the params object
 * @param {object} params.user the user the work items belong to
 * @param {object} params.workItems the work item records to filter
 * @returns {array} the filtered workItems array
 */
exports.filterWorkItemsForUser = ({ user, workItems }) => {
  return workItems.filter(
    workItem =>
      workItem.assigneeId === user.userId && workItem.section === user.section,
  );
};
