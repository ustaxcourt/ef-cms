import { pick } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const getFilePetitionPetitionerInformationAction = ({
  get,
}: ActionProps) => {
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

  const petitionerInformation = {
    businessType,
    contactPrimary,
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
          ...contactSecondary,
        }
      : contactSecondary,
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
    petitionerInformation,
  };
};
