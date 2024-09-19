import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import { InlineLink } from '@web-client/ustc-ui/InlineLink/InlineLink';
import { MAX_FILE_SIZE_MB } from '@shared/business/entities/EntityConstants';
import { StateDrivenFileInput } from '@web-client/views/FileDocument/StateDrivenFileInput';
import React from 'react';
import classNames from 'classnames';

export function CorporateDisclosureUpload({
  hasCorporateDisclosureFile,
  validationErrors,
}) {
  return (
    <>
      <h2 className="margin-top-4">Corporate Disclosure Statement</h2>
      <InfoNotificationComponent
        alertInfo={{
          inlineLinkText: 'Tax Court Rule 60',
          inlineLinkUrl: 'https://ustaxcourt.gov/rules.html',
          message:
            'Tax Court Rule 60 requires a corporation, partnership, or limited liability company filing a Petition with the Court to also file a Corporate Disclosure Statement (CDS).',
        }}
        dismissible={false}
        scrollToTop={false}
      />
      <div>
        {"Download and fill out the form if you haven't already done so:"}
      </div>
      <InlineLink href="https://www.ustaxcourt.gov/resources/forms/Corporate_Disclosure_Statement_Form.pdf">
        Corporate Disclosure Statement (T.C. Form 6)
      </InlineLink>
      <div className="margin-top-205">
        <FormGroup
          errorMessageId="corporate-disclosure-file-error-message"
          errorText={
            validationErrors.corporateDisclosureFile ||
            validationErrors.corporateDisclosureFileSize
          }
        >
          <label
            className={classNames(
              'ustc-upload-cds usa-label with-hint',
              hasCorporateDisclosureFile && 'validated',
            )}
            data-testid="corporate-disclosure-file-label"
            htmlFor="corporate-disclosure-file"
            id="corporate-disclosure-file-label"
          >
            Upload the Corporate Disclosure Statement PDF (.pdf)
          </label>
          <span className="usa-hint">
            Make sure file is not encrypted or password protected. Max file size{' '}
            {MAX_FILE_SIZE_MB}MB.
          </span>
          <StateDrivenFileInput
            aria-describedby="corporate-disclosure-file-label"
            id="corporate-disclosure-file"
            name="corporateDisclosureFile"
            updateFormValueSequence="updateFormValueUpdatedSequence"
            validationSequence="petitionGenerationLiveValidationSequence"
          />
        </FormGroup>
      </div>
    </>
  );
}
