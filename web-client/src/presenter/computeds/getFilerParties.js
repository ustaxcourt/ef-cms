import { CONTACT_TYPE_TITLES } from '../../../../shared/src/business/entities/EntityConstants';

export const getFilerParties = ({ caseDetail, filersMap = {} }) => {
  const nameAndTitleArray = [];
  Object.entries(filersMap)
    .filter(([, isChecked]) => isChecked)
    .forEach(([filerContactId]) => {
      const foundPetitioner = caseDetail.petitioners.find(
        petitioner => petitioner.contactId === filerContactId,
      );
      if (foundPetitioner) {
        nameAndTitleArray.push(
          `${foundPetitioner.name}, ${
            CONTACT_TYPE_TITLES[foundPetitioner.contactType]
          }`,
        );
      }
    });

  return nameAndTitleArray;
};
