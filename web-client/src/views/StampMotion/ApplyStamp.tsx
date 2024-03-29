import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { CharactersRemainingHint } from '../../ustc-ui/CharactersRemainingHint/CharactersRemainingHint';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';

export const ApplyStamp = connect(
  {
    applyStampFormChangeSequence: sequences.applyStampFormChangeSequence,
    applyStampFormHelper: state.applyStampFormHelper,
    clearDueDateSequence: sequences.clearDueDateSequence,
    clearOptionalFieldsStampFormSequence:
      sequences.clearOptionalFieldsStampFormSequence,
    constants: state.constants,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    pdfForSigning: state.pdfForSigning,
    pdfObj: state.pdfForSigning.pdfjsObj,
    pdfSignerHelper: state.pdfSignerHelper,
    setPDFStampDataSequence: sequences.setPDFStampDataSequence,
    submitStampMotionSequence: sequences.submitStampMotionSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateStampSequence: sequences.validateStampSequence,
    validationErrors: state.validationErrors,
  },
  function ApplyStamp({
    applyStampFormChangeSequence,
    applyStampFormHelper,
    clearDueDateSequence,
    clearOptionalFieldsStampFormSequence,
    constants,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    navigateBackSequence,
    pdfForSigning,
    pdfObj,
    setPDFStampDataSequence,
    submitStampMotionSequence,
    updateFormValueSequence,
    validateStampSequence,
    validationErrors,
  }) {
    const canvasRef = useRef(null);
    const signatureRef = useRef(null);

    const renderPDFPage = () => {
      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext('2d');

      pdfObj
        .getPage(1)
        .then(page => {
          const scale = 1;
          const viewport = page.getViewport({ scale });
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext,
            viewport,
          };
          return page.render(renderContext);
        })
        .catch(() => {
          /* no-op*/
        });
    };

    const start = () => {
      const sigEl = signatureRef.current;

      setPDFStampDataSequence({
        stampApplied: true,
      });

      sigEl.style.top = '500px';
      sigEl.style.left = '148px';
    };

    let hasStarted = false;
    useEffect(() => {
      renderPDFPage();
      if (!hasStarted) {
        start();
        hasStarted = true;
      }
    }, []);

    return (
      <>
        <CaseDetailHeader />
        <div className="grid-container">
          <ErrorNotification />
          <div className="grid-row grid-gap">
            <h1 className="heading-1" id="page-title">
              Apply Stamp
            </h1>
          </div>
          <div className="grid-row grid-gap">
            <div className="grid-col-5">
              <Button
                link
                icon={['fa', 'arrow-alt-circle-left']}
                onClick={() => navigateBackSequence()}
              >
                Back
              </Button>

              <div className="border border-base-lighter">
                <div className="grid-header grid-row padding-left-205">
                  Stamp Order
                </div>
                <div className="stamp-order-form">
                  <FormGroup
                    className={applyStampFormHelper.dispositionErrorClass}
                    errorText={validationErrors.disposition}
                  >
                    {[
                      constants.MOTION_DISPOSITIONS.GRANTED,
                      constants.MOTION_DISPOSITIONS.DENIED,
                    ].map(option => (
                      <div
                        className={`usa-radio ${
                          option === constants.MOTION_DISPOSITIONS.DENIED
                            ? 'margin-bottom-0'
                            : ''
                        }`}
                        key={option}
                      >
                        <input
                          aria-label={`disposition-${option}`}
                          checked={form.disposition === option}
                          className="usa-radio__input"
                          id={`motion-disposition-${option}`}
                          name="disposition"
                          type="radio"
                          value={option}
                          onChange={e => {
                            applyStampFormChangeSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                        />
                        <label
                          className="usa-radio__label"
                          data-testid={`motion-disposition-${option}`}
                          htmlFor={`motion-disposition-${option}`}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                    <FormGroup className="grid-container stamp-form-group denied-checkboxes">
                      <div className="display-inline-block grid-col-6">
                        <input
                          checked={form.deniedAsMoot || false}
                          className="usa-checkbox__input"
                          disabled={
                            form.disposition !==
                            constants.MOTION_DISPOSITIONS.DENIED
                          }
                          id="deniedAsMoot"
                          name="deniedAsMoot"
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
                          htmlFor="deniedAsMoot"
                          id="denied-as-moot-label"
                        >
                          As moot
                        </label>
                      </div>
                      <div className="display-inline-block grid-col-auto">
                        <input
                          checked={form.deniedWithoutPrejudice || false}
                          className="usa-checkbox__input"
                          disabled={
                            form.disposition !==
                            constants.MOTION_DISPOSITIONS.DENIED
                          }
                          id="deniedWithoutPrejudice"
                          name="deniedWithoutPrejudice"
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
                          htmlFor="deniedWithoutPrejudice"
                          id="denied-without-prejudice-label"
                        >
                          Without prejudice
                        </label>
                      </div>
                    </FormGroup>
                  </FormGroup>
                  <hr className="border-top-2px border-base-lighter" />

                  <FormGroup className="stamp-form-group">
                    <label
                      className="usa-label"
                      htmlFor="stricken-from-trial-session-radio"
                    >
                      Select any that apply{' '}
                      <span className="usa-hint">(optional)</span>
                    </label>
                    <div className="usa-radio usa-radio__inline">
                      <input
                        aria-label="stricken from trial session"
                        checked={form.strickenFromTrialSession || false}
                        className="usa-radio__input"
                        id="stricken-from-trial-session"
                        name="strickenFromTrialSession"
                        type="radio"
                        value={constants.STRICKEN_FROM_TRIAL_SESSION_MESSAGE}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor={'stricken-from-trial-session'}
                      >
                        {constants.STRICKEN_FROM_TRIAL_SESSION_MESSAGE}
                      </label>
                    </div>
                  </FormGroup>
                  <hr className="narrow-hr" />
                  <FormGroup className="stamp-form-group">
                    {Object.entries(constants.JURISDICTIONAL_OPTIONS).map(
                      ([key, value]) => (
                        <div className="usa-radio" key={key}>
                          <input
                            aria-describedby="jurisdictionalOption"
                            aria-label={`jurisdictionalOption-${key}`}
                            checked={form.jurisdictionalOption === value}
                            className="usa-radio__input"
                            id={`jurisdictionalOption-${key}`}
                            name="jurisdictionalOption"
                            type="radio"
                            value={value}
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                            }}
                          />
                          <label
                            aria-label={value}
                            className="usa-radio__label"
                            htmlFor={`jurisdictionalOption-${key}`}
                            id={`jurisdictionalOption-${key}-label`}
                          >
                            {value}
                          </label>
                        </div>
                      ),
                    )}
                  </FormGroup>
                  <hr className="narrow-hr" />
                  <FormGroup
                    className={applyStampFormHelper.dateErrorClass}
                    errorText={validationErrors.date}
                  >
                    <div className="usa-radio" key="statusReportDueDate">
                      <input
                        aria-describedby="dueDateMessage"
                        aria-label="status report due date"
                        checked={
                          form.dueDateMessage ===
                          'The parties shall file a status report by'
                        }
                        className="usa-radio__input"
                        id="dueDateMessage-statusReportDueDate"
                        name="dueDateMessage"
                        type="radio"
                        value="The parties shall file a status report by"
                        onChange={e => {
                          clearDueDateSequence();
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor="dueDateMessage-statusReportDueDate"
                        id="dueDateMessage-statusReportDueDate-label"
                      >
                        The parties shall file a status report by:
                      </label>
                    </div>
                    <div
                      className="usa-radio"
                      key="statusReportOrStipDecisionDueDate"
                    >
                      <input
                        aria-label="status report stip decision due date"
                        checked={
                          form.dueDateMessage ===
                          'The parties shall file a status report or proposed stipulated decision by'
                        }
                        className="usa-radio__input"
                        id="dueDateMessage-statusReportOrStipDecisionDueDate"
                        name="dueDateMessage"
                        type="radio"
                        value="The parties shall file a status report or proposed stipulated decision by"
                        onChange={e => {
                          clearDueDateSequence();
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        data-testid="status-report-or-stip-decision-due-date"
                        htmlFor="dueDateMessage-statusReportOrStipDecisionDueDate"
                      >
                        The parties shall file a status report or proposed
                        stipulated decision by:
                      </label>
                    </div>

                    <DateSelector
                      defaultValue={form.date}
                      disabled={!form.dueDateMessage}
                      formGroupClassNames="display-inline-block padding-0 margin-left-5"
                      id="due-date-input-statusReportDueDate"
                      minDate={applyStampFormHelper.minDate}
                      placeHolderText="MM/DD/YYYY"
                      onChange={e => {
                        formatAndUpdateDateFromDatePickerSequence({
                          key: 'date',
                          toFormat: constants.DATE_FORMATS.MMDDYY,
                          value: e.target.value,
                        });
                        validateStampSequence();
                      }}
                    />
                  </FormGroup>
                  <hr className="narrow-hr" />
                  <FormGroup
                    className="stamp-form-group"
                    errorText={validationErrors.customText}
                  >
                    <div>
                      <label
                        className="usa-label"
                        htmlFor="custom-text"
                        id="custom-text-label"
                      >
                        Custom order text{' '}
                        <span className="usa-hint">(optional)</span>
                      </label>
                      <textarea
                        aria-describedby="custom-text-label"
                        aria-label="custom text"
                        autoCapitalize="none"
                        className="usa-textarea maxw-none height-8 usa-character-count__field"
                        id="custom-text"
                        maxLength={constants.MAX_STAMP_CUSTOM_TEXT_CHARACTERS}
                        name="customText"
                        type="text"
                        value={form.customText}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      ></textarea>
                      <CharactersRemainingHint
                        maxCharacters={
                          constants.MAX_STAMP_CUSTOM_TEXT_CHARACTERS
                        }
                        stringToCount={form.customText}
                      />
                    </div>
                  </FormGroup>
                  <Button
                    link
                    className="margin-left-205"
                    data-testid="clear-optional-fields"
                    onClick={e => {
                      e.preventDefault();
                      clearOptionalFieldsStampFormSequence();
                    }}
                  >
                    Clear Optional Fields
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid-col-7">
              <div className="margin-bottom-1 display-flex flex-justify-end">
                <Button
                  className="margin-right-0"
                  data-testid="save-signature-button"
                  disabled={!applyStampFormHelper.canSaveStampOrder}
                  id="save-signature-button"
                  onClick={() => submitStampMotionSequence()}
                >
                  Save Stamp Order
                </Button>
              </div>
              <div className="grid-row">
                <div className="grid-col-12">
                  <div className="sign-pdf-interface">
                    <span id="stamp" ref={signatureRef}>
                      <span className="text-normal" id="stamp-text">
                        It is ORDERED as follows:
                        <br />
                        <span className="font-sans-2xs">
                          This motion is{' '}
                          <span className="text-ls-1 text-bold font-sans-lg">
                            {form.disposition?.toUpperCase()}
                          </span>{' '}
                          {form.deniedAsMoot && 'as moot '}
                          {form.deniedWithoutPrejudice && 'without prejudice'}
                          <br />
                        </span>
                        {(form.strickenFromTrialSession ||
                          form.jurisdictionalOption ||
                          (form.dueDateMessage && form.date) ||
                          form.customText) && <hr className="narrow-hr" />}
                        {form.strickenFromTrialSession && (
                          <>
                            - {constants.STRICKEN_FROM_TRIAL_SESSION_MESSAGE} -
                            <br />
                          </>
                        )}
                        {form.jurisdictionalOption && (
                          <>
                            - {form.jurisdictionalOption} -<br />
                          </>
                        )}
                        <span>
                          {form.date && (
                            <>
                              - {form.dueDateMessage} {form.date} -
                              <br />
                            </>
                          )}
                          {form.customText && <>- {form.customText} -</>}
                        </span>
                      </span>
                      <hr className="narrow-hr" />
                      <span id="stamp-signature">
                        (Signed) {pdfForSigning.nameForSigning}
                        <br />
                        {pdfForSigning.nameForSigningLine2}
                      </span>
                    </span>
                    <canvas id="sign-pdf-canvas" ref={canvasRef}></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);

ApplyStamp.displayName = 'ApplyStamp';
