const { CONTACT_TYPE_TITLES } = require('../entities/EntityConstants');

/**
 * Append contact type title to the name of each petitioner.
 *
 * @param {object} petitioners the list of petitioners to format
 * @returns {object} formatted list of petitioners
 */
export const getFormattedPartiesNameAndTitle = ({ petitioners }) => {
  return petitioners?.map(petitioner => ({
    ...petitioner,
    displayName: `${petitioner.name}, ${
      CONTACT_TYPE_TITLES[petitioner.contactType]
    }`,
  }));
};
