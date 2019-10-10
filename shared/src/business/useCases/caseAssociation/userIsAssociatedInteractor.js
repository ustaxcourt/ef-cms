/**
 * userIsAssociated
 *
 * @param {object} params params
 * @param {object} params.applicationContext the application context
 * @param {object} params.caseDetail case object
 * @param {object} params.user user entity
 * @returns {object} errors
 */
exports.userIsAssociated = ({ caseDetail, user }) => {
  const { role, userId } = user;

  if (userId === caseDetail.userId) {
    return true;
  }

  if (!['respondent', 'practitioner'].includes(role)) {
    return false;
  }

  const association = `${role}s`;
  const associations = caseDetail[association];

  return (
    associations.filter(
      ({ userId: associatedUserId }) => userId === associatedUserId,
    ).length > 0
  );
};
