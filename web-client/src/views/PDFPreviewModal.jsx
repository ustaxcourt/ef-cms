const pdfjsLib = require('pdfjs-dist');

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';

import React from 'react';

class PDFPreviewModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.initFile = this.initFile.bind(this);
    this.onPrevPage = this.onPrevPage.bind(this);
    this.onNextPage = this.onNextPage.bind(this);
    this.onLastPage = this.onLastPage.bind(this);
    this.onFirstPage = this.onFirstPage.bind(this);

    this.modal = {
      classNames: 'pdf-preview-modal',
      confirmLabel: 'Ok',
    };

    this.state = {
      currentPage: 0,
      pageNumPending: null,
      pageRendering: false,
      totalPages: 0,
    };
  }

  onPrevPage() {
    if (this.state.currentPage <= 1) {
      return;
    }
    this.setState({
      currentPage: this.state.currentPage - 1,
    });
    this.queueRenderPage(this.state.currentPage);
  }

  queueRenderPage(num) {
    if (this.state.pageRendering) {
      this.setState({ pageNumPending: num });
    } else {
      this.renderPage(num);
    }
  }

  onNextPage() {
    if (this.state.currentPage >= this.state.totalPages) {
      return;
    }
    this.setState({
      currentPage: this.state.currentPage + 1,
    });
    this.queueRenderPage(this.state.currentPage);
  }

  renderPage(num) {
    this.setState({
      pageRendering: true,
    });

    this.state.pdfDoc.getPage(num).then(page => {
      const viewport = page.getViewport({
        scale: 0.8,
      });
      this.state.canvas.height = viewport.height;
      this.state.canvas.width = viewport.width;

      const renderContext = {
        canvasContext: this.state.ctx,
        viewport: viewport,
      };
      const renderTask = page.render(renderContext);

      renderTask.promise.then(() => {
        this.setState({
          pageRendering: false,
        });

        if (this.state.pageNumPending !== null) {
          this.renderPage(this.state.pageNumPending);
          this.setState({
            pageNumPending: null,
          });
        }
      });
    });
  }

  onLastPage() {
    this.setState({
      currentPage: this.state.totalPages,
    });
    this.queueRenderPage(this.state.currentPage);
  }

  onFirstPage() {
    this.setState({
      currentPage: 1,
    });
    this.queueRenderPage(this.state.currentPage);
  }

  initFile(pdfData) {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    this.setState({
      canvas,
      ctx,
    });

    this.setState({
      currentPage: 1,
      pageNumPending: null,
      pageRendering: false,
    });

    pdfjsLib.getDocument({ data: pdfData }).promise.then(pdfDoc => {
      this.setState({
        pdfDoc,
        totalPages: pdfDoc.numPages,
      });
      this.renderPage(this.state.currentPage);
    });
  }

  modalMounted() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

    this.props.startLoadSequence();

    //const pdfData = this.props.loadData(this.props.pdfFile);
    const reader = new FileReader();
    reader.readAsDataURL(this.props.pdfFile);
    reader.onload = () => {
      this.initFile(atob(reader.result.replace(/[^,]+,/, '')));
      this.props.stopLoadSequence();
    };
    reader.onerror = function(error) {
      this.props.stopLoadSequence();
      console.log('error: ', error);
    };
  }

  renderBody() {
    return (
      <div className="pdf-preview-content">
        <div>
          <div className="margin-bottom-3">
            <FontAwesomeIcon
              className="icon-button"
              icon={['fas', 'step-backward']}
              id="firstPage"
              size="2x"
              onClick={this.onFirstPage}
            />
            <FontAwesomeIcon
              className="icon-button"
              icon={['fas', 'caret-left']}
              id="prev"
              size="2x"
              onClick={this.onPrevPage}
            />
            <span className="pages">
              Page {this.state.currentPage} of {this.state.totalPages}
            </span>
            <FontAwesomeIcon
              className="icon-button"
              icon={['fas', 'caret-right']}
              id="next"
              size="2x"
              onClick={this.onNextPage}
            />
            <FontAwesomeIcon
              className="icon-button"
              icon={['fas', 'step-forward']}
              id="lastPage"
              size="2x"
              onClick={this.onLastPage}
            />
          </div>
        </div>
        <canvas id="the-canvas" ref={this.canvasRef}></canvas>
      </div>
    );
  }
}

export const PDFPreviewModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.dismissModalSequence,
    loadData: sequences.loadPDFDataForPreviewSequence,
    pdfPreviewData: state.pdfPreviewData,
    startLoadSequence: sequences.setFormSubmittingSequence,
    stopLoadSequence: sequences.unsetFormSubmittingSequence,
  },
  PDFPreviewModalComponent,
);
