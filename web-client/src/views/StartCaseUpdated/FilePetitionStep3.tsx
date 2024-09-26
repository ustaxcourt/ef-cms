import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseTypeSelect } from '@web-client/views/StartCase/CaseTypeSelect';
import { FilePetitionButtons } from '@web-client/views/StartCaseUpdated/FilePetitionButtons';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { IrsNoticeUploadForm } from './IrsNoticeUploadForm';
import { RedactionAcknowledgement } from '@web-client/views/StartCaseUpdated/RedactionAcknowledgement';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { useValidationFocus } from '@web-client/views/UseValidationFocus';
import React from 'react';

export const FilePetitionStep3 = connect(
  {
    addAnotherIrsNoticeToFormSequence:
      sequences.addAnotherIrsNoticeToFormSequence,
    caseTypeDescriptionHelper: state.caseTypeDescriptionHelper,
    deleteValidationErrorMessageSequence:
      sequences.deleteValidationErrorMessageSequence,
    filePetitionHelper: state.filePetitionHelper,
    form: state.form,
    irsNoticeUploadFormInfo: state.irsNoticeUploadFormInfo,
    petitionGenerationLiveValidationSequence:
      sequences.petitionGenerationLiveValidationSequence,
    setHasIrsNoticeSequence: sequences.setHasIrsNoticeSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function FilePetitionStep3({
    addAnotherIrsNoticeToFormSequence,
    caseTypeDescriptionHelper,
    deleteValidationErrorMessageSequence,
    filePetitionHelper,
    form,
    irsNoticeUploadFormInfo,
    petitionGenerationLiveValidationSequence,
    setHasIrsNoticeSequence,
    updateFormValueSequence,
    validationErrors,
  }) {
    const { isPetitioner } = filePetitionHelper;

    const handleIrsNoticeErrors = (errors, refs, elementsToFocus, prefix) => {
      if (!Array.isArray(errors)) {
        return;
      }

      errors.forEach(error => {
        const { index } = error;

        for (const key in error) {
          if (
            key !== 'index' &&
            error[key] &&
            refs.current[`${prefix}${index}.${key}`]
          ) {
            elementsToFocus.push(refs.current[`${prefix}${index}.${key}`]);
          }
        }
      });

      return elementsToFocus;
    };

    const { registerRef, resetFocus } = useValidationFocus(
      validationErrors,
      handleIrsNoticeErrors,
    );

    return (
      <>
        <div className="padding-bottom-0 margin-bottom-1">
          <div>
            <h2 data-testid="has-irs-notice-legend">
              {isPetitioner
                ? 'Did you receive a notice from the IRS?'
                : 'Did the petitioner receive a notice from the IRS?'}
            </h2>
            <FormGroup
              className="irs-notice-form"
              errorText={validationErrors.hasIrsNotice}
            >
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
                      ref={registerRef && registerRef('hasIrsNotice')}
                      type="radio"
                      value={String(option === 'Yes')}
                      onChange={e => {
                        setHasIrsNoticeSequence({
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

            {form.hasIrsNotice && (
              <>
                <WarningNotificationComponent
                  alertWarning={{
                    message:
                      'Ensure that personal information (such as Social Security Numbers, Taxpayer Identification Numbers, Employer Identification Numbers) has been removed or blocked out (redacted) from every form except the Statement of Taxpayer Identification Number.',
                  }}
                  dismissible={false}
                  scrollToTop={false}
                />
                {irsNoticeUploadFormInfo.map((info, index) => {
                  const irsNoticeValidationErrors =
                    (validationErrors.irsNotices as unknown as any[]) || [];

                  const validationError = irsNoticeValidationErrors
                    ? irsNoticeValidationErrors.find(
                        errors => errors.index === index,
                      ) || {}
                    : {};

                  return (
                    <>
                      <IrsNoticeUploadForm
                        caseType={info.caseType}
                        cityAndStateIssuingOffice={
                          info.cityAndStateIssuingOffice
                        }
                        file={info.file}
                        index={index}
                        key={info.key}
                        noticeIssuedDate={info.noticeIssuedDate}
                        refProp={
                          registerRef &&
                          registerRef(
                            `irsNotices.${validationError.index}.caseType`,
                          )
                        }
                        taxYear={info.taxYear}
                        todayDate={info.todayDate}
                        validationError={validationError}
                      />
                    </>
                  );
                })}
                {irsNoticeUploadFormInfo.length < 5 && (
                  <Button
                    link
                    className="add-another-notice-button padding-0 margin-bottom-2"
                    data-testid="add-another-irs-notice-button"
                    icon="plus"
                    onClick={() => addAnotherIrsNoticeToFormSequence()}
                  >
                    Add another IRS Notice
                  </Button>
                )}
                {filePetitionHelper.irsNoticeRequiresRedactionAcknowledgement && (
                  <div className="grid-row grid-gap margin-top-05">
                    <span className="margin-bottom-1 font-sans-pro">
                      <b>
                        Please read and acknowledge before moving to the next
                        step:
                      </b>
                    </span>
                    <div className="tablet:grid-col-12">
                      <RedactionAcknowledgement
                        handleChange={updateFormValueSequence}
                        id="redaction"
                        name="irsNoticesRedactionAcknowledgement"
                        redactionAcknowledgement={
                          form.irsNoticesRedactionAcknowledgement
                        }
                      />
                    </div>
                  </div>
                )}
              </>
            )}
            {form.hasIrsNotice === false && (
              <CaseTypeSelect
                allowDefaultOption={true}
                caseTypes={caseTypeDescriptionHelper.caseTypes}
                className="margin-bottom-0"
                errorMessageId="case-type-root-error-message"
                legend={`Which topic most closely matches ${isPetitioner ? 'your' : 'the petitioner’s'} complaint with the IRS?`}
                value={form.caseType}
                onBlur={() => {
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

        <FilePetitionButtons
          isNextButtonDisabled={
            filePetitionHelper.irsNoticeRequiresRedactionAcknowledgement &&
            !form.irsNoticesRedactionAcknowledgement
          }
          resetFocus={resetFocus}
        />
      </>
    );
  },
);
