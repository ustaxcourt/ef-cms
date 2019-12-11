import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetailHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PDFSignerPageButtons } from './PDFSignerPageButtons';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';

export const SignOrder = connect(
  {
    currentPageNumber: state.pdfForSigning.pageNumber,
    docketNumber: state.caseDetail.docketNumber,
    documentId: state.documentId,
    pdfForSigning: state.pdfForSigning,
    pdfObj: state.pdfForSigning.pdfjsObj,
    pdfSignerHelper: state.pdfSignerHelper,
    saveDocumentSigningSequence: sequences.saveDocumentSigningSequence,
    setSignatureData: sequences.setPDFSignatureDataSequence,
    signatureApplied: state.pdfForSigning.signatureApplied,
    signatureData: state.pdfForSigning.signatureData,
  },
  ({
    currentPageNumber,
    docketNumber,
    documentId,
    pdfForSigning,
    pdfObj,
    pdfSignerHelper,
    saveDocumentSigningSequence,
    setSignatureData,
    signatureApplied,
    signatureData,
  }) => {
    const canvasRef = useRef(null);
    const signatureRef = useRef(null);

    const renderPDFPage = pageNumber => {
      if (process.env.CI) {
        return;
      }
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      pdfObj.getPage(pageNumber).then(page => {
        const scale = 1;
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        var renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        page.render(renderContext);
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

    const stop = (canvasEl, sigEl, x, y, scale = 1) => {
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
        const sigParentBounds = sigEl.parentElement.getBoundingClientRect();
        const scrollYOffset = window.scrollY;

        x = pageX - canvasBounds.x;
        y = pageY - canvasBounds.y - scrollYOffset;

        const uiPosX = pageX - sigParentBounds.x;
        const uiPosY =
          pageY -
          canvasBounds.y -
          scrollYOffset +
          (canvasBounds.y - sigParentBounds.y);

        moveSig(sigEl, uiPosX, uiPosY);
      };

      canvasEl.onmousedown = () => {
        stop(canvasEl, sigEl, x, y);
      };

      // sometimes the cursor falls on top of the signature
      // and catches these events
      sigEl.onmousemove = canvasEl.onmousemove;
      sigEl.onmousedown = canvasEl.onmousedown;
    };

    useEffect(() => {
      renderPDFPage(currentPageNumber);
      start();
    }, []);

    useEffect(() => {
      if (!signatureData) {
        renderPDFPage(currentPageNumber);
      }
    });

    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <div className="grid-row margin-bottom-1">
            <div className="grid-col-4">
              <Button
                link
                href={`/case-detail/${docketNumber}/documents/${documentId}`}
              >
                <FontAwesomeIcon icon={['fa', 'arrow-alt-circle-left']} />
                Back to Draft
              </Button>
            </div>
            <div className="grid-col-4 text-align-center sign-pdf-control">
              <PDFSignerPageButtons />
            </div>
            <div className="grid-col-4 text-align-right">
              {pdfSignerHelper.isPlaced && (
                <Button link icon="trash" onClick={() => restart()}>
                  Delete Signature
                </Button>
              )}

              <Button
                className="margin-right-0"
                disabled={!pdfSignerHelper.isPlaced}
                onClick={() =>
                  saveDocumentSigningSequence({
                    gotoAfterSigning: 'DocumentDetail',
                  })
                }
              >
                Save Signature
              </Button>
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
                {!process.env.CI && (
                  <canvas
                    className={
                      !signatureData && signatureApplied
                        ? 'cursor-grabbing'
                        : 'cursor-grab'
                    }
                    id="sign-pdf-canvas"
                    ref={canvasRef}
                  ></canvas>
                )}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);
