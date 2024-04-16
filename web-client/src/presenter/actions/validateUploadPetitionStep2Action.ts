import { UploadPetitionStep2 } from '@shared/business/entities/startCase/UploadPetitionStep2';
import { state } from '@web-client/presenter/app.cerebral';

export const validateUploadPetitionStep2Action = ({
  get,
  path,
}: ActionProps<{ selectedPage: number }>) => {
  const {
    businessType,
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
  } = get(state.form);

  const errors = new UploadPetitionStep2({
    businessType,
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
  }).getFormattedValidationErrors();
  console.log('errors', errors);

  return errors
    ? path.error({
        errors,
      })
    : path.success();
};
