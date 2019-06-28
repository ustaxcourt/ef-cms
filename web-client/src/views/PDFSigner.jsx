import { PropTypes } from 'prop-types';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { CaseDetailHeader } from './CaseDetailHeader';
import { PDFSignerToolbar } from './PDFSignerToolbar';

class PDFSignerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
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
    if (this.props.signatureData === null) {
      this.renderPDFPage(this.props.currentPageNumber);
    }
  }

  renderPDFPage(pageNumber) {
    const canvas = this.canvasRef.current;
    const signature = this.signatureRef.current;
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
      this.start(canvas, signature);
    });
  }

  moveSig(sig, x, y) {
    sig.style.top = y + 'px';
    sig.style.left = x + 'px';
  }

  stop(canvasEl, x, y, scale = 1) {
    this.props.setSignatureData({ signatureData: { scale, x, y } });
    canvasEl.onmousemove = null;
  }

  start(canvasEl, sigEl) {
    let x;
    let y;

    // clear current signature data
    this.props.setSignatureData({ signatureData: null });

    canvasEl.onmousemove = e => {
      const { pageX, pageY } = e;
      const canvasBounds = canvasEl.getBoundingClientRect();
      const offsetLeft = canvasBounds.x;
      const offsetTop = canvasBounds.y;

      x = pageX - offsetLeft;
      y = pageY - offsetTop;

      this.moveSig(sigEl, pageX, pageY);
    };

    canvasEl.onmousedown = () => {
      this.stop(canvasEl, x, y);
    };

    sigEl.onmousedown = () => {
      this.stop(canvasEl, x, y);
    };
  }

  render() {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <div className="grid-row">
            <div className="grid-col-12">
              <div className="grid-row">
                <div className="grid-col-9">
                  <h2>Proposed Stipulated Decision</h2>
                  <div className="sign-pdf-interface">
                    <span id="signature" ref={this.signatureRef}>
                      (Signed) Joseph Dredd
                    </span>
                    <canvas id="sign-pdf-canvas" ref={this.canvasRef}></canvas>
                  </div>
                </div>
                <div className="grid-col-3">
                  <PDFSignerToolbar />
                </div>
              </div>
            </div>
          </div>
          <div className="grid-row">
            <div className="grid-col-12">
              <button
                className="usa-button"
                disabled={!this.props.signatureData}
                onClick={() => this.props.completeSigning()}
              >
                Save
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
