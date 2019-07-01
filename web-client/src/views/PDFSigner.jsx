import { PropTypes } from 'prop-types';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { CaseDetailHeader } from './CaseDetailHeader';
import { PDFSignerMessage } from './PDFSignerMessage';
import { PDFSignerToolbar } from './PDFSignerToolbar';

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

    this.state = {
      signatureApplied: false,
    };
  }

  componentDidMount() {
    this.renderPDFPage(this.props.currentPageNumber);
  }

  componentDidUpdate() {
    if (this.props.signatureData === null) {
      this.renderPDFPage(this.props.currentPageNumber);
    }
  }

  renderPDFPage(pageNumber) {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');

    this.props.pdfObj.getPage(pageNumber).then(page => {
      const scale = 1;
      const viewport = page.getViewport(scale);
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
    this.setState({ signatureApplied: false });
    this.props.setSignatureData({ signatureData: null });
  }

  stop(canvasEl, sigEl, x, y, scale = 1) {
    this.props.setSignatureData({ signatureData: { scale, x, y } });
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

    this.setState({ signatureApplied: true });

    this.props.setSignatureData({ signatureData: null });

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
              <h1>Proposed Stipulated Decision</h1>
              <div className="grid-row grid-gap">
                <div className="grid-col-4">
                  <div className="blue-container">
                    <PDFSignerToolbar
                      applySignature={this.start}
                      clearSignature={this.clear}
                      signatureApplied={this.state.signatureApplied}
                    />
                    <div className="margin-top-2 margin-bottom-2">&nbsp;</div>
                    <PDFSignerMessage />
                  </div>
                  <div className="margin-top-2">
                    <button
                      className="usa-button"
                      disabled={!this.props.signatureData}
                      onClick={() => this.props.completeSigning()}
                    >
                      Save & Send
                    </button>
                    <button
                      className="usa-button usa-button--unstyled margin-left-2"
                      onClick={() =>
                        this.props.cancel({
                          docketNumber: this.props.docketNumber,
                          documentId: this.props.documentId,
                        })
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="grid-col-8">
                  <div className="sign-pdf-interface">
                    <span
                      id="signature"
                      ref={this.signatureRef}
                      style={{
                        display: this.state.signatureApplied ? 'block' : 'none',
                      }}
                    >
                      (Signed) Joseph Dredd
                    </span>
                    <canvas id="sign-pdf-canvas" ref={this.canvasRef}></canvas>
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
  cancel: PropTypes.func,
  completeSigning: PropTypes.func,
  currentPageNumber: PropTypes.number,
  docketNumber: PropTypes.string,
  documentId: PropTypes.string,
  pdfForSigning: PropTypes.object,
  pdfObj: PropTypes.object,
  setCanvas: PropTypes.func,
  setPage: PropTypes.func,
  setSignatureData: PropTypes.func,
  signatureData: PropTypes.object,
};

export const PDFSigner = connect(
  {
    cancel: sequences.gotoDocumentDetailSequence,
    completeSigning: sequences.completeDocumentSigningSequence,
    currentPageNumber: state.pdfForSigning.pageNumber,
    docketNumber: state.caseDetail.docketNumber,
    documentId: state.documentId,
    pdfForSigning: state.pdfForSigning,
    pdfObj: state.pdfForSigning.pdfjsObj,
    setCanvas: sequences.setCanvasForPDFSigningSequence,
    setSignatureData: sequences.setPDFSignatureDataSequence,
    signatureData: state.pdfForSigning.signatureData,
  },
  PDFSignerComponent,
);
