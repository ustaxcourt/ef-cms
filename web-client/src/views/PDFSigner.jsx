import { PropTypes } from 'prop-types';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

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
      const { offsetLeft, offsetTop } = canvasEl;

      x = e.pageX - offsetLeft;
      y = e.pageY - offsetTop;

      this.moveSig(sigEl, x + offsetLeft, y + offsetTop);
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
        <PDFSignerToolbar />
        <div className="sign-pdf-interface">
          <span id="signature" ref={this.signatureRef}>
            (Signed) Joseph Dredd
          </span>
          <canvas id="sign-pdf-canvas" ref={this.canvasRef}></canvas>
        </div>
      </>
    );
  }
}

PDFSignerComponent.propTypes = {
  currentPageNumber: PropTypes.number,
  pdfForSigning: PropTypes.object,
  pdfObj: PropTypes.object,
  setCanvas: PropTypes.func,
  setPage: PropTypes.func,
  setSignatureData: PropTypes.func,
  signatureData: PropTypes.object,
};

export const PDFSigner = connect(
  {
    currentPageNumber: state.pdfForSigning.pageNumber,
    pdfForSigning: state.pdfForSigning,
    pdfObj: state.pdfForSigning.pdfjsObj,
    setCanvas: sequences.setCanvasForPDFSigningSequence,
    setSignatureData: sequences.setPDFSignatureDataSequence,
    signatureData: state.pdfForSigning.signatureData,
  },
  PDFSignerComponent,
);
