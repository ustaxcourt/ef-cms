import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';

import React from 'react';

class PDFPreviewModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.modalMounted = this.modalMounted.bind(this);

    this.modal = {
      classNames: 'pdf-preview-modal',
      confirmLabel: 'OK',
      title: props.title,
    };
  }

  modalMounted() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');

    this.props.loadPdfSequence({
      ctx,
      file: this.props.pdfFile,
    });
  }

  renderBody() {
    return (
      <>
        <div>
          <div className="margin-bottom-3">
            <FontAwesomeIcon
              className={
                'icon-button' +
                (this.props.pdfPreviewModalHelper.disableLeftButtons
                  ? ' disabled'
                  : '')
              }
              icon={['fas', 'step-backward']}
              id="firstPage"
              size="2x"
              onClick={() =>
                this.props.setPageSequence({
                  currentPage: 1,
                })
              }
            />
            <FontAwesomeIcon
              className={
                'icon-button' +
                (this.props.pdfPreviewModalHelper.disableLeftButtons
                  ? ' disabled'
                  : '')
              }
              icon={['fas', 'caret-left']}
              id="prev"
              size="2x"
              onClick={() =>
                this.props.setPageSequence({
                  currentPage: this.props.currentPage - 1,
                })
              }
            />
            <span className="pages">
              Page {this.props.currentPage} of {this.props.totalPages}
            </span>
            <FontAwesomeIcon
              className={
                'icon-button' +
                (this.props.pdfPreviewModalHelper.disableRightButtons
                  ? ' disabled'
                  : '')
              }
              icon={['fas', 'caret-right']}
              id="next"
              size="2x"
              onClick={() =>
                this.props.setPageSequence({
                  currentPage: this.props.currentPage + 1,
                })
              }
            />
            <FontAwesomeIcon
              className={
                'icon-button' +
                (this.props.pdfPreviewModalHelper.disableRightButtons
                  ? ' disabled'
                  : '')
              }
              icon={['fas', 'step-forward']}
              id="lastPage"
              size="2x"
              onClick={() =>
                this.props.setPageSequence({
                  currentPage: this.props.totalPages,
                })
              }
            />
          </div>
          <div className="pdf-preview-content">
            <canvas
              height={this.props.pdfPreviewModal.height}
              id="the-canvas"
              ref={this.canvasRef}
              width={this.props.pdfPreviewModal.width}
            ></canvas>
          </div>
        </div>
      </>
    );
  }
}

export const PDFPreviewModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.dismissModalSequence,
    currentPage: state.pdfPreviewModal.currentPage,
    loadPdfSequence: sequences.loadPdfSequence,
    pdfPreviewModal: state.pdfPreviewModal,
    pdfPreviewModalHelper: state.pdfPreviewModalHelper,
    setPageSequence: sequences.setPageSequence,
    totalPages: state.pdfPreviewModal.totalPages,
  },
  PDFPreviewModalComponent,
);
