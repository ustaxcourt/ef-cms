import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { PDFSignerMessage } from './PDFSignerMessage';
import { PDFSignerToolbar } from './PDFSignerToolbar';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';

export const SignStipDecision = connect(
  {
    completeDocumentSigningSequence: sequences.completeDocumentSigningSequence,
    currentPageNumber: state.pdfForSigning.pageNumber,
    docketNumber: state.caseDetail.docketNumber,
    documentDetailHelper: state.documentDetailHelper,
    documentId: state.documentId,
    loadOriginalProposedStipulatedDecisionSequence:
      sequences.loadOriginalProposedStipulatedDecisionSequence,
    navigateToPathSequence: sequences.navigateToPathSequence,
    pdfForSigning: state.pdfForSigning,
    pdfObj: state.pdfForSigning.pdfjsObj,
    pdfSignerHelper: state.pdfSignerHelper,
    saveDocumentSigningSequence: sequences.saveDocumentSigningSequence,
    setSignatureData: sequences.setPDFSignatureDataSequence,
    signatureApplied: state.pdfForSigning.signatureApplied,
    signatureData: state.pdfForSigning.signatureData,
  },
  ({
    completeDocumentSigningSequence,
    currentPageNumber,
    docketNumber,
    documentDetailHelper,
    documentId,
    loadOriginalProposedStipulatedDecisionSequence,
    navigateToPathSequence,
    pdfForSigning,
    pdfObj,
    pdfSignerHelper,
    setSignatureData,
    signatureApplied,
    signatureData,
  }) => {
    const canvasRef = useRef(null);
    const signatureRef = useRef(null);

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
      loadOriginalProposedStipulatedDecisionSequence();
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

    useEffect(() => {
      renderPDFPage(currentPageNumber);
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
          <div className="grid-row">
            <div className="grid-col-12">
              <h1>
                Sign {documentDetailHelper.formattedDocument.documentType}
              </h1>
              <div className="grid-row grid-gap">
                <div className="grid-col-4">
                  <div className="blue-container">
                    <PDFSignerToolbar
                      applySignature={start}
                      clearSignature={clear}
                    />
                    <div className="margin-top-2 margin-bottom-2">&nbsp;</div>
                    <PDFSignerMessage />
                  </div>
                  <div className="margin-top-2">
                    {/* TODO: This is commented out until we revisit the stipulated
                    decision */}
                    {/* <Button
                      disabled={pdfSignerHelper.disableSaveButton}
                      onClick={() => saveDocumentSigningSequence()}
                    >
                      Save
                    </Button> */}
                    <Button
                      disabled={pdfSignerHelper.disableSaveAndSendButton}
                      onClick={() => completeDocumentSigningSequence()}
                    >
                      Save & Send Message
                    </Button>
                    <Button
                      link
                      className="margin-left-2"
                      onClick={() =>
                        navigateToPathSequence({
                          path: `/case-detail/${docketNumber}/documents/${documentId}`,
                        })
                      }
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
                <div className="grid-col-8">
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
            </div>
          </div>
        </section>
      </>
    );
  },
);
