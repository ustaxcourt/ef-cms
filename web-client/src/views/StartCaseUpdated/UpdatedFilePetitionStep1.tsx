import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { StateDrivenFileInput } from '@web-client/views/FileDocument/StateDrivenFileInput';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

import { ErrorNotification } from '@web-client/views/ErrorNotification';
import classNames from 'classnames';

export const UpdatedFilePetitionStep1 = connect(
  {
    constants: state.constants,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updatedFilePetitionCompleteStep1Sequence:
      sequences.updatedFilePetitionCompleteStep1Sequence,
    validationErrors: state.validationErrors,
  },
  function UpdatedFilePetitionStep1({
    constants,
    form,
    updatedFilePetitionCompleteStep1Sequence,
    updateFormValueSequence,
    validationErrors,
  }) {
    return (
      <>
        <ErrorNotification />
        <p className="margin-bottom-3 margin-top-0 required-statement">
          *All fields required
        </p>
        <h2>How do you want to create the Petition?</h2>
        <div className="usa-radio">
          <input
            checked={true}
            className="usa-radio__input"
            id="upload-a-petition"
            name="historical-figures"
            type="radio"
            value="sojourner-truth"
          />
          <label className="usa-radio__label" htmlFor="upload-a-petition">
            {`Upload a completed PDF of the Tax Court's Petition form or my own
            compliant Petition`}
          </label>
        </div>
        <WarningNotificationComponent
          alertWarning={{
            message:
              'Do not include personal information (such as Social Security Numbers, Taxpayer Identification Numbers, Employer Identification Numbers, birthdates, names of minor children, or financial account information) in your Petition or any other filing with the Court except in the Statement of Taxpayer Identification.',
          }}
          dismissible={false}
          scrollToTop={false}
        />
        <p>
          {`You may download and fill out the Court's form if you haven't already
          done so:`}
        </p>
        <Button
          link
          className="usa-link--external text-left mobile-text-wrap"
          href="https://www.ustaxcourt.gov/resources/forms/Petition_Simplified_Form_2.pdf"
          icon="file-pdf"
          iconColor="blue"
          overrideMargin="margin-right-1"
          rel="noopener noreferrer"
          target="_blank"
        >
          Petition form (T.C. Form 2)
        </Button>
        <FormGroup
          errorText={[
            validationErrors.petitionFile,
            validationErrors.petitionFileSize,
          ]}
        >
          <label
            className={classNames(
              'usa-label ustc-upload-stin with-hint',
              // startCaseHelper.showStinFileValid && 'validated',
            )}
            data-testid="stin-file-label"
            htmlFor="stin-file"
            id="stin-file-label"
          >
            Upload the Petition PDF (.pdf)
          </label>
          <span className="usa-hint">
            Make sure file is not encrypted or password protected. Max file size{' '}
            {constants.MAX_FILE_SIZE_MB}MB.
          </span>
          <StateDrivenFileInput
            aria-describedby="petition-file-label"
            data-testid="petition-file"
            id="petition-file"
            name="petitionFile"
            updateFormValueSequence="updateFormValueSequence"
            // validationSequence="validateStartCaseWizardSequence"
          />
        </FormGroup>
        <div className="grid-row grid-gap">
          {/* #validationErrors.ack */}
          <span className="margin-bottom-1 font-sans-pro">
            <b>Please read and acknowledge before submitting your filing</b>
          </span>
          <div className="tablet:grid-col-12">
            <div className="card">
              <div className="content-wrapper usa-checkbox">
                <input
                  aria-describedby="redaction-acknowledgement-label"
                  checked={form.redactionAcknowledgement || false}
                  className="usa-checkbox__input"
                  id="redaction-acknowledgement"
                  name="redactionAcknowledgement"
                  type="checkbox"
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  data-testid="redaction-acknowledgement-label"
                  htmlFor="redaction-acknowledgement"
                  id="redaction-acknowledgement-label"
                >
                  <b>
                    All documents I am filing have been redacted in accordance
                    with{' '}
                    <a
                      href="https://ustaxcourt.gov/resources/ropp/Rule-27_Amended_03202023.pdf"
                      rel="noreferrer"
                      target="_blank"
                    >
                      Rule 27
                    </a>
                    .
                  </b>
                </label>
              </div>
            </div>
          </div>
        </div>
        <Button
          disabled={!form.redactionAcknowledgement}
          onClick={() => {
            updatedFilePetitionCompleteStep1Sequence();
          }}
        >
          Next
        </Button>
        <Button
          link
          onClick={() =>
            console.log('TODO -> figure out where to go when Cancel')
          }
        >
          Cancel
        </Button>
      </>
    );
  },
);
