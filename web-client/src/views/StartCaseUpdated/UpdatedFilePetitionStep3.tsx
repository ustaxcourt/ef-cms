import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseTypeSelect } from '@web-client/views/StartCase/CaseTypeSelect';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import { IrsNoticeUploadForm } from './IrsNoticeUploadForm';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const UpdatedFilePetitionStep3 = connect(
  {
    addAnotherIrsNoticeToFormSequence:
      sequences.addAnotherIrsNoticeToFormSequence,
    caseTypeDescriptionHelper: state.caseTypeDescriptionHelper,
    deleteValidationErrorMessageSequence:
      sequences.deleteValidationErrorMessageSequence,
    form: state.form,
    irsNoticeUploadFormInfo: state.irsNoticeUploadFormInfo,
    petitionGenerationLiveValidationSequence:
      sequences.petitionGenerationLiveValidationSequence,
    startCaseHelper: state.startCaseHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updatedFilePetitionCompleteStep3Sequence:
      sequences.updatedFilePetitionCompleteStep3Sequence,
    updatedFilePetitionGoBackAStepSequence:
      sequences.updatedFilePetitionGoBackAStepSequence,
    validationErrors: state.validationErrors,
  },
  function UpdatedFilePetitionStep3({
    addAnotherIrsNoticeToFormSequence,
    caseTypeDescriptionHelper,
    deleteValidationErrorMessageSequence,
    form,
    irsNoticeUploadFormInfo,
    petitionGenerationLiveValidationSequence,
    startCaseHelper,
    updatedFilePetitionCompleteStep3Sequence,
    updatedFilePetitionGoBackAStepSequence,
    updateFormValueSequence,
    validationErrors,
  }) {
    return (
      <>
        <ErrorNotification />
        <div className="padding-bottom-0 margin-bottom-1">
          <div>
            <h2>{startCaseHelper.noticeLegend}</h2>
            <FormGroup errorText={validationErrors.hasIrsNotice}>
              <fieldset
                className="usa-fieldset margin-bottom-0"
                id="irs-notice-radios"
              >
                {['Yes', 'No'].map((option, idx) => (
                  <div className="usa-radio usa-radio__inline" key={option}>
                    <input
                      aria-describedby="notice-legend"
                      checked={form.hasIrsNotice === (option === 'Yes')}
                      className="usa-radio__input"
                      id={`hasIrsNotice-${option}`}
                      name="hasIrsNotice"
                      type="radio"
                      value={option === 'Yes'}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value === 'true',
                        });

                        deleteValidationErrorMessageSequence({
                          validationKey: ['hasIrsNotice'],
                        });
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      data-testid={`irs-notice-${option}`}
                      htmlFor={`hasIrsNotice-${option}`}
                      id={`hasIrsNotice-${idx}`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </fieldset>
            </FormGroup>

            {startCaseHelper.showHasIrsNoticeOptions && (
              <>
                <WarningNotificationComponent
                  alertWarning={{
                    message:
                      'Ensure that personal information (such as Social Security Numbers, Taxpayer Identification Numbers, Employer Identification Numbers) has been removed or blocked out (redacted) for every form except the Statement of Taxpayer Identification.',
                  }}
                  dismissible={false}
                  scrollToTop={false}
                />
                {irsNoticeUploadFormInfo.map((info, index) => {
                  const irsNotices =
                    (validationErrors.irsNotices as unknown as any[]) || [];

                  const validationError = irsNotices
                    ? irsNotices.find(errors => errors.index === index) || {}
                    : {};

                  return (
                    <>
                      <IrsNoticeUploadForm
                        caseType={info.caseType}
                        file={info.file}
                        index={index}
                        key={info.key}
                        noticeIssuedDate={info.noticeIssuedDate}
                        taxYear={info.taxYear}
                        todayDate={info.todayDate}
                        validationError={validationError}
                      />
                    </>
                  );
                })}
                <Button
                  link
                  className={classNames('padding-top-0', 'text-left')}
                  onClick={() => addAnotherIrsNoticeToFormSequence()}
                >
                  <Icon
                    className="fa-icon-blue"
                    icon={['fas', 'plus']}
                    size="1x"
                  />
                  Add another IRS Notice
                </Button>
                <div className="grid-row grid-gap margin-top-5">
                  <span className="margin-bottom-1 font-sans-pro">
                    <b>
                      Please read and acknowledge before moving to the next
                      step:
                    </b>
                  </span>
                  <div className="tablet:grid-col-12">
                    <div className="card" style={{ maxWidth: 'fit-content' }}>
                      <div className="content-wrapper usa-checkbox">
                        <input
                          aria-describedby="redaction-acknowledgement-label"
                          checked={
                            form.irsNoticesRedactionAcknowledgement || false
                          }
                          className="usa-checkbox__input"
                          id="irs-notices-acknowledgement"
                          name="irsNoticesRedactionAcknowledgement"
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
                          htmlFor="irs-notices-acknowledgement"
                          id="irs-notices-acknowledgement-label"
                          style={{ marginTop: '0px' }}
                        >
                          <div className="font-weight-600">
                            All documents I am filing have been redacted in
                            accordance with{' '}
                            <a
                              href="https://ustaxcourt.gov/resources/ropp/Rule-27_Amended_03202023.pdf"
                              rel="noreferrer"
                              target="_blank"
                            >
                              Rule 27
                            </a>
                            .
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {startCaseHelper.showNotHasIrsNoticeOptions && (
              <CaseTypeSelect
                allowDefaultOption={true}
                caseTypes={caseTypeDescriptionHelper.caseTypes}
                className="margin-bottom-0"
                legend="Which topic most closely matches your complaint with the
                IRS?"
                value={form.caseType}
                onBlurSequence={() => {
                  petitionGenerationLiveValidationSequence({
                    validationKey: ['caseType'],
                  });
                }}
                onChange={info => {
                  updateFormValueSequence(info);
                  deleteValidationErrorMessageSequence({
                    validationKey: ['caseType'],
                  });
                }}
              />
            )}
          </div>
        </div>

        <Button
          disabled={
            form.hasIrsNotice && !form.irsNoticesRedactionAcknowledgement
          }
          onClick={() => {
            updatedFilePetitionCompleteStep3Sequence();
          }}
        >
          Next
        </Button>
        <Button
          secondary
          onClick={() => {
            updatedFilePetitionGoBackAStepSequence();
          }}
        >
          Back
        </Button>
        <Button link onClick={() => console.log('Cancel')}>
          Cancel
        </Button>
      </>
    );
  },
);
