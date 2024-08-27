import { ContactPrimaryUpdated } from '@web-client/views/StartCase/ContactPrimaryUpdated';
import React from 'react';

export function OtherContactInformation({
  form,
  otherContactNameLabel,
  petitionGenerationLiveValidationSequence,
  registerRef,
  updatedFilePetitionHelper,
  updateFormValueCountryTypeSequence,
  updateFormValueUpdatedSequence,
}) {
  return (
    <ContactPrimaryUpdated
      addressInfo={form.contactPrimary}
      customPhoneMessage={updatedFilePetitionHelper.customPhoneMessage}
      handleBlur={petitionGenerationLiveValidationSequence}
      handleChange={updateFormValueUpdatedSequence}
      handleChangeCountryType={updateFormValueCountryTypeSequence}
      nameLabel={otherContactNameLabel.primaryLabel}
      registerRef={registerRef}
      secondaryLabel={otherContactNameLabel.secondaryLabel}
      showInCareOf={otherContactNameLabel.showInCareOf}
      showInCareOfOptional={otherContactNameLabel.showInCareOfOptional}
      titleLabel={otherContactNameLabel.titleLabel}
      titleLabelNote={otherContactNameLabel.titleLabelNote}
    />
  );
}
