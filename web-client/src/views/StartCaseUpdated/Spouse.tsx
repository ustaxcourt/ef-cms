import { ContactSecondaryUpdated } from '@web-client/views/StartCase/ContactSecondaryUpdated';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import React from 'react';
import classNames from 'classnames';

export function Spouse({
  contactSecondary,
  hasSpouseConsent,
  petitionGenerationLiveValidationSequence,
  registerRef,
  resetSecondaryAddressSequence,
  updateFormValueCountryTypeSequence,
  updateFormValueSequence,
  updateFormValueUpdatedSequence,
  useSameAsPrimary,
  validationErrors,
}) {
  return (
    <>
      <WarningNotificationComponent
        alertWarning={{
          message:
            'To file on behalf of your spouse, you must have consent. If you do not have your spouse\'s consent, select "Myself" as the person who is filing.',
        }}
        dismissible={false}
        scrollToTop={false}
      />
      <FormGroup
        className={classNames(
          validationErrors.hasSpouseConsent && 'usa-form-group--error',
        )}
        errorMessageId="has-spouse-consent-error-message"
        errorText={validationErrors.hasSpouseConsent}
      >
        <input
          checked={hasSpouseConsent || false}
          className="usa-checkbox__input"
          id="spouse-consent"
          name="hasSpouseConsent"
          ref={registerRef && registerRef('hasSpouseConsent')}
          type="checkbox"
          onChange={e => {
            updateFormValueSequence({
              key: e.target.name,
              value: e.target.checked,
            });
            resetSecondaryAddressSequence({
              key: e.target.name,
              value: e.target.checked,
            });
          }}
        />
        <label
          className="usa-checkbox__label"
          data-testid="have-spouse-consent-label"
          htmlFor="spouse-consent"
        >
          {"I have my spouse's consent"}
        </label>
      </FormGroup>
      {hasSpouseConsent && (
        <ContactSecondaryUpdated
          addressInfo={contactSecondary}
          handleBlur={petitionGenerationLiveValidationSequence}
          handleChange={updateFormValueUpdatedSequence}
          handleChangeCountryType={updateFormValueCountryTypeSequence}
          nameLabel="Full name of spouse"
          registerRef={registerRef}
          showSameAsPrimaryCheckbox={true}
          useSameAsPrimary={useSameAsPrimary}
        />
      )}
    </>
  );
}
