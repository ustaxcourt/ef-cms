import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { DateInput } from '../ustc-ui/DateInput/DateInput';
import { ErrorNotification } from './ErrorNotification';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { PDFSignerPageButtons } from './PDFSignerPageButtons';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';

export const ApplyStamp = connect(
  {
    JURISDICTION_OPTIONS: state.constants.JURISDICTION_OPTIONS,
    STRICKEN_CASE_MESSAGE: state.constants.STRICKEN_CASE_MESSAGE,
    applyStampFormChangeSequence: sequences.applyStampFormChangeSequence,
    applyStampFormHelper: state.applyStampFormHelper,
    clearOptionalFieldsStampFormSequence:
      sequences.clearOptionalFieldsStampFormSequence,
    currentPageNumber: state.pdfForSigning.pageNumber,
    form: state.form,
    pdfForSigning: state.pdfForSigning,
    pdfObj: state.pdfForSigning.pdfjsObj,
    pdfSignerHelper: state.pdfSignerHelper,
    saveDocumentSigningSequence: sequences.saveDocumentSigningSequence,
    setSignatureData: sequences.setPDFSignatureDataSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function ApplyStamp({
    applyStampFormChangeSequence,
    applyStampFormHelper,
    clearOptionalFieldsStampFormSequence,
    currentPageNumber,
    form,
    JURISDICTION_OPTIONS,
    pdfForSigning,
    pdfObj,
    pdfSignerHelper,
    saveDocumentSigningSequence,
    setSignatureData,
    STRICKEN_CASE_MESSAGE,
    updateFormValueSequence,
    validationErrors,
  }) {
    const canvasRef = useRef(null);
    const signatureRef = useRef(null);

    const renderPDFPage = pageNumber => {
      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext('2d');

      pdfObj
        .getPage(pageNumber)
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

    const clear = () => {
      setSignatureData({
        isPdfAlreadySigned: false,
        signatureApplied: false,
        signatureData: null,
      });
      const sigEl = signatureRef.current;

      sigEl.style.top = null;
      sigEl.style.left = null;
    };

    const restart = () => {
      clear();
      start();
    };

    const start = () => {
      const sigEl = signatureRef.current;

      setSignatureData({
        signatureApplied: true,
        signatureData: { scale: 1, x: 84, y: 590 },
      });
      sigEl.style.top = '500px';
      sigEl.style.left = '150px';
    };

    let hasStarted = false;
    useEffect(() => {
      renderPDFPage(currentPageNumber);
      if (!hasStarted) {
        start();
        hasStarted = true;
      }
    }, [currentPageNumber]);

    return (
      <>
        <CaseDetailHeader />
        <div className="grid-container">
          <div className="grid-row grid-gap">
            <ErrorNotification />

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

              <div className="blue-container docket-entry-form">
                <FormGroup
                  className="margin-bottom-0"
                  errorText={validationErrors.status}
                >
                  <fieldset className="usa-fieldset margin-bottom-0">
                    <legend className="usa-legend">Stamp Order</legend>
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
                    <FormGroup className="grid-container margin-bottom-0">
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
                <hr />

                <FormGroup>
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
                <hr />
                <FormGroup>
                  {Object.entries(JURISDICTION_OPTIONS).map(([key, value]) => (
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
                  ))}
                </FormGroup>
                <hr />
                <FormGroup className="margin-bottom-0">
                  {Object.entries({
                    statusReportDueDate:
                      'The parties shall file a status report by ',
                    statusReportOrStipDecisionDueDate:
                      'The parties shall file a status report or proposed stipulated decision by ',
                  }).map(([dueDateKey, dueDateValue]) => (
                    <div className="usa-radio" key={dueDateKey}>
                      <input
                        aria-describedby="dueDateMessage"
                        checked={form.dueDateMessage === dueDateValue}
                        className="usa-radio__input"
                        id={`dueDateMessage-${dueDateKey}`}
                        name="dueDateMessage"
                        type="radio"
                        value={dueDateValue}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        aria-label={dueDateValue}
                        className="usa-radio__label"
                        htmlFor={`dueDateMessage-${dueDateKey}`}
                        id={`dueDateMessage-${dueDateKey}-label`}
                      >
                        {dueDateValue}
                        <DateInput
                          className="display-inline-block width-card"
                          id="due-date-input"
                          names={{
                            day: 'dueDateDay',
                            month: 'dueDateMonth',
                            year: 'dueDateYear',
                          }}
                          placeholder={'MM/DD/YYYY'}
                          showDateHint={false}
                          values={{
                            day: form['dueDateDay'],
                            month: form['dueDateMonth'],
                            year: form['dueDateYear'],
                          }}
                          onChange={({ key, value }) => {
                            updateFormValueSequence({
                              key,
                              value,
                            });
                          }}
                        />
                      </label>
                    </div>
                  ))}
                </FormGroup>
                <Button
                  link
                  className="padding-0"
                  id="clear-optional-fields"
                  onClick={e => {
                    e.preventDefault();
                    clearOptionalFieldsStampFormSequence();
                  }}
                >
                  Clear Optional Fields
                </Button>
                <hr />
                <FormGroup errorText={validationErrors.customOrderText}>
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
                      className="usa-textarea height-8 usa-character-count__field"
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
            <div className="grid-col-7">
              <div className="grid-row margin-bottom-1">
                <div className="grid-col-4 text-align-left sign-pdf-control">
                  <PDFSignerPageButtons />
                </div>
                <div className="grid-col-8 text-align-right">
                  {pdfSignerHelper.isPlaced && (
                    <>
                      <Button link icon="trash" onClick={() => restart()}>
                        Remove Stamp
                      </Button>

                      <Button
                        className="margin-right-0"
                        id="save-signature-button"
                        onClick={() => saveDocumentSigningSequence()}
                      >
                        Save Stamp Order
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="grid-row">
                <div className="grid-col-12">
                  <div className="sign-pdf-interface">
                    <span
                      className={pdfSignerHelper.signatureClass}
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
                        </span>
                        {(form.strickenCase ||
                          form.jurisdiction ||
                          (form.dueDateMessage && form.dueDateDay) ||
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
                          {form.dueDateMessage && form.dueDateDay && (
                            <>
                              {form.dueDateMessage} {form.dueDateMonth}/
                              {form.dueDateDay}/{form.dueDateYear}
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
