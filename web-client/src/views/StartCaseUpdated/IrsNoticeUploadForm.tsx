import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseTypeSelect } from '@web-client/views/StartCase/CaseTypeSelect';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import { StateDrivenFileInput } from '@web-client/views/FileDocument/StateDrivenFileInput';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

type IrsNoticeUpload = {
  attachmentToPetitionFile?: File;
  index: number;
  noticeIssuedDate?: string;
  taxYear?: string;
  todayDate: string;
  validationError: {
    file?: string;
    size?: string;
    noticeIssuedDate?: string;
    taxYear?: string;
    cityAndStateIssuingOffice?: string;
  };
  caseType?: string;
  file?: File;
  cityAndStateIssuingOffice?: string;
  refProp: (element: any) => void;
};

const irsNoticeUploadDependencies = {
  caseTypeDescriptionHelper: state.caseTypeDescriptionHelper,
  constants: state.constants,
  deleteValidationErrorMessageSequence:
    sequences.deleteValidationErrorMessageSequence,
  petitionGenerationLiveValidationSequence:
    sequences.petitionGenerationLiveValidationSequence,
  removeIrsNoticeFromFormSequence: sequences.removeIrsNoticeFromFormSequence,
  updateIrsNoticeIndexPropertySequence:
    sequences.updateIrsNoticeIndexPropertySequence,
};

export const IrsNoticeUploadForm = connect<
  IrsNoticeUpload,
  typeof irsNoticeUploadDependencies
