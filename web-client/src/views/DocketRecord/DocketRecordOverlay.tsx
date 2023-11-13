import { Button } from '../../ustc-ui/Button/Button';
import { FocusLock } from '../../ustc-ui/FocusLock/FocusLock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const modalRoot = window.document.getElementById('modal-root');

export const DocketRecordOverlay = connect(
  {
    caseDetail: state.caseDetail,
    dismissModalSequence: sequences.dismissModalSequence,
    docketEntry: state.modal.docketEntry,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
  },
  function DocketRecordOverlay({
    caseDetail,
    dismissModalSequence,
    docketEntry,
    openCaseDocumentDownloadUrlSequence,
    runCancelSequence,
  }) {
    const elRef = React.useRef(null);

    const getEl = () => {
      if (!elRef.current) {
        elRef.current = window.document.createElement('div');
      }
      return elRef.current;
    };

    useEffect(() => {
      const toggleNoScroll = scrollingOn => {
        if (scrollingOn) {
          window.document.body.classList.add('no-scroll');
          window.document.addEventListener('touchmove', touchmoveTriggered, {
            passive: false,
          });
        } else {
          window.document.body.classList.remove('no-scroll');
          window.document.removeEventListener('touchmove', touchmoveTriggered, {
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
      window.document.addEventListener('keydown', keydownTriggered, false);
      toggleNoScroll(true);

      return () => {
        modalRoot.removeChild(getEl());
        window.document.removeEventListener('keydown', keydownTriggered, false);
        toggleNoScroll(false);
      };
    }, []);

    const renderModalContent = () => {
      const closeFunc = dismissModalSequence;

      return (
        <FocusLock>
          <dialog
            open
            className="modal-screen overlay mobile-document-details-overlay"
          >
            <div
              aria-live="polite"
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
              <h3 tabIndex={-1}>{docketEntry.descriptionDisplay}</h3>
              <Button
                link
                aria-label={'View PDF'}
                className="view-pdf-button tablet-full-width"
                onClick={() => {
                  openCaseDocumentDownloadUrlSequence({
                    docketEntryId: docketEntry.docketEntryId,
                    docketNumber: caseDetail.docketNumber,
                    useSameTab: true,
                  });
                }}
              >
                <FontAwesomeIcon icon={['fas', 'file-pdf']} />
                View PDF
              </Button>
              {docketEntry.isLegacySealed && (
                <p className="sealed-address">
                  <FontAwesomeIcon
                    className="margin-right-1"
                    icon={['fas', 'lock']}
                  />
                  Document is sealed
                </p>
              )}
              <p className="semi-bold label margin-top-3">Date</p>
              <p className="margin-top-0">{docketEntry.createdAtFormatted}</p>
              <p className="semi-bold label margin-top-3">Pages</p>
              <p className="margin-top-0">{docketEntry.numberOfPages}</p>
              <p className="semi-bold label margin-top-3">Filed By</p>
              <p className="margin-top-0">{docketEntry.filedBy}</p>
              <p className="semi-bold label margin-top-3">Action</p>
              <p className="margin-top-0">{docketEntry.action}</p>
              <p className="semi-bold label margin-top-3">Served</p>
              <p className="margin-top-0">
                {docketEntry.showNotServed && (
                  <span className="text-semibold not-served">Not served</span>
                )}
                {docketEntry.showServed && (
                  <span>{docketEntry.servedAtFormatted}</span>
                )}
              </p>
              <p className="semi-bold label margin-top-3">Parties</p>
              <p className="margin-top-0">{docketEntry.servedPartiesCode}</p>
            </div>
          </dialog>
        </FocusLock>
      );
    };

    return ReactDOM.createPortal(renderModalContent(), getEl());
  },
);

DocketRecordOverlay.displayName = 'DocketRecordOverlay';
