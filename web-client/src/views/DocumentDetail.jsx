import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { state, sequences } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

import ErrorNotification from './ErrorNotification';
import SuccessNotification from './SuccessNotification';
import PetitionEdit from './PetitionEdit';

class DocumentDetail extends React.Component {
  render() {
    const {
      baseUrl,
      caseDetail,
      document,
      form,
      setWorkItemActionSequence,
      helper,
      submitCompleteSequence,
      submitForwardSequence,
      updateCompleteFormValueSequence,
      updateCurrentTabSequence,
      updateForwardFormValueSequence,
      users,
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
            <a href={'/case-detail/' + caseDetail.docketNumber}>
              Docket Number: {caseDetail.docketNumberWithSuffix}
            </a>
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
          <h2>{document.documentType}</h2>
          <div className="usa-grid-full subsection">
            <div className="usa-width-one-fourth">
              <span className="label-inline">Date filed</span>
              <span>{document.createdAtFormatted}</span>
            </div>
            <div className="usa-width-one-fourth">
              <span className="label-inline">Filed by</span>
              <span>{document.filedBy}</span>
            </div>
          </div>
          <nav className="horizontal-tabs subsection">
            <ul role="tablist">
              <li className={helper.showDocumentInfo ? 'active' : ''}>
                <button
                  disabled
                  role="tab"
                  className="tab-link"
                  id="tab-document-info"
                  aria-selected={helper.showDocumentInfo}
                  onClick={() =>
                    updateCurrentTabSequence({
                      value: 'Document Info',
                    })
                  }
                >
                  Document Info
                </button>
              </li>
              <li className={helper.showPendingMessages ? 'active' : ''}>
                <button
                  role="tab"
                  className="tab-link"
                  id="tab-pending-messages"
                  aria-selected={helper.showPendingMessages}
                  onClick={() =>
                    updateCurrentTabSequence({
                      value: 'Pending Messages',
                    })
                  }
                >
                  Pending Messages
                </button>
              </li>
            </ul>
          </nav>

          <div className="usa-grid-full">
            <div className="usa-width-one-third">
              {helper.showDocumentInfo && <PetitionEdit />}
              {helper.showPendingMessages && (
                <React.Fragment>
                  {(!document ||
                    !document.workItems ||
                    !document.workItems.length) && (
                    <div>
                      There are no pending messages associated with this
                      document.
                    </div>
                  )}
                  {document &&
                    document.workItems &&
                    document.workItems.map((workItem, idx) => (
                      <div
                        className="card"
                        aria-labelledby="tab-pending-messages"
                        key={idx}
                      >
                        <div className="content-wrapper">
                          <p>
                            <span className="label-inline">To</span>
                            {workItem.currentMessage.sentTo}
                          </p>
                          <p>
                            <span className="label-inline">From</span>
                            {workItem.currentMessage.sentBy}
                          </p>
                          <p>
                            <span className="label-inline">Received</span>
                            {workItem.currentMessage.createdAtTimeFormatted}
                          </p>
                          <p>{workItem.currentMessage.message}</p>
                        </div>
                        <div
                          className="usa-grid-full content-wrapper toggle-button-wrapper actions-wrapper"
                          role="tablist"
                        >
                          <button
                            role="tab"
                            id="history-tab"
                            aria-selected={helper.showAction(
                              'history',
                              workItem.workItemId,
                            )}
                            aria-controls="history-card"
                            className={`usa-width-one-third ${
                              helper.showAction('history', workItem.workItemId)
                                ? 'selected'
                                : 'unselected'
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
                            role="tab"
                            id="complete-tab"
                            aria-selected={helper.showAction(
                              'complete',
                              workItem.workItemId,
                            )}
                            aria-controls="history-card"
                            className={`usa-width-one-third ${
                              helper.showAction('complete', workItem.workItemId)
                                ? 'selected'
                                : 'unselected'
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
                            role="tab"
                            id="forward-tab"
                            aria-selected={helper.showAction(
                              'forward',
                              workItem.workItemId,
                            )}
                            aria-controls="forward-card"
                            data-workitemid={workItem.workItemId}
                            className={`usa-width-one-third send-to ${
                              helper.showAction('forward', workItem.workItemId)
                                ? 'selected'
                                : 'unselected'
                            }`}
                            onClick={() =>
                              setWorkItemActionSequence({
                                workItemId: workItem.workItemId,
                                action: 'forward',
                              })
                            }
                          >
                            <FontAwesomeIcon icon="share-square" size="sm" />{' '}
                            Send To
                          </button>
                        </div>
                        {helper.showAction('complete', workItem.workItemId) && (
                          <div
                            id="complete-card"
                            role="tabpanel"
                            aria-labelledby="complete-tab"
                            className="content-wrapper actions-wrapper"
                          >
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
                                Add Message (optional)
                              </label>
                              <textarea
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
                            </form>
                          </div>
                        )}
                        {helper.showAction('history', workItem.workItemId) &&
                          !workItem.historyMessages.length && (
                            <div
                              id="history-card"
                              className="content-wrapper"
                              role="tabpanel"
                              aria-labelledby="history-tab"
                            >
                              No additional messages are available.
                            </div>
                          )}
                        {helper.showAction('history', workItem.workItemId) &&
                          workItem.historyMessages.length > 0 && (
                            <div
                              className="content-wrapper actions-wrapper"
                              id="history-card"
                              role="tabpanel"
                              aria-labelledby="history-tab"
                            >
                              {workItem.historyMessages.map((message, mIdx) => (
                                <div key={mIdx}>
                                  <p>
                                    <span className="label-inline">To</span>
                                    {message.sentTo}
                                  </p>
                                  <p>
                                    <span className="label-inline">From</span>
                                    {message.sentBy}
                                  </p>
                                  <p>
                                    <span className="label-inline">
                                      Received
                                    </span>
                                    {message.createdAtTimeFormatted}
                                  </p>
                                  <p>{message.message}</p>
                                  {workItem.historyMessages.length - 1 !==
                                    mIdx && <hr aria-hidden="true" />}
                                </div>
                              ))}
                            </div>
                          )}
                        {helper.showAction('forward', workItem.workItemId) && (
                          <div
                            id="forward-card"
                            role="tabpanel"
                            className="content-wrapper actions-wrapper"
                          >
                            <form
                              aria-labelledby="forward-tab"
                              data-workitemid={workItem.workItemId}
                              className="forward-form"
                              role="form"
                              noValidate
                              onSubmit={e => {
                                e.preventDefault();
                                submitForwardSequence({
                                  workItemId: workItem.workItemId,
                                });
                              }}
                            >
                              <label htmlFor="forward-recipient-id">
                                Send To
                              </label>
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
                                <option value="">-- Select --</option>
                                {users.map(user => (
                                  <option key={user.userId} value={user.userId}>
                                    {user.name}
                                  </option>
                                ))}
                              </select>
                              <label htmlFor="forward-message">
                                Add Message
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
                                Send
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    ))}
                </React.Fragment>
              )}
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
  helper: PropTypes.object,
  setWorkItemActionSequence: PropTypes.func,
  showForwardInputs: PropTypes.bool,
  submitCompleteSequence: PropTypes.func,
  submitForwardSequence: PropTypes.func,
  updateCompleteFormValueSequence: PropTypes.func,
  updateCurrentTabSequence: PropTypes.func,
  updateForwardFormValueSequence: PropTypes.func,
  users: PropTypes.array,
  workItemActions: PropTypes.object,
};

export default connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.formattedCaseDetail,
    document: state.extractedDocument,
    form: state.form,
    helper: state.documentDetailHelper,
    setWorkItemActionSequence: sequences.setWorkItemActionSequence,
    showForwardInputs: state.form.showForwardInputs,
    submitCompleteSequence: sequences.submitCompleteSequence,
    submitForwardSequence: sequences.submitForwardSequence,
    updateCompleteFormValueSequence: sequences.updateCompleteFormValueSequence,
    updateCurrentTabSequence: sequences.updateCurrentTabSequence,
    updateForwardFormValueSequence: sequences.updateForwardFormValueSequence,
    users: state.internalUsers,
    workItemActions: state.workItemActions,
  },
  DocumentDetail,
);
