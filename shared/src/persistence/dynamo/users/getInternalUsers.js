const { stripInternalKeys } = require('../../awsDynamoPersistence');
const { getUsersInSection } = require('./getUsersInSection');
const {
  DOCKET_SECTION,
  PETITIONS_SECTION,
  SENIOR_ATTORNEY_SECTION,
} = require('../../../business/entities/WorkQueue');

exports.getInternalUsers = async ({ applicationContext }) => {
  const users = [
    ...(await getUsersInSection({
      section: DOCKET_SECTION,
      applicationContext,
    })),
    ...(await getUsersInSection({
      section: PETITIONS_SECTION,
      applicationContext,
    })),
    ...(await getUsersInSection({
      section: SENIOR_ATTORNEY_SECTION,
      applicationContext,
    })),
  ];

  return stripInternalKeys(users);
};
