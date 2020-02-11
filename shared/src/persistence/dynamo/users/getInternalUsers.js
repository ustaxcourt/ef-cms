const {
  ADC_SECTION,
  DOCKET_SECTION,
  PETITIONS_SECTION,
} = require('../../../business/entities/WorkQueue');
const { getUsersInSection } = require('./getUsersInSection');

exports.getInternalUsers = async ({ applicationContext }) => {
  const users = [
    ...(await getUsersInSection({
      applicationContext,
      section: DOCKET_SECTION,
    })),
    ...(await getUsersInSection({
      applicationContext,
      section: PETITIONS_SECTION,
    })),
    ...(await getUsersInSection({
      applicationContext,
      section: ADC_SECTION,
    })),
  ];

  return users;
};
