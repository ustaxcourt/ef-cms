const pdfjsLib = require('pdfjs-dist');

import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

class PDFPreviewModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.pageNextRef = React.createRef();
    this.pagePrevRef = React.createRef();
    this.pageNumRef = React.createRef();
    this.initFile = this.initFile.bind(this);
  }

  initFile(pdfData) {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pageNextEl = this.pageNextRef.current;
    const pagePrevEl = this.pagePrevRef.current;
    const pageNumEl = this.pageNumRef.current;

    let pdfDoc = null,
      pageNum = 1,
      pageRendering = false,
      pageNumPending = null,
      scale = 0.8;

    /**
     * Get page info from document, resize canvas accordingly, and render page.
     * @param num Page number.
     */
    function renderPage(num) {
      pageRendering = true;
      // Using promise to fetch the page
      pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport({
          scale: scale,
        });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        var renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function() {
          pageRendering = false;
          if (pageNumPending !== null) {
            // New page rendering is pending
            renderPage(pageNumPending);
            pageNumPending = null;
          }
        });
      });

      // Update page counters
      pageNumEl.textContent = num;
    }

    /**
     * If another page rendering in progress, waits until the rendering is
     * finised. Otherwise, executes rendering immediately.
     */
    function queueRenderPage(num) {
      if (pageRendering) {
        pageNumPending = num;
      } else {
        renderPage(num);
      }
    }

    /**
     * Displays previous page.
     */
    function onPrevPage() {
      if (pageNum <= 1) {
        return;
      }
      pageNum--;
      queueRenderPage(pageNum);
    }
    pagePrevEl.addEventListener('click', onPrevPage);

    /**
     * Displays next page.
     */
    function onNextPage() {
      if (pageNum >= pdfDoc.numPages) {
        return;
      }
      pageNum++;
      queueRenderPage(pageNum);
    }
    pageNextEl.addEventListener('click', onNextPage);

    /**
     * Asynchronously downloads PDF.
     */
    pdfjsLib.getDocument({ data: pdfData }).promise.then(function(pdfDoc_) {
      pdfDoc = pdfDoc_;
      pageNumEl.textContent = pdfDoc.numPages;

      // Initial/first page rendering
      renderPage(pageNum);
    });
  }

  modalMounted() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

    //const pdfData = this.props.loadData(this.props.pdfFile);
    var reader = new FileReader();
    reader.readAsDataURL(this.props.pdfFile);
    reader.onload = () => {
      this.initFile(atob(reader.result.replace(/[^,]+,/, '')));
    };
    reader.onerror = function(error) {
      console.log('error: ', error);
    };
  }

  renderBody() {
    return (
      <div>
        <div>
          <button id="prev" ref={this.pagePrevRef}>
            Previous
          </button>
          <button id="next" ref={this.pageNextRef}>
            Next
          </button>
          &nbsp; &nbsp;
          <span>
            Page:
            <span id="page_num" ref={this.pageNumRef} />/
            <span id="page_count" />
          </span>
        </div>
        <canvas id="the-canvas" ref={this.canvasRef}></canvas>
      </div>
    );
  }
}

export const PDFPreviewModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    loadData: sequences.loadPDFDataForPreviewSequence,
    pdfPreviewData: state.pdfPreviewData,
  },
  PDFPreviewModalComponent,
);
