import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { state, sequences } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

import ErrorNotification from './ErrorNotification';
import SuccessNotification from './SuccessNotification';

class DocumentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = { documentUrl: '' };
  }

  displayPdf(documentBlob) {
    this.setState({
      documentUrl: window.URL.createObjectURL(documentBlob, {
        type: 'application/pdf',
      }),
    });
  }

  componentDidMount() {
    this.props.viewDocumentSequence({
      documentId: this.props.document.documentId,
      callback: this.displayPdf.bind(this),
    });
  }

  componentWillUnmount() {
    window.URL.revokeObjectURL(this.state.documentUrl);
  }

  render() {
    const {
      caseDetail,
      document,
      form,
      showForwardInputs,
      submitForwardSequence,
      updateFormValueSequence,
      workItems,
    } = this.props;

    return (
      <React.Fragment>
        <div className="usa-grid breadcrumb">
          <FontAwesomeIcon icon="caret-left" />
          <a href="/" id="queue-nav">
            Back
          </a>
        </div>
        <section className="usa-section usa-grid">
          <h1 className="captioned" tabIndex="-1">
            Docket number: {caseDetail.docketNumber}
          </h1>
          <p>{caseDetail.caseTitle}</p>
          <p>
            <span
              className="usa-label case-status-label"
              aria-label={`status: ${caseDetail.status}`}
            >
              <span aria-hidden="true">{caseDetail.status}</span>
            </span>
          </p>
          <hr aria-hidden="true" />
          <SuccessNotification />
          <ErrorNotification />
          <div className="usa-grid-full">
            <div className="usa-width-one-third card">
              <h2>{document.documentType}</h2>
              <div className="usa-grid-full subsection">
                <div className="usa-width-one-half">
                  <span className="label">Date filed</span>
                  <p>{document.createdAtFormatted}</p>
                </div>
                <div className="usa-width-one-half">
                  <span className="label">Filed by</span>
                  <p>{document.filedBy}</p>
                </div>
              </div>
              <span className="label" id="messages-label">
                Messages
              </span>
              {workItems.map((workItem, idx) => (
                <div
                  className="card messages-card"
                  aria-labelledby="messages-label"
                  key={idx}
                >
                  <div className="subsection">
                    <span className="label">{workItem.messages[0].sentBy}</span>
                    <span className="float-right">
                      {workItem.messages[0].createdAtFormatted}
                    </span>
                  </div>
                  <p>{workItem.messages[0].message}</p>
                  <div className="subsection">
                    <span className="flagged-name">
                      {' '}
                      <FontAwesomeIcon
                        icon="flag"
                        className="action-flag"
                        size="sm"
                      />{' '}
                      {workItem.assigneeName}
                    </span>
                    {!showForwardInputs && (
                      <span className="float-right">
                        <button
                          className="link"
                          aria-label="Forward message"
                          onClick={() => {
                            updateFormValueSequence({
                              key: 'showForwardInputs',
                              value: true,
                            });
                          }}
                        >
                          Forward
                        </button>
                      </span>
                    )}
                    {showForwardInputs && (
                      <form
                        id="forward-form"
                        role="form"
                        noValidate
                        onSubmit={e => {
                          e.preventDefault();
                          submitForwardSequence({
                            workItemId: workItem.workItemId,
                          });
                        }}
                      >
                        <b id="recipient-label">Send to</b>
                        <br />
                        <select
                          name="forwardRecipientId"
                          id="forward-recipient-id"
                          aria-labelledby="recipient-label"
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                        >
                          <option value=""> -- Select -- </option>
                          <option value="seniorattorney">
                            Senior Attorney
                          </option>
                        </select>
                        <b id="message-label">Add document message</b>
                        <br />
                        <textarea
                          aria-labelledby="message-label"
                          name="forwardMessage"
                          id="forward-message"
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                        />
                        <button type="submit" className="usa-button">
                          <span>Forward</span>
                        </button>
                        <button
                          type="button"
                          className="usa-button-secondary"
                          onClick={() => {
                            updateFormValueSequence({
                              key: 'showForwardInputs',
                              value: false,
                            });
                          }}
                        >
                          Cancel
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="usa-width-two-thirds">
              <iframe
                title={`Document type: ${document.documentType}`}
                src={this.state.documentUrl}
              />
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

DocumentDetail.propTypes = {
  caseDetail: PropTypes.object,
  document: PropTypes.object,
  form: PropTypes.object,
  showForwardInputs: PropTypes.bool,
  submitForwardSequence: PropTypes.func,
  updateFormValueSequence: PropTypes.func,
  workItems: PropTypes.array,
  viewDocumentSequence: PropTypes.func,
};

export default connect(
  {
    caseDetail: state.formattedCaseDetail,
    document: state.extractedDocument,
    form: state.form,
    showForwardInputs: state.form.showForwardInputs,
    submitForwardSequence: sequences.submitForwardSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    workItems: state.extractedWorkItems,
    viewDocumentSequence: sequences.viewDocumentSequence,
  },
  DocumentDetail,
);
