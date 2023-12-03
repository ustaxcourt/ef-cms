import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PDFSignerPageButtons } from './PDFSignerPageButtons';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';

export const SignOrder = connect(
  {
    currentPageNumber: state.pdfForSigning.pageNumber,
    docketEntryId: state.docketEntryId,
    docketNumber: state.caseDetail.docketNumber,
    navigateToCaseDetailWithDraftDocumentSequence:
      sequences.navigateToCaseDetailWithDraftDocumentSequence,
    pdfForSigning: state.pdfForSigning,
    pdfObj: state.pdfForSigning.pdfjsObj,
    pdfSignerHelper: state.pdfSignerHelper,
    saveDocumentSigningSequence: sequences.saveDocumentSigningSequence,
    setSignatureData: sequences.setPDFSignatureDataSequence,
    signatureApplied: state.pdfForSigning.signatureApplied,
    signatureData: state.pdfForSigning.signatureData,
    skipSigningOrderSequence: sequences.skipSigningOrderSequence,
  },
  function SignOrder({
    currentPageNumber,
    docketEntryId,
    navigateToCaseDetailWithDraftDocumentSequence,
    pdfForSigning,
    pdfObj,
    pdfSignerHelper,
    saveDocumentSigningSequence,
    setSignatureData,
    signatureApplied,
    signatureData,
    skipSigningOrderSequence,
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
        <section className="usa-section grid-container">
          <div className="grid-row margin-bottom-1">
            <div className="grid-col-12">
              <h1>Apply Signature</h1>
            </div>
          </div>
          <div className="grid-row margin-bottom-1">
            <div className="grid-col-4">
              <Button
                link
                onClick={() => {
                  navigateToCaseDetailWithDraftDocumentSequence({
                    primaryTab: 'draftDocuments',
                    viewerDraftDocumentToDisplay: { docketEntryId },
                  });
                }}
              >
                <FontAwesomeIcon icon={['fa', 'arrow-alt-circle-left']} />
                Back to Draft Document
              </Button>
            </div>
            <div className="grid-col-4 text-align-center sign-pdf-control">
              <PDFSignerPageButtons />
            </div>
            <div className="grid-col-4 text-align-right">
              {pdfSignerHelper.isPlaced && (
                <>
                  <Button link icon="trash" onClick={() => restart()}>
                    Delete Signature
                  </Button>

                  <Button
                    className="margin-right-0"
                    data-testid="save-signature-button"
                    id="save-signature-button"
                    onClick={() => saveDocumentSigningSequence()}
                  >
                    Save Signature
                  </Button>
                </>
              )}
              {pdfSignerHelper.showSkipSignatureButton && (
                <Button
                  className="margin-right-0"
                  id="skip-signature-button"
                  onClick={() => skipSigningOrderSequence()}
                >
                  Skip Signature
                </Button>
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
                  data-testid="sign-pdf-canvas"
                  id="sign-pdf-canvas"
                  ref={canvasRef}
                ></canvas>
                <span id="signature-warning">
                  You cannot apply a signature here.
                </span>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);

SignOrder.displayName = 'SignOrder';
