import { CONTACT_TYPE_TITLES } from '@shared/business/entities/EntityConstants';

export const getFormattedPartiesNameAndTitle = ({ petitioners }) => {
  return petitioners?.map(petitioner => ({
    ...petitioner,
    displayName: `${petitioner.name}, ${
      CONTACT_TYPE_TITLES[petitioner.contactType]
    }`,
  }));
};
