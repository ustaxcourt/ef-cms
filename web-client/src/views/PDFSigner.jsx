import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetailHeader';
import { PDFSignerMessage } from './PDFSignerMessage';
import { PDFSignerToolbar } from './PDFSignerToolbar';
import { PropTypes } from 'prop-types';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

class PDFSignerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.clear = this.clear.bind(this);
    this.signatureRef = React.createRef();
    this.renderPDFPage = this.renderPDFPage.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.moveSig = this.moveSig.bind(this);
  }

  componentDidMount() {
    this.renderPDFPage(this.props.currentPageNumber);
  }

  componentDidUpdate() {
    if (!this.props.signatureApplied) {
      this.renderPDFPage(this.props.currentPageNumber);
    }
  }

  renderPDFPage(pageNumber) {
    if (process.env.CI) {
      return;
    }
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');

    this.props.pdfObj.getPage(pageNumber).then(page => {
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
  }

  moveSig(sig, x, y) {
    sig.style.top = y + 'px';
    sig.style.left = x + 'px';
  }

  clear() {
    this.props.setSignatureData({
      isPdfAlreadySigned: false,
      signatureApplied: false,
      signatureData: null,
    });
    this.props.loadOriginalProposedStipulatedDecisionSequence();
  }

  stop(canvasEl, sigEl, x, y, scale = 1) {
    this.props.setSignatureData({
      signatureApplied: true,
      signatureData: { scale, x, y },
    });
    canvasEl.onmousemove = null;
    canvasEl.onmousedown = null;
    sigEl.onmousemove = null;
    sigEl.onmousedown = null;
  }

  start() {
    const sigEl = this.signatureRef.current;
    const canvasEl = this.canvasRef.current;
    let x;
    let y;

    this.props.setSignatureData({
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

      this.moveSig(sigEl, uiPosX, uiPosY);
    };

    canvasEl.onmousedown = () => {
      this.stop(canvasEl, sigEl, x, y);
    };

    // sometimes the cursor falls on top of the signature
    // and catches these events
    sigEl.onmousemove = canvasEl.onmousemove;
    sigEl.onmousedown = canvasEl.onmousedown;
  }

  render() {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <div className="grid-row">
            <div className="grid-col-12">
              <h1>
                Sign{' '}
                {this.props.documentDetailHelper.formattedDocument.documentType}
              </h1>
              <div className="grid-row grid-gap">
                <div className="grid-col-4">
                  <div className="blue-container">
                    <PDFSignerToolbar
                      applySignature={this.start}
                      clearSignature={this.clear}
                    />
                    <div className="margin-top-2 margin-bottom-2">&nbsp;</div>
                    <PDFSignerMessage />
                  </div>
                  <div className="margin-top-2">
                    {/* TODO: This is commented out until we revisit the stipulated
                    decision */}
                    {/* <Button
                      disabled={this.props.pdfSignerHelper.disableSaveButton}
                      onClick={() => this.props.saveDocumentSigningSequence()}
                    >
                      Save
                    </Button> */}
                    <Button
                      disabled={
                        this.props.pdfSignerHelper.disableSaveAndSendButton
                      }
                      onClick={() =>
                        this.props.completeDocumentSigningSequence()
                      }
                    >
                      Save & Send Message
                    </Button>
                    <Button
                      link
                      className="margin-left-2"
                      onClick={() =>
                        this.props.navigateToPathSequence({
                          path: `/case-detail/${this.props.docketNumber}/documents/${this.props.documentId}`,
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
                      className={this.props.pdfSignerHelper.signatureClass}
                      id="signature"
                      ref={this.signatureRef}
                    >
                      (Signed) {this.props.pdfForSigning.nameForSigning}
                      <br />
                      Chief Judge
                    </span>
                    {!process.env.CI && (
                      <canvas
                        className={
                          !this.props.signatureData &&
                          this.props.signatureApplied
                            ? 'cursor-grabbing'
                            : 'cursor-grab'
                        }
                        id="sign-pdf-canvas"
                        ref={this.canvasRef}
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
  }
}

PDFSignerComponent.propTypes = {
  completeDocumentSigningSequence: PropTypes.func,
  currentPageNumber: PropTypes.number,
  docketNumber: PropTypes.string,
  documentDetailHelper: PropTypes.object,
  documentId: PropTypes.string,
  loadOriginalProposedStipulatedDecisionSequence: PropTypes.func,
  navigateToPathSequence: PropTypes.func,
  pdfForSigning: PropTypes.object,
  pdfObj: PropTypes.object,
  pdfSignerHelper: PropTypes.object,
  saveDocumentSigningSequence: PropTypes.func,
  setCanvas: PropTypes.func,
  setSignatureData: PropTypes.func,
  signatureApplied: PropTypes.bool,
  signatureData: PropTypes.object,
};

export const PDFSigner = connect(
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
    setCanvas: sequences.setCanvasForPDFSigningSequence,
    setSignatureData: sequences.setPDFSignatureDataSequence,
    signatureApplied: state.pdfForSigning.signatureApplied,
    signatureData: state.pdfForSigning.signatureData,
  },
  PDFSignerComponent,
);