>(
  irsNoticeUploadDependencies,
  function IrsNoticeUploadForm({
    attachmentToPetitionFile,
    caseType,
    caseTypeDescriptionHelper,
    cityAndStateIssuingOffice,
    constants,
    deleteValidationErrorMessageSequence,
    file,
    index,
    noticeIssuedDate,
    petitionGenerationLiveValidationSequence,
    refProp,
    removeIrsNoticeFromFormSequence,
    taxYear,
    todayDate,
    updateIrsNoticeIndexPropertySequence,
    validationError,
  }) {
    return (
      <>
        {index !== 0 && <LineBreak />}
        <div className="usa-form-group margin-bottom-0 irs-notice-form">
          <FormGroup errorText={[validationError.file, validationError.size]}>
            <label
              className={classNames(
                'usa-label ustc-upload-atp with-hint',
                attachmentToPetitionFile && 'validated',
              )}
              data-testid={`irs-notice-upload-${index}-label`}
              htmlFor={`irs-notice-upload-${index}`}
              id="irs-notice-upload-label"
            >
              Choose a PDF (.pdf) of the IRS Notice(s) to upload if you have it.
            </label>
            <span className="usa-hint" id="atp-files-upload-hint">
              Make sure file is not encrypted or password protected. Max file
              size {constants.MAX_FILE_SIZE_MB}MB. You may upload up to five PDF
              files.
            </span>
            <StateDrivenFileInput
              aria-describedby={`irs-notice-upload-${index}-label`}
              data-testid={`irs-notice-upload-${index}`}
              file={file}
              id={`irs-notice-upload-${index}`}
              ignoreSizeKey={true}
              name={index}
              updateFormValueSequence="updateIrsNoticeIndexPropertySequence"
            />
          </FormGroup>
          <div>
            <h2 style={{ alignItems: 'center', display: 'flex' }}>
              <div>IRS Notice {index + 1}</div>
              {index !== 0 && (
                <Button
                  link
                  className="margin-left-1 irs-notice-remove-button"
                  onClick={() => removeIrsNoticeFromFormSequence({ index })}
                >
                  <Icon
                    className="fa-icon-blue"
                    icon={['fas', 'times']}
                    size="1x"
                  />
                  <span className="margin-left-neg-05">Remove</span>
                </Button>
              )}
            </h2>
          </div>
          <div className="grid-row">
            <div className="mobile:grid-col-12 desktop:grid-col-8">
              <CaseTypeSelect
                allowDefaultOption={true}
                caseTypes={caseTypeDescriptionHelper.caseTypes}
                errorMessageId={`case-type-${index}-error-message`}
                hint="(required)"
                legend="Type of notice/case"
                name={index.toString()}
                refProp={refProp}
                validationError={validationError}
                value={caseType}
                onBlur={() => {
                  petitionGenerationLiveValidationSequence({
                    validationKey: [
                      'irsNotices',
                      { property: 'index', value: index },
                      'caseType',
                    ],
                  });
                }}
                onChange={info => {
                  updateIrsNoticeIndexPropertySequence(info);
                  deleteValidationErrorMessageSequence({
                    validationKey: [
                      'irsNotices',
                      { property: 'index', value: index },
                      'caseType',
                    ],
                  });
                }}
              />
            </div>
            <div className="mobile:grid-col-12 desktop:grid-col-4">
              <DateSelector
                defaultValue={noticeIssuedDate}
                errorText={validationError.noticeIssuedDate}
                id={`notice-issued-date-${index}`}
                label="Date IRS issued the notice"
                maxDate={todayDate}
                onBlur={() => {
                  petitionGenerationLiveValidationSequence({
                    validationKey: [
                      'irsNotices',
                      { property: 'index', value: index },
                      'noticeIssuedDate',
                    ],
                  });
                }}
                onChange={e => {
                  updateIrsNoticeIndexPropertySequence({
                    key: index.toString(),
                    property: 'noticeIssuedDate',
                    toFormat: constants.DATE_FORMATS.ISO,
                    value: e.target.value,
                  });

                  deleteValidationErrorMessageSequence({
                    validationKey: [
                      'irsNotices',
                      { property: 'index', value: index },
                      'noticeIssuedDate',
                    ],
                  });
                }}
              />
            </div>
          </div>
          <div className="grid-row grid-gap">
            <FormGroup
              className="mobile:grid-col-12 desktop:grid-col-6"
              errorText={validationError.taxYear}
            >
              <label className="usa-label" htmlFor="noticeIssuesTaxYear">
                Tax year or period for which the notice was issued
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                data-testid={`irs-notice-tax-year-${index}`}
                id="noticeIssuesTaxYear"
                name="taxYear"
                type="text"
                value={taxYear}
                onBlur={() => {
                  petitionGenerationLiveValidationSequence({
                    validationKey: [
                      'irsNotices',
                      { property: 'index', value: index },
                      'taxYear',
                    ],
                  });
                }}
                onChange={e => {
                  updateIrsNoticeIndexPropertySequence({
                    key: index.toString(),
                    property: 'taxYear',
                    value: e.target.value,
                  });

                  deleteValidationErrorMessageSequence({
                    validationKey: [
                      'irsNotices',
                      { property: 'index', value: index },
                      'taxYear',
                    ],
                  });
                }}
              />
            </FormGroup>
            <FormGroup
              className="mobile:grid-col-12 desktop:grid-col-6"
              errorText={validationError.cityAndStateIssuingOffice}
            >
              <label className="usa-label" htmlFor="cityAndStateIssuingOffice">
                City and state of issuing office
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                data-testid={`city-and-state-issuing-office-${index}`}
                id="cityAndStateIssuingOffice"
                name="cityAndStateIssuingOffice"
                type="text"
                value={cityAndStateIssuingOffice}
                onBlur={() => {
                  petitionGenerationLiveValidationSequence({
                    validationKey: [
                      'irsNotices',
                      { property: 'index', value: index },
                      'cityAndStateIssuingOffice',
                    ],
                  });
                }}
                onChange={e => {
                  updateIrsNoticeIndexPropertySequence({
                    key: index.toString(),
                    property: 'cityAndStateIssuingOffice',
                    value: e.target.value,
                  });

                  deleteValidationErrorMessageSequence({
                    validationKey: [
                      'irsNotices',
                      { property: 'index', value: index },
                      'cityAndStateIssuingOffice',
                    ],
                  });
                }}
              />
            </FormGroup>
          </div>
        </div>
      </>
    );
  },
);

function LineBreak() {
  return (
    <div style={{ borderTop: '1px solid #D9D9D9', marginBottom: '35px' }}></div>
  );
}
