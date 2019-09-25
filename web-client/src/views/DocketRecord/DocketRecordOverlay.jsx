import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const appRoot = document.getElementById('app');
const modalRoot = document.getElementById('modal-root');

class DocketRecordOverlayComponent extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.dismissModalSequence = this.props.dismissModalSequence;
  }

  toggleNoScroll(scrollingOn) {
    if (scrollingOn) {
      document.body.classList.add('no-scroll');
      document.addEventListener('touchmove', this.touchmoveTriggered, {
        passive: false,
      });
    } else {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('touchmove', this.touchmoveTriggered, {
        passive: false,
      });
    }
  }

  keydownTriggered(event) {
    if (event.keyCode === 27) {
      return this.blurDialog(event);
    }
  }
  touchmoveTriggered(event) {
    return event.preventDefault();
  }
  blurDialog(event) {
    return this.runCancelSequence(event);
  }
  componentDidMount() {
    modalRoot.appendChild(this.el);
    appRoot.inert = true;
    appRoot.setAttribute('aria-hidden', 'true');
    document.addEventListener('keydown', this.keydownTriggered, false);
    this.toggleNoScroll(true);
  }
  componentWillUnmount() {
    modalRoot.removeChild(this.el);
    appRoot.inert = false;
    appRoot.setAttribute('aria-hidden', 'false');
    document.removeEventListener('keydown', this.keydownTriggered, false);

    this.toggleNoScroll(false);
  }

  render() {
    return ReactDOM.createPortal(this.renderModalContent(), this.el);
  }

  renderModalContent() {
    const closeFunc = this.props.dismissModalSequence;
    const {
      document,
      record,
    } = this.props.formattedCaseDetail.docketRecordWithDocument[
      this.props.docketRecordIndex
    ];
    const { baseUrl, token } = this.props;
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
            <button
              aria-roledescription="button to return to docket record"
              className="heading-2 usa-button usa-button--unstyled"
              onClick={() => closeFunc()}
            >
              <FontAwesomeIcon icon="caret-left" />
              Document Details
            </button>
            <hr className="margin-top-1 margin-bottom-2" />
            <h3 tabIndex="-1">{record.description}</h3>
            <a
              aria-label={'View PDF'}
              className="usa-button view-pdf-button tablet-full-width"
              href={`${baseUrl}/documents/${document.documentId}/document-download-url?token=${token}`}
              rel="noreferrer noopener"
              target="_blank"
            >
              <FontAwesomeIcon icon={['fas', 'file-pdf']} />
              View PDF
            </a>
            <p className="semi-bold label margin-top-3">Date</p>
            <p className="margin-top-0">{document.createdAtFormatted}</p>
            <p className="semi-bold label margin-top-3">Filed By</p>
            <p className="margin-top-0">{document && document.filedBy}</p>
            <p className="semi-bold label margin-top-3">Action</p>
            <p className="margin-top-0">{record.action}</p>
            <p className="semi-bold label margin-top-3">Served</p>
            <p className="margin-top-0">
              {document && document.isStatusServed && (
                <span>{document.servedAtFormatted}</span>
              )}
            </p>
            <p className="semi-bold label margin-top-3">Parties</p>
            <p className="margin-top-0">
              {document && document.servedPartiesCode}
            </p>
          </div>
        </dialog>
      </FocusLock>
    );
  }
}

DocketRecordOverlayComponent.propTypes = {
  baseUrl: PropTypes.string,
  dismissModalSequence: PropTypes.func,
  docketRecordIndex: PropTypes.number,
  formattedCaseDetail: PropTypes.object,
  token: PropTypes.string,
};

export const DocketRecordOverlay = connect(
  {
    baseUrl: state.baseUrl,
    clearDocumentSequence: sequences.clearDocumentSequence,
    dismissModalSequence: sequences.dismissModalSequence,
    docketRecordIndex: state.docketRecordIndex,
    formattedCaseDetail: state.formattedCaseDetail,
    token: state.token,
  },
  DocketRecordOverlayComponent,
);
