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
    clearMotionOrderResponseFormSequence:
      sequences.clearMotionOrderResponseFormSequence,
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
    clearMotionOrderResponseFormSequence,
    motionOrderResponseFormHelper,
    constants,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    navigateBackSequence,
    pdfForSigning,
    pdfObj,
    setPDFStampDataSequence,
    // submitStampMotionSequence, // TODO 10586: update this
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
              <div className="border border-base-lighter">
                <label
                  className="grid-header grid-row padding-left-205" // TODO 10586: update classnames
                  htmlFor="motion-order-response-form"
                >
                  Order Response
                </label>
                <div className="motion-order-response-form">
                  <FormGroup
                    className={
                      motionOrderResponseFormHelper.dispositionErrorClass
                    }
                    errorText={validationErrors.disposition}
                  >
                    <label
                      className="usa-label"
                      htmlFor="response-date-input-orderResponseResponseDate" // TODO 10586: update IDs
                    >
                      Response Date <span className="usa-hint">(Required)</span>
                    </label>
                    <DateSelector
                      defaultValue={'MM/DD/YYYY'} // TODO 10586: fix date selector not clearing bug
                      formGroupClassNames="display-inline-block order-response-date-selector"
                      id="response-date-input-orderResponseResponseDate"
                      minDate={motionOrderResponseFormHelper.minDate}
                      placeHolderText="MM/DD/YYYY"
                      onChange={e => {
                        formatAndUpdateDateFromDatePickerSequence({
                          key: 'responseDate',
                          toFormat: constants.DATE_FORMATS.MMDDYY,
                          value: e.target.value,
                        });
                        // TODO 10586: update this to validateOrderResponseSequence
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
                    {/* TODO 10586: use map as seen in ApplyStamp */}
                    <div className="usa-radio">
                      <input
                        aria-label="order reply"
                        checked={
                          form.motionOrderResponse ===
                            constants.ORDER_REPLY_OPTIONS.REPLY || false
                        }
                        className="usa-radio__input"
                        id="motion-order-reply"
                        name="motionOrderResponse"
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
                    <div className="usa-radio">
                      <input
                        aria-label="order reply s/r"
                        checked={
                          form.motionOrderResponse ===
                            constants.ORDER_REPLY_OPTIONS.REPLY_SR || false
                        }
                        className="usa-radio__input"
                        id="motion-order-reply-sr"
                        name="motionOrderResponse"
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
                    <label
                      className="usa-label"
                      htmlFor="due-date-input-motionOrderResponseDueDate"
                    >
                      Due date <span className="usa-hint">(Required)</span>
                    </label>
                    <DateSelector
                      defaultValue={form.dueDate}
                      disabled={!form.motionOrderResponse}
                      formGroupClassNames="display-inline-block order-response-date-selector"
                      id="due-date-input-motionOrderResponseDueDate"
                      minDate={motionOrderResponseFormHelper.minDate}
                      placeHolderText="MM/DD/YYYY"
                      onChange={e => {
                        formatAndUpdateDateFromDatePickerSequence({
                          key: 'dueDate',
                          toFormat: constants.DATE_FORMATS.MMDDYY,
                          value: e.target.value,
                        });
                        validateStampSequence();
                      }}
                    />
                  </FormGroup>
                  <hr className="border-top-2px border-base-lighter" />
                  <FormGroup
                    className="order-response-form-group"
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
                        value={form.additionalText || ''}
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
                className="margin-left-205 order-response-clear-button"
                data-testid="clear-all-fields"
                onClick={e => {
                  e.preventDefault();
                  clearMotionOrderResponseFormSequence();
                }}
              >
                Clear All
              </Button>
              <div className="margin-bottom-2 margin-top-2 button-container">
                <Button
                  className="margin-right-1"
                  data-testid="save-draft-button"
                  id="save-draft-button"
                  onClick={() => submitMotionOrderResponseSequence()}
                >
                  Save as Draft
                </Button>
                <Button link onClick={() => navigateBackSequence()}>
                  Cancel
                </Button>
              </div>
            </div>
            <div className="grid-col-7">
              <div className="margin-bottom-1 display-flex flex-justify-start">
                {/* <label
                  className="usa-label"
                  htmlFor="custom-text"
                  id="custom-text-label"
                >
                  Docket entry preview:
                </label> */}
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
