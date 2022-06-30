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
    currentPageNumber: state.pdfForSigning.pageNumber,
    docketNumber: state.caseDetail.docketNumber,
    form: state.form,
    pdfForSigning: state.pdfForSigning,
    pdfObj: state.pdfForSigning.pdfjsObj,
    pdfSignerHelper: state.pdfSignerHelper,
    saveDocumentSigningSequence: sequences.saveDocumentSigningSequence,
    setSignatureData: sequences.setPDFSignatureDataSequence,
    signatureApplied: state.pdfForSigning.signatureApplied,
    signatureData: state.pdfForSigning.signatureData,
    validationErrors: state.validationErrors,
  },
  function ApplyStamp({
    currentPageNumber,
    form,
    pdfForSigning,
    pdfObj,
    pdfSignerHelper,
    saveDocumentSigningSequence,
    setSignatureData,
    signatureApplied,
    signatureData,
    validationErrors,
  }) {
    const yLimitToPreventServedStampOverlay = 705;

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

    const moveSig = (sig, x, y) => {
      sig.style.top = y + 'px';
      sig.style.left = x + 'px';
    };

    const clear = () => {
      setSignatureData({
        isPdfAlreadySigned: false,
        signatureApplied: false,
        signatureData: null,
      });
    };

    const restart = () => {
      clear();
      start();
    };

    const stopCanvasEvents = (canvasEl, sigEl, x, y, scale = 1) => {
      setSignatureData({
        signatureApplied: true,
        signatureData: { scale, x, y },
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

      setSignatureData({
        signatureApplied: true,
        signatureData: null,
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
                <FormGroup errorText={validationErrors.status}>
                  <fieldset className="usa-fieldset">
                    <legend className="usa-legend">Stamp Order</legend>
                    {['Granted', 'Denied'].map(option => (
                      <div className="usa-radio" key={option}>
                        <input
                          checked={form.lodged === (option === 'Granted')}
                          className="usa-radio__input"
                          id={`motion-status-${option}`}
                          name="status"
                          type="radio"
                          value={option}
                        />
                        <label
                          className="usa-radio__label"
                          htmlFor={`motion-status-${option}`}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </fieldset>
                </FormGroup>
                <FormGroup>
                  {['As moot', 'Without prejudice'].map(option => (
                    <div className="display-inline-block" key={option}>
                      <input
                        checked={false}
                        className="usa-checkbox__input"
                        id={`denied-${option}`}
                        name={`denied-${option}`}
                        type="checkbox"
                      />
                      <label
                        className="usa-checkbox__label"
                        htmlFor={`denied-${option}`}
                        id={`denied-${option}-label`}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </FormGroup>

                <hr />

                <FormGroup>
                  <label className="usa-label" htmlFor="stricken-case-radio">
                    Select any that apply{' '}
                    <span className="usa-hint">(optional)</span>
                  </label>
                  <div className="usa-radio usa-radio__inline">
                    <input
                      checked={true}
                      className="usa-radio__input"
                      id="stricken-case-radio"
                      name="stricken-case"
                      type="radio"
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={'stricken-case'}
                    >
                      This case is stricken from the trial session
                    </label>
                  </div>
                </FormGroup>
                <hr />
                <FormGroup>
                  {/* is it bad to remove label from this formgroup? */}
                  {/* <label className="usa-label" htmlFor="jurisdiction">
                Select any that apply{' '}
                <span className="usa-hint">(optional)</span>
              </label> */}
                  <div className="usa-radio">
                    <input
                      checked={true}
                      className="usa-radio__input"
                      name="general-docket"
                      type="radio"
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={'general-docket'}
                    >
                      The case is restored to the general docket
                    </label>
                  </div>
                  <div className="usa-radio">
                    <input
                      checked={true}
                      className="usa-radio__input"
                      name="undersigned"
                      type="radio"
                    />
                    <label className="usa-radio__label" htmlFor={'undersigned'}>
                      Jurisdiction is retained by the undersigned
                    </label>
                  </div>
                </FormGroup>
                <hr />
                <FormGroup>
                  <div className="usa-radio">
                    <input
                      checked={true}
                      className="usa-radio__input"
                      name="status-report"
                      type="radio"
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={'status-report'}
                    >
                      The parties shall file a status report by{' '}
                      <DateInput
                        className="display-inline-block width-card"
                        id="status-report-or-stip-decision-due-date"
                        names={{
                          day: 'lastDateOfPeriodDay',
                          month: 'lastDateOfPeriodMonth',
                          year: 'lastDateOfPeriodYear',
                        }}
                        placeholder={'MM/DD/YYYY'}
                        showDateHint={false}
                        values={{
                          day: form.lastDateOfPeriodDay,
                          month: form.lastDateOfPeriodMonth,
                          year: form.lastDateOfPeriodYear,
                        }}
                      />
                    </label>
                  </div>
                  <div className="usa-radio">
                    <input
                      checked={true}
                      className="usa-radio__input"
                      name="status-report-or-stip-decision"
                      type="radio"
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={'status-report-or-stip-decision'}
                    >
                      The parties shall file a status report or proposed
                      stipulated decision by{' '}
                      <DateInput
                        className="display-inline-block width-card"
                        id="status-report-or-stip-decision-due-date"
                        names={{
                          day: 'lastDateOfPeriodDay',
                          month: 'lastDateOfPeriodMonth',
                          year: 'lastDateOfPeriodYear',
                        }}
                        placeholder={'MM/DD/YYYY'}
                        showDateHint={false}
                        values={{
                          day: form.lastDateOfPeriodDay,
                          month: form.lastDateOfPeriodMonth,
                          year: form.lastDateOfPeriodYear,
                        }}
                      />
                    </label>
                  </div>
                </FormGroup>
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
                      name="custom-order-text"
                      type="text"
                      value={form.customOrderText}
                    ></textarea>
                    <span
                      aria-live="polite"
                      className="usa-hint usa-character-count__message"
                      id="with-hint-textarea-info"
                    >
                      60 characters remaining
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
                      id="signature"
                      ref={signatureRef}
                    >
                      It is ORDERED as follows:
                      <br />
                      This motion is DENIED as moot without prejudice
                      <hr className="narrow-hr" />
                      - This case is stricken from the trial session -
                      <br />
                      - This case is restored to the general docket -
                      <br />
                      The parties shall file a status report or proposed
                      stipulation decision by 12/30/2022 Stipulation of settled
                      issued due by December 30, 2022
                      <hr className="narrow-hr" />
                      (Signed) {pdfForSigning.nameForSigning}
                      <br />
                      {pdfForSigning.nameForSigningLine2}
                    </span>
                    <canvas
                      className={
                        !signatureData && signatureApplied
                          ? 'cursor-grabbing'
                          : 'cursor-grab'
                      }
                      id="sign-pdf-canvas"
                      ref={canvasRef}
                    ></canvas>
                    <span id="signature-warning">
                      You cannot apply a signature here.
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
