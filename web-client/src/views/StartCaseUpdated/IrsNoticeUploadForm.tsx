import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseTypeSelect } from '@web-client/views/StartCase/CaseTypeSelect';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { StateDrivenFileInput } from '@web-client/views/FileDocument/StateDrivenFileInput';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const IrsNoticeUploadForm = connect(
  {
    DATE_FORMATS: state.constants.DATE_FORMATS,
    attachmentToPetitionFile: props.attachmentToPetitionFile,
    caseType: props.caseType,
    caseTypeDescriptionHelper: state.caseTypeDescriptionHelper,
    constants: state.constants,
    file: props.file,
    index: props.index,
    noticeIssuedDate: props.noticeIssuedDate,
    petitionGenerationLiveValidationSequence:
      sequences.petitionGenerationLiveValidationSequence,
    removeIrsNoticeFromFormSequence: sequences.removeIrsNoticeFromFormSequence,
    taxYear: props.taxYear,
    todayDate: props.todayDate,
    updateIrsNoticeIndexPropertySequence:
      sequences.updateIrsNoticeIndexPropertySequence,
    validationError: props.validationError,
  },
  function IrsNoticeUploadForm({
    attachmentToPetitionFile,
    caseType,
    caseTypeDescriptionHelper,
    constants,
    DATE_FORMATS,
    file,
    index,
    noticeIssuedDate,
    petitionGenerationLiveValidationSequence,
    removeIrsNoticeFromFormSequence,
    taxYear,
    todayDate,
    updateIrsNoticeIndexPropertySequence,
    validationError,
  }) {
    return (
      <>
        {index !== 0 && <LineBreak />}
        <div className={classNames('usa-form-group', 'margin-bottom-0')}>
          <FormGroup errorText={[validationError.file, validationError.size]}>
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
              updateFormValueSequence="updateIrsNoticeIndexPropertySequence"
            />
          </FormGroup>
          <div>
            <h2 style={{ alignItems: 'center', display: 'flex' }}>
              <div>IRS Notice {index + 1}</div>
              {index !== 0 && (
                <Button
                  link
                  className="margin-left-10"
                  onClick={() => removeIrsNoticeFromFormSequence({ index })}
                >
                  <Icon
                    className="fa-icon-blue"
                    icon={['fas', 'times']}
                    size="1x"
                  />
                  <span style={{ marginLeft: '-5px' }}>Remove</span>
                </Button>
              )}
            </h2>
          </div>
          <CaseTypeSelect
            allowDefaultOption={true}
            caseTypes={caseTypeDescriptionHelper.caseTypes}
            hint="(required)"
            legend="Type of notice/case"
            name={index.toString()}
            validationError={validationError}
            value={caseType}
            onBlurSequence={() => {
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
              delete validationError.caseType;
            }}
          />
          <Mobile>
            <FormGroup errorText={validationError.taxYear}>
              <label className="usa-label" htmlFor="noticeIssuesTaxYear">
                Tax year or period for which the notice was issued
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
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
                  delete validationError.taxYear;
                }}
              />
            </FormGroup>{' '}
            <div>
              <DateSelector
                defaultValue={noticeIssuedDate}
                errorText={validationError.noticeIssuedDate}
                id="notice-issued-date"
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
                    toFormat: DATE_FORMATS.ISO,
                    value: e.target.value,
                  });

                  validationError.noticeIssuedDate = '';
                }}
              />
            </div>
          </Mobile>
          <NonMobile>
            <div className="grid-row grid-gap">
              <FormGroup
                className="grid-col-8"
                errorText={validationError.taxYear}
              >
                <label className="usa-label" htmlFor="noticeIssuesTaxYear">
                  Tax year or period for which the notice was issued
                </label>
                <input
                  autoCapitalize="none"
                  className="usa-input"
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
                    delete validationError.taxYear;
                  }}
                />
              </FormGroup>{' '}
              <div className="grid-col-4">
                <DateSelector
                  defaultValue={noticeIssuedDate}
                  errorText={validationError.noticeIssuedDate}
                  id="notice-issued-date"
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
                      toFormat: DATE_FORMATS.ISO,
                      value: e.target.value,
                    });

                    delete validationError.noticeIssuedDate;
                  }}
                />
              </div>
            </div>
          </NonMobile>
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
