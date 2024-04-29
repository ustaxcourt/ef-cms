import { state } from '@web-client/presenter/app.cerebral';

export const getStep2DataAction = ({ get }: ActionProps) => {
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
    inCareOf,
    isSpouseDeceased,
    minorIncompetentType,
    otherType,
    partyType,
    petitionType,
  } = get(state.form);

  const step2Data = {
    businessType,
    contactPrimary,
    contactSecondary,
    corporateDisclosureFile,
    corporateDisclosureFileSize,
    countryType,
    estateType,
    filingType,
    hasSpouseConsent,
    inCareOf,
    isSpouseDeceased,
    minorIncompetentType,
    otherType,
    partyType,
    petitionType,
  };

  return {
    step2Data,
  };
};
