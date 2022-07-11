import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';

export const ApplyStamp = connect(
  {
    JURISDICTION_OPTIONS: state.constants.JURISDICTION_OPTIONS,
    STRICKEN_CASE_MESSAGE: state.constants.STRICKEN_CASE_MESSAGE,
    applyStampFormChangeSequence: sequences.applyStampFormChangeSequence,
    applyStampFormHelper: state.applyStampFormHelper,
    clearDueDateSequence: sequences.clearDueDateSequence,
    clearOptionalFieldsStampFormSequence:
      sequences.clearOptionalFieldsStampFormSequence,
    form: state.form,
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
    form,
    JURISDICTION_OPTIONS,
    pdfForSigning,
    pdfObj,
    pdfSignerHelper,
    setPDFStampDataSequence,
    STRICKEN_CASE_MESSAGE,
    submitStampMotionSequence,
    updateFormValueSequence,
    validateStampSequence,
    validationErrors,
  }) {
    const yLimitToPreventServedStampOverlay = 705;

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

    const moveSig = (sig, x, y) => {
      sig.style.top = y + 'px';
      sig.style.left = x + 'px';
    };

    const clear = () => {
      setPDFStampDataSequence({
        isPdfAlreadyStamped: false,
        stampApplied: false,
        stampData: null,
      });
      const sigEl = signatureRef.current;

      sigEl.style.top = null;
      sigEl.style.left = null;
    };

    const restart = () => {
      clear();
      start();
    };

    const stopCanvasEvents = (canvasEl, sigEl, x, y, scale = 1) => {
      setPDFStampDataSequence({
        stampApplied: true,
        stampData: { scale, x, y },
      });

      canvasEl.onmousemove = null;
      canvasEl.onmousedown = null;
      sigEl.onmousemove = null;
      sigEl.onmousedown = null;
    };

    const start = () => {
      const sigEl = signatureRef.current;
      const canvasEl = canvasRef.current;
      let x;
      let y;

      setPDFStampDataSequence({
        stampApplied: false,
        stampData: null,
      });

      canvasEl.onmousemove = e => {
        const { pageX, pageY } = e;
        const canvasBounds = canvasEl.getBoundingClientRect();
        const sigBox = sigEl.getBoundingClientRect();

        const sigParentBounds = sigEl.parentElement.getBoundingClientRect();
        const scrollYOffset = window.scrollY;

        x = pageX - canvasBounds.x;
        y = pageY - canvasBounds.y - scrollYOffset;

        const uiPosX = pageX - sigParentBounds.x;
        const uiPosY = y + (canvasBounds.y - sigParentBounds.y) - sigBox.height;

        if (uiPosY < yLimitToPreventServedStampOverlay) {
          moveSig(sigEl, uiPosX, uiPosY);
        }
      };

      canvasEl.onmousedown = e => {
        const { pageY } = e;
        const canvasBounds = canvasEl.getBoundingClientRect();
        const scrollYOffset = window.scrollY;
        const sigParentBounds = sigEl.parentElement.getBoundingClientRect();
        const sigBoxHeight = sigEl.getBoundingClientRect().height;
        const uiPosY =
          pageY -
          canvasBounds.y -
          scrollYOffset +
          (canvasBounds.y - sigParentBounds.y) -
          sigBoxHeight;

        if (uiPosY < yLimitToPreventServedStampOverlay) {
          stopCanvasEvents(canvasEl, sigEl, x, y - sigBoxHeight);
        }
      };

      // sometimes the cursor falls on top of the signature
      // and catches these events

      sigEl.onmousemove = canvasEl.onmousemove;
      sigEl.onmousedown = canvasEl.onmousedown;
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
        <ErrorNotification />
        <div className="grid-container">
          <div className="grid-row grid-gap">
            <h1 className="heading-1" id="page-title">
              Apply Stamp
            </h1>
          </div>
          <div className="grid-row grid-gap">
            <div className="grid-col-5">
              <div className="grid-row grid-gap">
                <Button
                  link
                  className="margin-bottom-3"
                  href="/trial-sessions"
                  icon={['fa', 'arrow-alt-circle-left']}
                >
                  Back to Document View
                </Button>
              </div>

              <div className="border border-base-lighter">
                <div className="grid-header grid-row padding-left-205">
                  Stamp Order
                </div>
                <div className="stamp-order-form">
                  <FormGroup
                    className="stamp-form-group"
                    errorText={validationErrors.status}
                  >
                    <fieldset className="usa-fieldset margin-bottom-0">
                      {['Granted', 'Denied'].map(option => (
                        <div
                          className={`usa-radio ${
                            option === 'Denied' ? 'margin-bottom-0' : ''
                          }`}
                          key={option}
                        >
                          <input
                            checked={form.status === option}
                            className="usa-radio__input"
                            id={`motion-status-${option}`}
                            name="status"
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
                            htmlFor={`motion-status-${option}`}
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
                            disabled={form.status !== 'Denied'}
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
                            disabled={form.status !== 'Denied'}
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
                    </fieldset>
                  </FormGroup>
                  <hr className="border-top-2px border-base-lighter" />

                  <FormGroup className="stamp-form-group">
                    <label className="usa-label" htmlFor="stricken-case-radio">
                      Select any that apply{' '}
                      <span className="usa-hint">(optional)</span>
                    </label>
                    <div className="usa-radio usa-radio__inline">
                      <input
                        checked={form.strickenCase || false}
                        className="usa-radio__input"
                        id="stricken-case"
                        name="strickenCase"
                        type="radio"
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor={'stricken-case'}
                      >
                        {STRICKEN_CASE_MESSAGE}
                      </label>
                    </div>
                  </FormGroup>
                  <hr className="narrow-hr" />
                  <FormGroup className="stamp-form-group">
                    {Object.entries(JURISDICTION_OPTIONS).map(
                      ([key, value]) => (
                        <div className="usa-radio" key={key}>
                          <input
                            aria-describedby="jurisdiction"
                            checked={form.jurisdiction === value}
                            className="usa-radio__input"
                            id={`jurisdiction-${key}`}
                            name="jurisdiction"
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
                            htmlFor={`jurisdiction-${key}`}
                            id={`jurisdiction-${key}-label`}
                          >
                            {value}
                          </label>
                        </div>
                      ),
                    )}
                  </FormGroup>
                  <hr className="narrow-hr" />
                  <FormGroup className="stamp-form-group">
                    <div className="usa-radio" key="statusReportDueDate">
                      <input
                        aria-describedby="dueDateMessage"
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
                        aria-label="statusReportDueDate"
                        className="usa-radio__label"
                        htmlFor="dueDateMessage-statusReportDueDate"
                        id="dueDateMessage-statusReportDueDate-label"
                      >
                        The parties shall file a status report by{' '}
                        <DateInput
                          className="display-inline-block width-150 padding-0"
                          disabled={
                            form.dueDateMessage !==
                            'The parties shall file a status report by'
                          }
                          errorText={
                            form.dueDateMessage ===
                            'The parties shall file a status report by'
                              ? validationErrors.date
                              : null
                          }
                          id="due-date-input-statusReportDueDate"
                          minDate={applyStampFormHelper.minDate}
                          names={{
                            day: 'day',
                            month: 'month',
                            year: 'year',
                          }}
                          placeholder={'MM/DD/YYYY'}
                          showDateHint={false}
                          values={{
                            day: form.day,
                            month: form.month,
                            year: form.year,
                          }}
                          onBlur={validateStampSequence}
                          onChange={({ key, value }) => {
                            updateFormValueSequence({
                              key,
                              value,
                            });
                          }}
                        />
                      </label>
                    </div>
                    <div
                      className="usa-radio"
                      key="statusReportOrStipDecisionDueDate"
                    >
                      <input
                        aria-describedby="dueDateMessage"
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
                        aria-label="statusReportOrStipDecisionDueDate"
                        className="usa-radio__label"
                        htmlFor="dueDateMessage-statusReportOrStipDecisionDueDate"
                        id="dueDateMessage-statusReportOrStipDecisionDueDate-label"
                      >
                        The parties shall file a status report or proposed
                        stipulated decision by{' '}
                        <DateInput
                          className="display-inline-block width-150 padding-0"
                          disabled={
                            form.dueDateMessage !==
                            'The parties shall file a status report or proposed stipulated decision by'
                          }
                          errorText={
                            form.dueDateMessage ===
                            'The parties shall file a status report or proposed stipulated decision by'
                              ? validationErrors.date
                              : null
                          }
                          id="due-date-input-statusReportOrStipDecisionDueDate"
                          minDate={applyStampFormHelper.minDate}
                          names={{
                            day: 'day',
                            month: 'month',
                            year: 'year',
                          }}
                          placeholder={'MM/DD/YYYY'}
                          showDateHint={false}
                          values={{
                            day: form.day,
                            month: form.month,
                            year: form.year,
                          }}
                          onBlur={validateStampSequence}
                          onChange={({ key, value }) => {
                            updateFormValueSequence({
                              key,
                              value,
                            });
                          }}
                        />
                      </label>
                    </div>
                  </FormGroup>
                  <Button
                    link
                    className="margin-left-205"
                    id="clear-optional-fields"
                    onClick={e => {
                      e.preventDefault();
                      clearOptionalFieldsStampFormSequence();
                    }}
                  >
                    Clear Optional Fields
                  </Button>
                  <hr className="narrow-hr" />
                  <FormGroup
                    className="stamp-form-group"
                    errorText={validationErrors.customOrderText}
                  >
                    <div>
                      <label
                        className="usa-label"
                        htmlFor="custom-order-text"
                        id="custom-order-text-label"
                      >
                        Custom order text{' '}
                        <span className="usa-hint">(optional)</span>
                      </label>
                      <textarea
                        aria-describedby="custom-order-text-label"
                        autoCapitalize="none"
                        className="usa-textarea maxw-none height-8 usa-character-count__field"
                        id="custom-order-text"
                        maxLength="60"
                        name="customOrderText"
                        type="text"
                        value={form.customOrderText}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      ></textarea>
                      <span
                        aria-live="polite"
                        className="usa-hint usa-character-count__message"
                        id="with-hint-textarea-info"
                      >
                        {applyStampFormHelper.customOrderTextCharacterCount}{' '}
                        characters remaining
                      </span>
                    </div>
                  </FormGroup>
                </div>
              </div>
            </div>
            <div className="grid-col-7">
              <div className="margin-bottom-1 display-flex flex-justify-end">
                <>
                  <Button link icon="trash" onClick={() => restart()}>
                    Remove Stamp
                  </Button>

                  <Button
                    className="margin-right-0"
                    disabled={!applyStampFormHelper.canSaveStampOrder}
                    id="save-signature-button"
                    onClick={() => submitStampMotionSequence()}
                  >
                    Save Stamp Order
                  </Button>
                </>
              </div>
              <div className="grid-row">
                <div className="grid-col-12">
                  <div className="sign-pdf-interface">
                    <span
                      className={`${pdfSignerHelper.cursorClass} ${pdfSignerHelper.hideClass}`}
                      id="stamp"
                      ref={signatureRef}
                    >
                      <span className="text-normal" id="stamp-text">
                        It is ORDERED as follows:
                        <br />
                        <span className="font-sans-2xs">
                          This motion is{' '}
                          <span className="text-ls-1 text-bold font-sans-lg">
                            {form.status?.toUpperCase()}
                          </span>{' '}
                          {form.deniedAsMoot && 'as moot '}
                          {form.deniedWithoutPrejudice && 'without prejudice'}
                          <br />
                        </span>
                        {(form.strickenCase ||
                          form.jurisdiction ||
                          (form.dueDateMessage && form.day) ||
                          form.customOrderText) && <hr className="narrow-hr" />}
                        {form.strickenCase && (
                          <>
                            - {STRICKEN_CASE_MESSAGE} -
                            <br />
                          </>
                        )}
                        {form.jurisdiction && (
                          <>
                            - {form.jurisdiction} -<br />
                          </>
                        )}
                        <span className="text-semibold">
                          {form.day && (
                            <>
                              {form.dueDateMessage} {form.month}/{form.day}/
                              {form.year}
                              <br />
                            </>
                          )}
                          {form.customOrderText}
                        </span>
                      </span>
                      <hr className="narrow-hr" />
                      <span id="stamp-signature">
                        (Signed) {pdfForSigning.nameForSigning}
                        <br />
                        {pdfForSigning.nameForSigningLine2}
                      </span>
                    </span>
                    <canvas
                      className={applyStampFormHelper.cursorClass}
                      id="sign-pdf-canvas"
                      ref={canvasRef}
                    ></canvas>
                    <span id="signature-warning">
                      You cannot apply a stamp here.
                    </span>
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
