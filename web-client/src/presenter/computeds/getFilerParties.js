import { CONTACT_TYPE_TITLES } from '../../../../shared/src/business/entities/EntityConstants';

export const getFilerParties = ({ caseDetail, filersMap = {} }) => {
  return Object.entries(filersMap)
    .filter(([, isChecked]) => isChecked)
    .map(([filerContactId]) => {
      const foundPetitioner = caseDetail.petitioners.find(
        petitioner => petitioner.contactId === filerContactId,
      );

      if (foundPetitioner) {
        return `${foundPetitioner.name}, ${
          CONTACT_TYPE_TITLES[foundPetitioner.contactType]
        }`;
      }
    });
};
