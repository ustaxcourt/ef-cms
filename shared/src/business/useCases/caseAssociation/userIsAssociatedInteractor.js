const { ROLES } = require('../../entities/EntityConstants');
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

  if (![ROLES.irsPractitioner, ROLES.privatePractitioner].includes(role)) {
    return false;
  }

  let association;
  if (role === ROLES.irsPractitioner) {
    association = 'irsPractitioners';
  } else {
    association = 'privatePractitioners';
  }
  const associations = caseDetail[association];

  return (
    associations.filter(
      ({ userId: associatedUserId }) => userId === associatedUserId,
    ).length > 0
  );
};
