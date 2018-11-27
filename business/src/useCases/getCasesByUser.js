exports.getCasesByUser = ({ userId, applicationContext }) => {
  return applicationContext.persistence.getCasesByUser({
    userId,
    applicationContext,
  });
};
