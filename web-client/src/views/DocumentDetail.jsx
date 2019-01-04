import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { state, sequences } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

import ErrorNotification from './ErrorNotification';
import SuccessNotification from './SuccessNotification';

class DocumentDetail extends React.Component {
  render() {
    const {
      baseUrl,
      caseDetail,
      document,
      form,
      setWorkItemActionSequence,
      showAction,
      submitCompleteSequence,
      submitForwardSequence,
      updateCompleteFormValueSequence,
      updateForwardFormValueSequence,
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
            <span className="label">{document.documentType}</span>
            <span className="label">Date filed</span>
            <span className="">{document.createdAtFormatted}</span>
            <span className="label">Filed by</span>
            {document.filedBy}
          </div>
          <div className="usa-grid-full">
            <span className="" id="messages-label">
              Pending Messages
            </span>
          </div>
          <div className="usa-grid-full">
            <div className="usa-width-one-third">
              {!workItems.length && (
                <div>
                  There are no pending messages associated with this document.
                </div>
              )}
              {workItems.map((workItem, idx) => (
                <div
                  className="card"
                  aria-labelledby="messages-label"
                  key={idx}
                >
                  <div className="content-wrapper">
                    <p>
                      <span className="label-inline">To</span>
                      {workItem.messages[0].sentTo}
                    </p>
                    <p>
                      <span className="label-inline">From </span>
                      {workItem.messages[0].sentBy}
                    </p>
                    <p>
                      <span className="label-inline">Received</span>
                      {workItem.messages[0].createdAtFormatted}
                    </p>
                    <p>{workItem.messages[0].message}</p>
                  </div>

                  <div className="actions-wrapper">
                    <div className="content-wrapper">
                      <div className="usa-grid-full">
                        <button
                          className={`usa-width-one-third ${
                            showAction('history', workItem.workItemId)
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() =>
                            setWorkItemActionSequence({
                              workItemId: workItem.workItemId,
                              action: 'history',
                            })
                          }
                        >
                          <FontAwesomeIcon icon="list-ul" size="sm" />
                          View History
                        </button>
                        <button
                          className={`usa-width-one-third ${
                            showAction('complete', workItem.workItemId)
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() =>
                            setWorkItemActionSequence({
                              workItemId: workItem.workItemId,
                              action: 'complete',
                            })
                          }
                        >
                          <FontAwesomeIcon icon="check-circle" size="sm" />
                          Complete
                        </button>
                        <button
                          data-workitemid={workItem.workItemId}
                          className={`usa-width-one-third send-to ${
                            showAction('forward', workItem.workItemId)
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() =>
                            setWorkItemActionSequence({
                              workItemId: workItem.workItemId,
                              action: 'forward',
                            })
                          }
                        >
                          <FontAwesomeIcon icon="share-square" size="sm" /> Send
                          To
                        </button>
                      </div>
                    </div>

                    {showAction('complete', workItem.workItemId) && (
                      <div className="content-wrapper">
                        <form
                          id="complete-form"
                          role="form"
                          noValidate
                          onSubmit={e => {
                            e.preventDefault();
                            submitCompleteSequence({
                              workItemId: workItem.workItemId,
                            });
                            setWorkItemActionSequence({
                              workItemId: workItem.workItemId,
                              action: null,
                            });
                          }}
                        >
                          <label htmlFor="complete-message">
                            Add message (optional)
                          </label>
                          <textarea
                            aria-labelledby="message-label"
                            name="completeMessage"
                            id="complete-message"
                            onChange={e => {
                              updateCompleteFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                                workItemId: workItem.workItemId,
                              });
                            }}
                          />
                          <button type="submit" className="usa-button">
                            Complete
                          </button>
                          <button
                            type="button"
                            className="usa-button-secondary"
                            onClick={() => {
                              setWorkItemActionSequence({
                                workItemId: workItem.workItemId,
                                action: null,
                              });
                            }}
                          >
                            Cancel
                          </button>
                        </form>
                      </div>
                    )}

                    {showAction('history', workItem.workItemId) && (
                      <div className="content-wrapper">
                        {workItem.messages.map((message, mIdx) => (
                          <div key={mIdx} className="">
                            <div className="">
                              <span className="label-inline">To</span>
                              {message.sentTo}
                            </div>
                            <div className="">
                              <span className="label-inline">From</span>
                              {message.sentBy}
                            </div>
                            <p>
                              <span className="label-inline">Received</span>
                              {message.createdAtFormatted}
                            </p>
                            <p>{message.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {showAction('forward', workItem.workItemId) && (
                      <div className="content-wrapper">
                        <form
                          data-workitemid={workItem.workItemId}
                          className="forward-form"
                          role="form"
                          noValidate
                          onSubmit={e => {
                            e.preventDefault();
                            submitForwardSequence({
                              workItemId: workItem.workItemId,
                            });
                            setWorkItemActionSequence({
                              workItemId: workItem.workItemId,
                              action: null,
                            });
                          }}
                        >
                          <label htmlFor="forward-recipient-id">Send to</label>
                          <select
                            name="forwardRecipientId"
                            id="forward-recipient-id"
                            aria-labelledby="recipient-label"
                            onChange={e => {
                              updateForwardFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                                workItemId: workItem.workItemId,
                              });
                            }}
                          >
                            <option value=""> -- Select -- </option>
                            <option value="seniorattorney">
                              Senior Attorney
                            </option>
                          </select>
                          <label htmlFor="forward-message">
                            Add document message
                          </label>
                          <textarea
                            aria-labelledby="message-label"
                            name="forwardMessage"
                            id="forward-message"
                            onChange={e => {
                              updateForwardFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                                workItemId: workItem.workItemId,
                              });
                            }}
                          />
                          <button type="submit" className="usa-button">
                            Forward
                          </button>
                          <button
                            type="button"
                            className="usa-button usa-button-secondary"
                            onClick={() => {
                              setWorkItemActionSequence({
                                workItemId: workItem.workItemId,
                                action: null,
                              });
                            }}
                          >
                            Cancel
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="usa-width-two-thirds">
              <iframe
                title={`Document type: ${document.documentType}`}
                src={`${baseUrl}/documents/${
                  document.documentId
                }/documentDownloadUrl`}
              />
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

DocumentDetail.propTypes = {
  baseUrl: PropTypes.string,
  caseDetail: PropTypes.object,
  document: PropTypes.object,
  form: PropTypes.object,
  setWorkItemActionSequence: PropTypes.func,
  showAction: PropTypes.func,
  showForwardInputs: PropTypes.bool,
  submitCompleteSequence: PropTypes.func,
  submitForwardSequence: PropTypes.func,
  updateCompleteFormValueSequence: PropTypes.func,
  updateForwardFormValueSequence: PropTypes.func,
  workItemActions: PropTypes.object,
  workItems: PropTypes.array,
};

export default connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.formattedCaseDetail,
    document: state.extractedDocument,
    form: state.form,
    setWorkItemActionSequence: sequences.setWorkItemActionSequence,
    showAction: state.showAction,
    showForwardInputs: state.form.showForwardInputs,
    submitCompleteSequence: sequences.submitCompleteSequence,
    submitForwardSequence: sequences.submitForwardSequence,
    updateCompleteFormValueSequence: sequences.updateCompleteFormValueSequence,
    updateForwardFormValueSequence: sequences.updateForwardFormValueSequence,
    workItemActions: state.workItemActions,
    workItems: state.extractedWorkItems,
  },
  DocumentDetail,
);
