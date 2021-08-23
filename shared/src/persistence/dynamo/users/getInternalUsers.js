const {
  ADC_SECTION,
  DOCKET_SECTION,
  PETITIONS_SECTION,
} = require('../../../business/entities/EntityConstants');
const { getUsersInSection } = require('./getUsersInSection');

exports.getInternalUsers = async ({ applicationContext }) => {
  const users = [
    ...(await getUsersInSection({
      applicationContext,
      section: `section|${DOCKET_SECTION}`,
    })),
    ...(await getUsersInSection({
      applicationContext,
      section: `section|${PETITIONS_SECTION}`,
    })),
    ...(await getUsersInSection({
      applicationContext,
      section: `section|${ADC_SECTION}`,
    })),
  ];

  return users;
};
