import { ContactPrimaryUpdated } from '@web-client/views/StartCase/ContactPrimaryUpdated';
import React from 'react';

export function OtherContactInformation({
  form,
  isPetitioner,
  otherContactNameLabel,
  petitionGenerationLiveValidationSequence,
  registerRef,
  updateFormValueCountryTypeSequence,
  updateFormValueUpdatedSequence,
}) {
  return (
    <ContactPrimaryUpdated
      addressInfo={form.contactPrimary}
      handleBlur={petitionGenerationLiveValidationSequence}
      handleChange={updateFormValueUpdatedSequence}
      handleChangeCountryType={updateFormValueCountryTypeSequence}
      nameLabel={otherContactNameLabel.primaryLabel}
      registerRef={registerRef}
      secondaryLabel={otherContactNameLabel.secondaryLabel}
      showEmail={!isPetitioner}
      showInCareOf={otherContactNameLabel.showInCareOf}
      showInCareOfOptional={otherContactNameLabel.showInCareOfOptional}
      titleLabel={otherContactNameLabel.titleLabel}
      titleLabelNote={otherContactNameLabel.titleLabelNote}
    />
  );
}
