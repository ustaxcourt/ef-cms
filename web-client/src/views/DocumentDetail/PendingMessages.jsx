import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

class PendingMessagesComponent extends React.Component {
  render() {
    const {
      documentDetailHelper,
      setWorkItemActionSequence,
      submitCompleteSequence,
      submitForwardSequence,
      updateCompleteFormValueSequence,
      updateForwardFormValueSequence,
      openCreateMessageModalSequence,
      users,
    } = this.props;
    return (
      <div>
        <button
          type="button"
          onClick={() => openCreateMessageModalSequence()}
          className="usa-button-secondary"
        >
          Create Message
        </button>

        {(!documentDetailHelper.formattedDocument ||
          !documentDetailHelper.formattedDocument.workItems ||
          !documentDetailHelper.formattedDocument.workItems.length) && (
          <div>
            There are no pending messages associated with this document.
          </div>
        )}
        {documentDetailHelper.formattedDocument &&
          documentDetailHelper.formattedDocument.workItems &&
          documentDetailHelper.formattedDocument.workItems.map(
            (workItem, idx) => (
              <div
                className="card"
                aria-labelledby="tab-pending-messages"
                key={idx}
              >
                <div className="content-wrapper">
                  <p>
                    <span className="label-inline">To</span>
                    {workItem.currentMessage.to}
                  </p>
                  <p>
                    <span className="label-inline">From</span>
                    {workItem.currentMessage.from}
                  </p>
                  <p>
                    <span className="label-inline">Received</span>
                    {workItem.currentMessage.createdAtTimeFormatted}
                  </p>
                  <p>{workItem.currentMessage.message}</p>
                </div>
                <div
                  className="content-wrapper toggle-button-wrapper actions-wrapper"
                  role="tablist"
                >
                  <button
                    role="tab"
                    id="history-tab"
                    aria-selected={documentDetailHelper.showAction(
                      'history',
                      workItem.workItemId,
                    )}
                    aria-controls="history-card"
                    className={`${
                      documentDetailHelper.showAction(
                        'history',
                        workItem.workItemId,
                      )
                        ? 'selected'
                        : 'unselected'
                    }`}
                    onClick={() =>
                      setWorkItemActionSequence({
                        action: 'history',
                        workItemId: workItem.workItemId,
                      })
                    }
                  >
                    <FontAwesomeIcon icon="list-ul" size="sm" />
                    View History
                  </button>
                  {workItem.showComplete && (
                    <button
                      role="tab"
                      id="complete-tab"
                      aria-selected={documentDetailHelper.showAction(
                        'complete',
                        workItem.workItemId,
                      )}
                      aria-controls="history-card"
                      className={`${
                        documentDetailHelper.showAction(
                          'complete',
                          workItem.workItemId,
                        )
                          ? 'selected'
                          : 'unselected'
                      }`}
                      onClick={() =>
                        setWorkItemActionSequence({
                          action: 'complete',
                          workItemId: workItem.workItemId,
                        })
                      }
                    >
                      <FontAwesomeIcon icon="check-circle" size="sm" />
                      Complete
                    </button>
                  )}
                  {workItem.showSendTo && (
                    <button
                      role="tab"
                      id="forward-tab"
                      aria-selected={documentDetailHelper.showAction(
                        'forward',
                        workItem.workItemId,
                      )}
                      aria-controls="forward-card"
                      data-workitemid={workItem.workItemId}
                      className={`send-to ${
                        documentDetailHelper.showAction(
                          'forward',
                          workItem.workItemId,
                        )
                          ? 'selected'
                          : 'unselected'
                      }`}
                      onClick={() =>
                        setWorkItemActionSequence({
                          action: 'forward',
                          workItemId: workItem.workItemId,
                        })
                      }
                    >
                      <FontAwesomeIcon icon="share-square" size="sm" /> Send To
                    </button>
                  )}
                </div>
                {documentDetailHelper.showAction(
                  'complete',
                  workItem.workItemId,
                ) && (
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
                          action: null,
                          workItemId: workItem.workItemId,
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
                {documentDetailHelper.showAction(
                  'history',
                  workItem.workItemId,
                ) &&
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
                {documentDetailHelper.showAction(
                  'history',
                  workItem.workItemId,
                ) &&
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
                            {message.to}
                          </p>
                          <p>
                            <span className="label-inline">From</span>
                            {message.from}
                          </p>
                          <p>
                            <span className="label-inline">Received</span>
                            {message.createdAtTimeFormatted}
                          </p>
                          <p>{message.message}</p>
                          {workItem.historyMessages.length - 1 !== mIdx && (
                            <hr aria-hidden="true" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                {documentDetailHelper.showAction(
                  'forward',
                  workItem.workItemId,
                ) && (
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
                      <label htmlFor="forward-recipient-id">Send To</label>
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
                      <label htmlFor="forward-message">Add Message</label>
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
            ),
          )}
      </div>
    );
  }
}

PendingMessagesComponent.propTypes = {
  documentDetailHelper: PropTypes.object,
  openCreateMessageModalSequence: PropTypes.func,
  setWorkItemActionSequence: PropTypes.func,
  submitCompleteSequence: PropTypes.func,
  submitForwardSequence: PropTypes.func,
  updateCompleteFormValueSequence: PropTypes.func,
  updateForwardFormValueSequence: PropTypes.func,
  users: PropTypes.array,
  workItemActions: PropTypes.object,
};

export const PendingMessages = connect(
  {
    documentDetailHelper: state.documentDetailHelper,
    openCreateMessageModalSequence: sequences.openCreateMessageModalSequence,
    setWorkItemActionSequence: sequences.setWorkItemActionSequence,
    submitCompleteSequence: sequences.submitCompleteSequence,
    submitForwardSequence: sequences.submitForwardSequence,
    updateCompleteFormValueSequence: sequences.updateCompleteFormValueSequence,
    updateForwardFormValueSequence: sequences.updateForwardFormValueSequence,
    users: state.internalUsers,
    workItemActions: state.workItemActions,
  },
  PendingMessagesComponent,
);
