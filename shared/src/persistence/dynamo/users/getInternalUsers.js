const {
  ADC_SECTION,
  DOCKET_SECTION,
  PETITIONS_SECTION,
} = require('../../../business/entities/EntityConstants');
const { getUsersInSection } = require('./getUsersInSection');

exports.getInternalUsers = async ({ applicationContext }) => {
  const sections = [ADC_SECTION, DOCKET_SECTION, PETITIONS_SECTION];
  const users = (
    await Promise.all(
      sections.map(section =>
        getUsersInSection({
          applicationContext,
          section: `section|${section}`,
        }),
      ),
    )
  ).flat();

  return users;
};
