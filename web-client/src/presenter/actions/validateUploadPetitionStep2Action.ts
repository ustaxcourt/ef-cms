import { UploadPetitionStep2 } from '@shared/business/entities/startCase/UploadPetitionStep2';
import { state } from '@web-client/presenter/app.cerebral';

export const validateUploadPetitionStep2Action = ({
  get,
  path,
}: ActionProps<{ selectedPage: number }>) => {
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

  const errors = new UploadPetitionStep2({
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
  }).getFormattedValidationErrors();
  console.log('errors', errors);

  return errors
    ? path.error({
        errors,
      })
    : path.success();
};
