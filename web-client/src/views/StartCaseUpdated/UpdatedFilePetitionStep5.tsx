import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import { StateDrivenFileInput } from '@web-client/views/FileDocument/StateDrivenFileInput';
import { UpdatedFilePetitionButtons } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionButtons';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const UpdatedFilePetitionStep5 = connect(
  {
    constants: state.constants,
    validationErrors: state.validationErrors,
  },
  function UpdatedFilePetitionStep5({ constants, validationErrors }) {
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
                  It&apos;s sent to the IRS to help identify you but is{' '}
                  <b>never visible as part of the case record.</b>
                </>
              ),
            }}
            dismissible={false}
            scrollToTop={false}
          />
          <div style={{ fontSize: '18px', marginBottom: '3px' }}>
            Download and fill out the form if you haven&apos;t already done so:
          </div>
          <Button
            link
            className="usa-link--external text-left mobile-text-wrap text-semibold"
            href="https://www.ustaxcourt.gov/resources/forms/Form_4_Statement_of_Taxpayer_Identification_Number.pdf"
            marginDirection="bottom"
            rel="noopener noreferrer"
            target="_blank"
          >
            Statement of Taxpayer Identification Number (T.C. Form 4).{' '}
            <Icon
              className="fa-icon-blue"
              icon={['fa-soli', 'fa-arrow-up-right-from-square']}
              size="1x"
            />
          </Button>

          <div className="margin-top-3">
            <FormGroup
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
                validationSequence="validateUpdatedFilePetitionStep5Sequence"
              />
            </FormGroup>
          </div>
        </div>
        <div>
          <UpdatedFilePetitionButtons />
        </div>
      </>
    );
  },
);
