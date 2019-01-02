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
      updateForwardFormValueSequence,
      updateCompleteFormValueSequence,
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
          <div className="usa-grid-full mb-2">
            <span className="label font-large mr-4">
              {document.documentType}
            </span>
            <span className="label mr-2">Date filed</span>{' '}
            <span className="mr-4">{document.createdAtFormatted}</span>
            <span className="label mr-2">Filed by</span> {document.filedBy}
          </div>

          <div className="usa-grid-full mb-2">
            <span className="font-medium" id="messages-label">
              Messages
            </span>
          </div>

          <div className="usa-grid-full">
            <div className="usa-width-one-third">
              {workItems.map((workItem, idx) => (
                <div
                  className="card"
                  aria-labelledby="messages-label"
                  key={idx}
                >
                  <div className="card-body">
                    <div className="mb-2">
                      <div className="mb-1">
                        <span className="label">To</span>{' '}
                        {workItem.messages[0].sentTo}
                      </div>

                      <div className="mb-1">
                        <span className="label">From</span>{' '}
                        {workItem.messages[0].sentBy}
                      </div>

                      <div>
                        <span className="label">Received</span>{' '}
                        {workItem.messages[0].createdAtFormatted}
                      </div>
                    </div>

                    <div className="mb-1">{workItem.messages[0].message}</div>
                  </div>

                  <div className="usa-grid-full extra pt-1 pb-1 toggles">
                    <button
                      className={`usa-width-one-third toggle ${
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
                      <FontAwesomeIcon icon="list-ul" size="sm" /> View History
                    </button>
                    <button
                      className={`usa-width-one-third toggle ${
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
                      <FontAwesomeIcon icon="check-circle" size="sm" /> Complete
                    </button>
                    <button
                      data-workitemid={workItem.workItemId}
                      className={`usa-width-one-third send-to toggle ${
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
                      <FontAwesomeIcon icon="share-square" size="sm" /> Send To
                    </button>
                  </div>

                  {showAction('complete', workItem.workItemId) && (
                    <div className="card-body extra pb-4">
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
                        <b id="message-label">Add message (optional)</b>
                        <br />
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
                          <span>Complete</span>
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
                    <div className="card-body extra pb-4">
                      {workItem.messages.map((message, mIdx) => (
                        <div key={mIdx} className="mb-2">
                          <div className="mb-1">
                            <span className="label">To</span> {message.sentTo}
                          </div>

                          <div className="mb-1">
                            <span className="label">From</span> {message.sentBy}
                          </div>

                          <div className="mb-1">
                            <span className="label">Received</span>{' '}
                            {message.createdAtFormatted}
                          </div>

                          <div className="mb-1">{message.message}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAction('forward', workItem.workItemId) && (
                    <div className="card-body extra">
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
                        <b id="recipient-label">Send to</b>
                        <br />
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
                        <b id="message-label">Add document message</b>
                        <br />
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
                          <span>Forward</span>
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
  updateForwardFormValueSequence: PropTypes.func,
  workItemActions: PropTypes.object,
  workItems: PropTypes.array,
  updateCompleteFormValueSequence: PropTypes.func,
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
    updateForwardFormValueSequence: sequences.updateForwardFormValueSequence,
    workItemActions: state.workItemActions,
    workItems: state.extractedWorkItems,
    updateCompleteFormValueSequence: sequences.updateCompleteFormValueSequence,
  },
  DocumentDetail,
);
