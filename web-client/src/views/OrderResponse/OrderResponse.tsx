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

export const OrderResponse = connect(
  {
    applyStampFormChangeSequence: sequences.applyStampFormChangeSequence,
    motionOrderResponseFormHelper: state.motionOrderResponseFormHelper,
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
  function OrderResponse({
    motionOrderResponseFormHelper,
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
              Order Response to Motion
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
                  Order Response
                </div>
                <div className="motion-order-response-form">
                  <FormGroup
                    className={
                      motionOrderResponseFormHelper.dispositionErrorClass
                    }
                    errorText={validationErrors.disposition}
                  >
                    <label
                      className="usa-label"
                      htmlFor="stricken-from-trial-session-radio"
                    >
                      Response Date <span className="usa-hint">(Required)</span>
                    </label>
                    <DateSelector
                      defaultValue={form.date}
                      formGroupClassNames="display-inline-block padding-0 margin-left-5"
                      id="due-date-input-statusReportDueDate"
                      minDate={motionOrderResponseFormHelper.minDate}
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
                  <hr className="border-top-2px border-base-lighter" />
                  {/* TODO 10586: update IDs and classnames */}
                  <FormGroup
                    className={
                      motionOrderResponseFormHelper.dispositionErrorClass
                    }
                  >
                    <label
                      className="usa-label"
                      htmlFor="motion-order-reply-radio"
                    >
                      Select One <span className="usa-hint">(Required)</span>
                    </label>
                    <div className="usa-radio usa-radio__inline">
                      <input
                        aria-label="order reply"
                        checked={form.strickenFromTrialSession || false}
                        className="usa-radio__input"
                        id="motion-order-reply"
                        name="motionOrderReply"
                        type="radio"
                        value={constants.ORDER_REPLY_OPTIONS.REPLY}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor={'motion-order-reply'}
                      >
                        {constants.ORDER_REPLY_OPTIONS.REPLY}
                      </label>
                    </div>
                    <div className="usa-radio usa-radio__inline">
                      <input
                        aria-label="order reply s/r"
                        checked={form.strickenFromTrialSession || false}
                        className="usa-radio__input"
                        id="motion-order-reply-sr"
                        name="motionOrderReplySr"
                        type="radio"
                        value={constants.ORDER_REPLY_OPTIONS.REPLY_SR}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor={'motion-order-reply-sr'}
                      >
                        {constants.ORDER_REPLY_OPTIONS.REPLY_SR}
                      </label>
                    </div>
                  </FormGroup>

                  <FormGroup
                    className={motionOrderResponseFormHelper.dateErrorClass}
                    errorText={validationErrors.date}
                  >
                    <DateSelector
                      defaultValue={form.date}
                      disabled={!form.dueDateMessage}
                      formGroupClassNames="display-inline-block padding-0 margin-left-5"
                      id="due-date-input-statusReportDueDate"
                      minDate={motionOrderResponseFormHelper.minDate}
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
                  <hr className="border-top-2px border-base-lighter" />
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
                        Additional order text{' '}
                      </label>
                      <textarea
                        aria-describedby="additional-text-label"
                        aria-label="additional text"
                        autoCapitalize="none"
                        className="usa-textarea maxw-none height-8 usa-character-count__field textarea-resize-vertical"
                        id="additional-text"
                        maxLength={constants.MAX_ORDER_RESPONSE_TEXT_CHARACTERS}
                        name="additionalText"
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
                          constants.MAX_ORDER_RESPONSE_TEXT_CHARACTERS
                        }
                        stringToCount={form.customText}
                      />
                    </div>
                  </FormGroup>
                </div>
              </div>
              <Button
                link
                className="margin-left-205"
                data-testid="clear-all-fields"
                onClick={e => {
                  e.preventDefault();
                  clearOptionalFieldsStampFormSequence();
                }}
              >
                Clear All
              </Button>
            </div>
            <div className="grid-col-7">
              <div className="margin-bottom-1 display-flex flex-justify-end">
                <Button
                  className="margin-right-0"
                  data-testid="save-signature-button"
                  disabled={!motionOrderResponseFormHelper.canSaveOrderRespones}
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

OrderResponse.displayName = 'OrderResponse';
