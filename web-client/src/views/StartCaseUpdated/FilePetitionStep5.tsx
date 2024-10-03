import { FilePetitionButtons } from '@web-client/views/StartCaseUpdated/FilePetitionButtons';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import { InlineLink } from '@web-client/ustc-ui/InlineLink/InlineLink';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { StateDrivenFileInput } from '@web-client/views/FileDocument/StateDrivenFileInput';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const FilePetitionStep5 = connect(
  {
    constants: state.constants,
    user: state.user,
    validationErrors: state.validationErrors,
  },
  function FilePetitionStep5({ constants, user, validationErrors }) {
    return (
      <>
        <div className="margin-bottom-5">
          <InfoNotificationComponent
            alertInfo={{
              message: (
                <>
                  The Statement of Taxpayer Identification Number is the only
                  document that should include Social Security Numbers, Taxpayer
                  Identification Numbers, or Employer Identification Numbers.
                  It&apos;s sent to the IRS to help identify{' '}
                  {user.role === ROLES.petitioner ? 'you' : 'the petitioner'}{' '}
                  but is <b>never visible as part of the case record.</b>
                </>
              ),
            }}
            dismissible={false}
            scrollToTop={false}
          />
          <div style={{ fontSize: '18px', marginBottom: '3px' }}>
            Download and fill out the form if you haven&apos;t already done so:
            <br />
            <InlineLink href="https://www.ustaxcourt.gov/resources/forms/Form_4_Statement_of_Taxpayer_Identification_Number.pdf">
              Statement of Taxpayer Identification Number (T.C. Form 4).
            </InlineLink>
          </div>

          <div className="margin-top-3">
            <FormGroup
              errorMessageId="stin-file-error-message"
              errorText={[
                validationErrors.stinFile,
                validationErrors.stinFileSize,
              ]}
            >
              <label
                className={classNames('usa-label ustc-upload-stin with-hint')}
                data-testid="stin-file-label"
                htmlFor="stin-file"
                id="stin-file-label"
              >
                Upload the Statement of Taxpayer Identification Number PDF
                (.pdf)
              </label>
              <span className="usa-hint">
                Make sure file is not encrypted or password protected. Max file
                size {constants.MAX_FILE_SIZE_MB}MB.
              </span>
              <StateDrivenFileInput
                aria-describedby="stin-file-label"
                data-testid="stin-file"
                id="stin-file"
                name="stinFile"
                updateFormValueSequence="updateFormValueUpdatedSequence"
                validationSequence="validateFilePetitionStep5Sequence"
              />
            </FormGroup>
          </div>
        </div>
        <div>
          <FilePetitionButtons />
        </div>
      </>
    );
  },
);
