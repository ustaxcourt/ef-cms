import { Button } from '../../ustc-ui/Button/Button';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const StartCaseStep1 = connect(
  {
    completeStartCaseWizardStepSequence:
      sequences.completeStartCaseWizardStepSequence,
    constants: state.constants,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    startCaseHelper: state.startCaseHelper,
    validationErrors: state.validationErrors,
  },
  function StartCaseStep1({
    completeStartCaseWizardStepSequence,
    constants,
    formCancelToggleCancelSequence,
    navigateBackSequence,
    startCaseHelper,
    validationErrors,
  }) {
    return (
      <>
        <Focus>
          <h2
            className="focusable margin-bottom-2"
            id="start-case-header"
            tabIndex={-1}
          >
            1. Statement of Taxpayer Identification Number (STIN)
          </h2>
        </Focus>
        <Hint>
          The Statement of Taxpayer Identification is the only document that
          should include personal information (such as Social Security Numbers,
          Taxpayer Identification Numbers, or Employer Identification Numbers).
          It’s sent to the IRS to help identify you but is never visible as part
          of the case record.
        </Hint>

        <div className="blue-container margin-bottom-5">
          <FormGroup
            errorText={[
              validationErrors.stinFile,
              validationErrors.stinFileSize,
            ]}
          >
            <label
              className={classNames(
                'usa-label ustc-upload-stin with-hint',
                startCaseHelper.showStinFileValid && 'validated',
              )}
              data-testid="stin-file-label"
              htmlFor="stin-file"
              id="stin-file-label"
            >
              Upload your Statement of Taxpayer Identification Number PDF (.pdf)
            </label>
            <span className="usa-hint">
              Make sure file is not encrypted or password protected. Max file
              size {constants.MAX_FILE_SIZE_MB}MB.
            </span>
            <div className="margin-top-0">
              <Button
                link
                className="usa-link--external text-left mobile-text-wrap"
                href="https://www.ustaxcourt.gov/resources/forms/Form_4_Statement_of_Taxpayer_Identification_Number.pdf"
                icon="file-pdf"
                iconColor="blue"
                overrideMargin="margin-right-1"
                rel="noopener noreferrer"
                target="_blank"
              >
                Download Statement of Taxpayer Identification Number (T.C. Form
                4)
              </Button>
              <p className="margin-top-05 usa-hint display-block">
                if you haven’t already done so
              </p>
            </div>
            <StateDrivenFileInput
              aria-describedby="stin-file-label"
              data-testid="stin-file"
              id="stin-file"
              name="stinFile"
              updateFormValueSequence="updateStartCaseFormValueSequence"
              validationSequence="validateStartCaseWizardSequence"
            />
          </FormGroup>
        </div>

        <Button
          data-testid="complete-step-1"
          id="submit-case"
          onClick={() => {
            completeStartCaseWizardStepSequence({ nextStep: 2 });
          }}
        >
          Continue to Step 2 of 5
        </Button>
        <Button secondary onClick={() => navigateBackSequence()}>
          Back
        </Button>
        <Button
          link
          onClick={() => {
            formCancelToggleCancelSequence();
          }}
        >
          Cancel
        </Button>
      </>
    );
  },
);

StartCaseStep1.displayName = 'StartCaseStep1';
