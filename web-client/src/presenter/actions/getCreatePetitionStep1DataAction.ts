import { CONTACT_TYPES } from '@shared/business/entities/EntityConstants';
import { pick } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const getCreatePetitionStep1DataAction = ({ get }: ActionProps) => {
  const {
    businessType,
    contactPrimary,
    contactSecondary,
    corporateDisclosureFile,
    corporateDisclosureFileSize,
    countryType,
    estateType,
    filingType,
    hasSpouseConsent,
    isSpouseDeceased,
    minorIncompetentType,
    otherType,
    partyType,
    petitionType,
    useSameAsPrimary,
  } = get(state.form);

  const contactSecondaryWithType = contactSecondary
    ? {
        ...contactSecondary,
        contactType: CONTACT_TYPES.secondary,
      }
    : contactSecondary;

  const createPetitionStep1Data = {
    businessType,
    contactPrimary: {
      ...contactPrimary,
      contactType: CONTACT_TYPES.primary,
    },
    contactSecondary: useSameAsPrimary
      ? {
          ...pick(contactPrimary, [
            'address1',
            'address2',
            'address3',
            'country',
            'city',
            'countryType',
            'postalCode',
            'state',
          ]),
          ...contactSecondaryWithType,
        }
      : contactSecondaryWithType,
    corporateDisclosureFile,
    corporateDisclosureFileSize,
    countryType,
    estateType,
    filingType,
    hasSpouseConsent,
    isSpouseDeceased,
    minorIncompetentType,
    otherType,
    partyType,
    petitionType,
    useSameAsPrimary,
  };

  return {
    createPetitionStep1Data,
  };
};
