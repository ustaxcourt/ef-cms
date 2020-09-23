import { Button } from '../../ustc-ui/Button/Button';
import { FocusLock } from '../../ustc-ui/FocusLock/FocusLock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const modalRoot = document.getElementById('modal-root');

export const DocketRecordOverlay = connect(
  {
    caseDetail: state.caseDetail,
    dismissModalSequence: sequences.dismissModalSequence,
    docketRecordIndex: state.docketRecordIndex,
    formattedCaseDetail: state.formattedCaseDetail,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
  },
  function DocketRecordOverlay({
    caseDetail,
    dismissModalSequence,
    docketRecordIndex,
    formattedCaseDetail,
    openCaseDocumentDownloadUrlSequence,
    runCancelSequence,
  }) {
    const elRef = React.useRef(null);

    const getEl = () => {
      if (!elRef.current) {
        elRef.current = document.createElement('div');
      }
      return elRef.current;
    };

    useEffect(() => {
      const toggleNoScroll = scrollingOn => {
        if (scrollingOn) {
          document.body.classList.add('no-scroll');
          document.addEventListener('touchmove', touchmoveTriggered, {
            passive: false,
          });
        } else {
          document.body.classList.remove('no-scroll');
          document.removeEventListener('touchmove', touchmoveTriggered, {
            passive: false,
          });
        }
      };

      const keydownTriggered = event => {
        if (event.keyCode === 27) {
          return blurDialog(event);
        }
      };

      const touchmoveTriggered = event => {
        return event.preventDefault();
      };

      const blurDialog = event => {
        return runCancelSequence(event);
      };

      modalRoot.appendChild(getEl());
      document.addEventListener('keydown', keydownTriggered, false);
      toggleNoScroll(true);

      return () => {
        modalRoot.removeChild(getEl());
        document.removeEventListener('keydown', keydownTriggered, false);
        toggleNoScroll(false);
      };
    }, []);

    const renderModalContent = () => {
      const closeFunc = dismissModalSequence;
      const entry =
        formattedCaseDetail.formattedDocketEntriesOnDocketRecord[
          docketRecordIndex
        ];
      return (
        <FocusLock>
          <dialog
            open
            className="modal-screen overlay mobile-document-details-overlay"
          >
            <div
              aria-live="assertive"
              aria-modal="true"
              className={'modal-overlay'}
              role="dialog"
            >
              <Button
                link
                aria-roledescription="button to return to docket record"
                className="heading-2 text-left"
                onClick={() => closeFunc()}
              >
                <FontAwesomeIcon icon="caret-left" />
                Document Details
              </Button>
              <hr className="margin-top-1 margin-bottom-2" />
              <h3 tabIndex="-1">{entry.description}</h3>
              <Button
                link
                aria-label={'View PDF'}
                className="view-pdf-button tablet-full-width"
                onClick={() => {
                  openCaseDocumentDownloadUrlSequence({
                    docketNumber: caseDetail.docketNumber,
                    documentId: entry.documentId,
                  });
                }}
              >
                <FontAwesomeIcon icon={['fas', 'file-pdf']} />
                View PDF
              </Button>
              <p className="semi-bold label margin-top-3">Date</p>
              <p className="margin-top-0">{entry.createdAtFormatted}</p>
              <p className="semi-bold label margin-top-3">Pages</p>
              <p className="margin-top-0">{entry.numberOfPages}</p>
              <p className="semi-bold label margin-top-3">Filed By</p>
              <p className="margin-top-0">{entry.filedBy}</p>
              <p className="semi-bold label margin-top-3">Action</p>
              <p className="margin-top-0">{entry.action}</p>
              <p className="semi-bold label margin-top-3">Served</p>
              <p className="margin-top-0">
                {entry.isStatusServed && <span>{entry.servedAtFormatted}</span>}
              </p>
              <p className="semi-bold label margin-top-3">Parties</p>
              <p className="margin-top-0">{entry.servedPartiesCode}</p>
            </div>
          </dialog>
        </FocusLock>
      );
    };

    return ReactDOM.createPortal(renderModalContent(), getEl());
  },
);
