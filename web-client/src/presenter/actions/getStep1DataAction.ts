import { pick } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const getStep1DataAction = ({ get }: ActionProps) => {
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

  const step1Data = {
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
    step1Data,
  };
};
