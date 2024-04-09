import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseTypeSelect } from '@web-client/views/StartCase/CaseTypeSelect';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { StateDrivenFileInput } from '@web-client/views/FileDocument/StateDrivenFileInput';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const IrsNoticeUploadForm = connect(
  {
    attachmentToPetitionFile: props.attachmentToPetitionFile,
    caseType: props.caseType,
    caseTypeDescriptionHelper: state.caseTypeDescriptionHelper,
    constants: state.constants,
    file: props.file,
    index: props.index,
    removeIrsNoticeFromFormSequence: sequences.removeIrsNoticeFromFormSequence,
    validationErrors: state.validationErrors,
  },
  function IrsNoticeUploadForm({
    attachmentToPetitionFile,
    caseType,
    caseTypeDescriptionHelper,
    constants,
    file,
    index,
    removeIrsNoticeFromFormSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="usa-form-group">
          <FormGroup
            errorText={[
              validationErrors.attachmentToPetitionFile,
              validationErrors.attachmentToPetitionFileSize,
            ]}
          >
            <label
              className={classNames(
                'usa-label ustc-upload-atp with-hint',
                attachmentToPetitionFile && 'validated',
              )}
              data-testid="atp-file-upload-label"
              htmlFor="atp-file-upload"
              id="atp-file-upload-label"
            >
              Choose a PDF (.pdf) of the IRS Notice(s) to upload if you have it.
            </label>
            <span className="usa-hint" id="atp-files-upload-hint">
              Make sure file is not encrypted or password protected. Max file
              size {constants.MAX_FILE_SIZE_MB}MB.
            </span>
            <StateDrivenFileInput
              aria-describedby={`irs-notice-upload-${index}-label`}
              data-testid={`irs-notice-upload-${index}`}
              file={file}
              id={`irs-notice-upload-${index}`}
              ignoreSizeKey={true}
              name={index}
              updateFormValueSequence="updateIrsNoticeUploadedFileSequence"
              validationSequence="validateStartCaseWizardSequence"
            />
          </FormGroup>

          <h2>
            IRS Notice {index + 1}{' '}
            {index !== 0 && (
              <Button
                link
                onClick={() => removeIrsNoticeFromFormSequence({ index })}
              >
                Remove
              </Button>
            )}
          </h2>
          <CaseTypeSelect
            allowDefaultOption={true}
            caseTypes={caseTypeDescriptionHelper.caseTypes}
            hint="(required)"
            legend="Type of notice/case"
            name={index.toString()}
            validation="validateStartCaseWizardSequence"
            value={caseType}
            onChange="updateIrsNoticeCaseTypeSequence"
          />
        </div>
      </>
    );
  },
);
