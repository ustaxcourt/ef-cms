import { Button } from '../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile } from '../ustc-ui/Responsive/Responsive';
import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

export const PDFPreviewModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.dismissModalSequence,
    currentPage: state.modal.pdfPreviewModal.currentPage,
    loadPdfSequence: sequences.loadPdfSequence,
    pdfPreviewModal: state.modal.pdfPreviewModal,
    pdfPreviewModalHelper: state.pdfPreviewModalHelper,
    previewPdfFile: state.previewPdfFile,
    setPageSequence: sequences.setPageSequence,
    totalPages: state.modal.pdfPreviewModal.totalPages,
  },
  function PDFPreviewModal({
    cancelSequence,
    confirmSequence,
    currentPage,
    loadPdfSequence,
    pdfPreviewModal,
    pdfPreviewModalHelper,
    previewPdfFile,
    setPageSequence,
    title,
    totalPages,
  }) {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      loadPdfSequence({
        ctx,
        file: previewPdfFile,
      });
    }, []);

    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="pdf-preview-modal"
        confirmLabel="Ok"
        confirmSequence={confirmSequence}
        title={title}
      >
        <Mobile>
          <div className="modal-mobile-header">
            <Button
              link
              className="back heading-3"
              icon={['fas', 'caret-left']}
              iconColor="white"
              iconSize="lg"
              onClick={() => cancelSequence()}
            >
              Back to Review Your Filing
            </Button>
          </div>
          <h2 aria-hidden="true" className="modal-mobile-title">
            {title}
          </h2>
        </Mobile>
        <div>
          <div className="margin-bottom-3">
            <Button
              link
              title="pdf preview first page"
              onClick={() =>
                setPageSequence({
                  currentPage: 1,
                })
              }
            >
              <FontAwesomeIcon
                className={classNames(
                  'icon-button',
                  pdfPreviewModalHelper.disableLeftButtons && 'disabled',
                )}
                icon={['fas', 'step-backward']}
                id="firstPage"
                size="2x"
              />
            </Button>
            <Button
              link
              title="pdf preview next page"
              onClick={() =>
                setPageSequence({
                  currentPage: currentPage - 1,
                })
              }
            >
              <FontAwesomeIcon
                className={classNames(
                  'icon-button',
                  pdfPreviewModalHelper.disableLeftButtons && 'disabled',
                )}
                icon={['fas', 'caret-left']}
                id="previous"
                size="2x"
              />
            </Button>
            <span className="pages">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              link
              title="pdf preview previous page"
              onClick={() =>
                setPageSequence({
                  currentPage: currentPage + 1,
                })
              }
            >
              <FontAwesomeIcon
                className={classNames(
                  'icon-button',
                  pdfPreviewModalHelper.disableRightButtons && 'disabled',
                )}
                icon={['fas', 'caret-right']}
                id="next"
                size="2x"
              />
            </Button>
            <Button
              link
              title="pdf preview last page"
              onClick={() =>
                setPageSequence({
                  currentPage: totalPages,
                })
              }
            >
              <FontAwesomeIcon
                className={classNames(
                  'icon-button',
                  pdfPreviewModalHelper.disableRightButtons && 'disabled',
                )}
                icon={['fas', 'step-forward']}
                id="lastPage"
                size="2x"
              />
            </Button>
          </div>
          <div className="pdf-preview-content">
            <canvas
              height={pdfPreviewModal.height}
              id="the-canvas"
              ref={canvasRef}
              width={pdfPreviewModal.width}
            ></canvas>
          </div>
        </div>
      </ModalDialog>
    );
  },
);
