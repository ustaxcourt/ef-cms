import { AutoGeneratePetitionForm } from '@web-client/views/StartCaseUpdated/AutoGeneratePetitionForm';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { PETITION_TYPES } from '@web-client/presenter/actions/setupPetitionStateAction';
import { RedactionAcknowledgement } from '@web-client/views/StartCaseUpdated/RedactionAcknowledgement';
import { StateDrivenFileInput } from '@web-client/views/FileDocument/StateDrivenFileInput';
import { UpdatedFilePetitionButtons } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionButtons';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const FilePetitionPetitionInformation = connect(
  {
    constants: state.constants,
    form: state.form,
    setPetitionTypeSequence: sequences.setPetitionTypeSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function FilePetitionPetitionInformation({
    constants,
    form,
    setPetitionTypeSequence,
    updateFormValueSequence,
    validationErrors,
  }) {
    const isNextButtonDisabled =
      form.petitionType === PETITION_TYPES.userUploaded &&
      !form.petitionRedactionAcknowledgement;

    return (
      <>
        <p className="margin-top-0 required-statement">*All fields required</p>
        <h2>How do you want to create the Petition?</h2>
        <div className="usa-radio petition-selection">
          <input
            checked={form.petitionType === PETITION_TYPES.autoGenerated}
            className="usa-radio__input"
            id="generate-a-petition"
            name="petitionType"
            type="radio"
            onChange={e => {
              setPetitionTypeSequence({
                key: e.target.name,
                value: PETITION_TYPES.autoGenerated,
              });
            }}
          />
          <label className="usa-radio__label" htmlFor="generate-a-petition">
            Answer some questions and have DAWSON create the petition.
          </label>
          <input
            checked={form.petitionType === PETITION_TYPES.userUploaded}
            className="usa-radio__input"
            id="upload-a-petition"
            name="petitionType"
            type="radio"
            onChange={e => {
              setPetitionTypeSequence({
                key: e.target.name,
                value: PETITION_TYPES.userUploaded,
              });
            }}
          />
          <label
            className="usa-radio__label"
            data-testid="upload-a-petition-label"
            htmlFor="upload-a-petition"
          >
            Upload a PDF Petition.
          </label>
        </div>
        {form.petitionType === PETITION_TYPES.autoGenerated ? (
          <AutoGeneratePetitionForm />
        ) : (
          <div>
            <WarningNotificationComponent
              alertWarning={{
                message:
                  'Do not include personal information (such as Social Security Numbers, Taxpayer Identification Numbers, Employer Identification Numbers, birthdates, names of minor children, or financial account information) in your Petition or any other filing with the Court except in the Statement of Taxpayer Identification.',
              }}
              dismissible={false}
              scrollToTop={false}
            />
            <div>
              <p className="margin-bottom-0">
                You may download and fill out the Court’s form if you haven’t
                already done so:
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
            </div>
            <FormGroup
              className="margin-top-2"
              errorMessageId="petition-error-message"
              errorText={[
                validationErrors.petitionFile,
                validationErrors.petitionFileSize,
              ]}
            >
              <label
                className={classNames(
                  'usa-label ustc-upload-stin with-hint',
                  form.petitionFile && 'validated',
                )}
                data-testid="petition-file-label"
                htmlFor="petition-file"
                id="petition-file-label"
              >
                Upload the Petition PDF (.pdf)
              </label>
              <span className="usa-hint">
                Make sure file is not encrypted or password protected. Max file
                size {constants.MAX_FILE_SIZE_MB}MB.
              </span>
              <StateDrivenFileInput
                aria-describedby="petition-file-label"
                data-testid="petition-file"
                id="petition-file"
                name="petitionFile"
                updateFormValueSequence="updateFormValueSequence"
                validationSequence="validateUpdatedFilePetitionStep1Sequence"
              />
            </FormGroup>
            <div className="grid-row grid-gap">
              <span className="margin-bottom-1 font-sans-pro">
                <b>
                  Please read and acknowledge before moving to the next step:
                </b>
              </span>
              <div className="tablet:grid-col-12">
                <RedactionAcknowledgement
                  handleChange={updateFormValueSequence}
                  id="petition-redaction"
                  name="petitionRedactionAcknowledgement"
                  redactionAcknowledgement={
                    form.petitionRedactionAcknowledgement
                  }
                />
              </div>
            </div>
          </div>
        )}
        <UpdatedFilePetitionButtons
          isNextButtonDisabled={isNextButtonDisabled}
        />
      </>
    );
  },
);
