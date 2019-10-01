import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Select } from '../../ustc-ui/Select/Select';
import { TextArea } from '../../ustc-ui/TextArea/TextArea';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PendingMessages = connect(
  {
    constants: state.constants,
    documentDetailHelper: state.documentDetailHelper,
    form: state.form,
    messageId: state.messageId,
    openCreateMessageModalSequence: sequences.openCreateMessageModalSequence,
    setWorkItemActionSequence: sequences.setWorkItemActionSequence,
    submitCompleteSequence: sequences.submitCompleteSequence,
    submitForwardSequence: sequences.submitForwardSequence,
    updateCompleteFormValueSequence: sequences.updateCompleteFormValueSequence,
    updateForwardFormValueSequence: sequences.updateForwardFormValueSequence,
    users: state.users,
    validateForwardMessageSequence: sequences.validateForwardMessageSequence,
    validationErrors: state.validationErrors,
    workItemMetadata: state.workItemMetadata,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  ({
    constants,
    documentDetailHelper,
    form,
    messageId,
    openCreateMessageModalSequence,
    setWorkItemActionSequence,
    submitCompleteSequence,
    submitForwardSequence,
    updateCompleteFormValueSequence,
    updateForwardFormValueSequence,
    users,
    validateForwardMessageSequence,
    validationErrors,
    workItemMetadata,
    workQueueSectionHelper,
  }) => {
    return (
      <div className="blue-container">
        <button
          className="usa-button usa-button margin-bottom-2"
          id="create-message-button"
          type="button"
          onClick={() => openCreateMessageModalSequence()}
        >
          <FontAwesomeIcon
            className="margin-right-1"
            icon="plus-circle"
            size="lg"
          />
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
                aria-labelledby="tab-pending-messages"
                className={`card margin-bottom-0 workitem-${
                  workItem.workItemId
                } ${
                  workItem.currentMessage.messageId === messageId
                    ? 'highlight'
                    : ''
                }`}
                key={idx}
              >
                <div className="content-wrapper">
                  <div className="margin-bottom-1">
                    <span className="label-inline">To</span>
                    {workItem.currentMessage.to}
                  </div>
                  <div className="margin-bottom-1">
                    <span className="label-inline">From</span>
                    {workItem.currentMessage.from}
                  </div>
                  <div className="margin-bottom-1">
                    <span className="label-inline">Sent On</span>
                    {workItem.currentMessage.createdAtTimeFormatted}
                  </div>
                  <p>{workItem.currentMessage.message}</p>
                </div>

                <div
                  className="content-wrapper toggle-button-wrapper actions-wrapper"
                  role="tablist"
                >
                  <div className="grid-container padding-x-0">
                    <div className="grid-row">
                      <div className="grid-col-4 padding-x-0">
                        <button
                          aria-controls={`history-card-${idx}`}
                          aria-selected={documentDetailHelper.showAction(
                            'history',
                            workItem.workItemId,
                          )}
                          className={`usa-button ${
                            documentDetailHelper.showAction(
                              'history',
                              workItem.workItemId,
                            )
                              ? 'selected'
                              : 'unselected'
                          }`}
                          id={`history-tab-${idx}`}
                          role="tab"
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
                      </div>

                      <div className="grid-col-4 padding-x-0">
                        {workItem.showComplete && (
                          <button
                            aria-controls={`history-card-${idx}`}
                            aria-selected={documentDetailHelper.showAction(
                              'complete',
                              workItem.workItemId,
                            )}
                            className={`usa-button ${
                              documentDetailHelper.showAction(
                                'complete',
                                workItem.workItemId,
                              )
                                ? 'selected'
                                : 'unselected'
                            }`}
                            id={`complete-tab-${idx}`}
                            role="tab"
                            onClick={() =>
                              setWorkItemActionSequence({
                                action: 'complete',
                                workItemId: workItem.workItemId,
                              })
                            }
                          >
                            <FontAwesomeIcon
                              icon={['fas', 'check-circle']}
                              size="sm"
                            />
                            Complete
                          </button>
                        )}
                      </div>

                      <div className="grid-col-4 padding-x-0">
                        {workItem.showSendTo && (
                          <button
                            aria-controls={`forward-card-${idx}`}
                            aria-selected={documentDetailHelper.showAction(
                              'forward',
                              workItem.workItemId,
                            )}
                            className={`usa-button send-to ${
                              documentDetailHelper.showAction(
                                'forward',
                                workItem.workItemId,
                              )
                                ? 'selected'
                                : 'unselected'
                            }`}
                            data-workitemid={workItem.workItemId}
                            id={`forward-tab-${idx}`}
                            role="tab"
                            onClick={() =>
                              setWorkItemActionSequence({
                                action: 'forward',
                                workItemId: workItem.workItemId,
                              })
                            }
                          >
                            <FontAwesomeIcon icon="share-square" size="sm" />{' '}
                            Send To
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {documentDetailHelper.showAction(
                  'complete',
                  workItem.workItemId,
                ) && (
                  <div
                    aria-labelledby={`complete-tab-${idx}`}
                    className="content-wrapper actions-wrapper"
                    id={`complete-card-${idx}`}
                    role="tabpanel"
                  >
                    <form
                      noValidate
                      id={`complete-form-${idx}`}
                      role="form"
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
                      <label
                        className="usa-label"
                        htmlFor={`complete-message-${idx}`}
                      >
                        Add message <span className="usa-hint">(optional)</span>
                      </label>
                      <textarea
                        className="usa-textarea margin-bottom-5"
                        id={`complete-message-${idx}`}
                        name="completeMessage"
                        onChange={e => {
                          updateCompleteFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                            workItemId: workItem.workItemId,
                          });
                        }}
                      />

                      <Button type="submit">Complete</Button>
                    </form>
                  </div>
                )}
                {documentDetailHelper.showAction(
                  'history',
                  workItem.workItemId,
                ) &&
                  !workItem.historyMessages.length && (
                    <div
                      aria-labelledby={`history-tab-${idx}`}
                      className="content-wrapper actions-wrapper"
                      id={`history-card-${idx}`}
                      role="tabpanel"
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
                      aria-labelledby={`history-tab-${idx}`}
                      className="content-wrapper actions-wrapper"
                      id={`history-card-${idx}`}
                      role="tabpanel"
                    >
                      {workItem.historyMessages.map((message, mIdx) => (
                        <div key={mIdx}>
                          <div className="margin-bottom-1">
                            <span className="label-inline">To</span>
                            {message.to}
                          </div>
                          <div className="margin-bottom-1">
                            <span className="label-inline">From</span>
                            {message.from}
                          </div>
                          <div className="margin-bottom-1">
                            <span className="label-inline">Received</span>
                            {message.createdAtTimeFormatted}
                          </div>
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
                    className="content-wrapper actions-wrapper"
                    id={`forward-card-${idx}`}
                    role="tabpanel"
                  >
                    <form
                      noValidate
                      aria-labelledby={`forward-tab-${idx}`}
                      className="forward-form"
                      data-workitemid={workItem.workItemId}
                      role="form"
                      onSubmit={e => {
                        e.preventDefault();
                        submitForwardSequence({
                          workItemId: workItem.workItemId,
                        });
                      }}
                    >
                      <Select
                        error={
                          validationErrors[workItem.workItemId] &&
                          validationErrors[workItem.workItemId].section
                        }
                        formatter={workQueueSectionHelper.sectionDisplay}
                        id={`section-${idx}`}
                        keys={v => v}
                        label="Select section"
                        name="section"
                        values={constants.SECTIONS}
                        onChange={e => {
                          updateForwardFormValueSequence({
                            form: `form.${workItem.workItemId}`,
                            key: e.target.name,
                            section: e.target.value,
                            value: e.target.value,
                            workItemId: workItem.workItemId,
                          });
                          validateForwardMessageSequence({
                            workItemId: workItem.workItemId,
                          });
                        }}
                      />

                      {workItemMetadata.showChambersSelect && (
                        <Select
                          error={
                            validationErrors[workItem.workItemId] &&
                            validationErrors[workItem.workItemId].section
                          }
                          formatter={workQueueSectionHelper.chambersDisplay}
                          id={`chambers-${idx}`}
                          keys={v => v}
                          label="Select chambers"
                          name="chambers"
                          values={constants.CHAMBERS_SECTIONS}
                          onChange={e => {
                            updateForwardFormValueSequence({
                              form: `form.${workItem.workItemId}`,
                              key: e.target.name,
                              section: e.target.value,
                              value: e.target.value,
                              workItemId: workItem.workItemId,
                            });
                            validateForwardMessageSequence({
                              workItemId: workItem.workItemId,
                            });
                          }}
                        />
                      )}

                      <Select
                        aria-disabled={
                          !form[workItem.workItemId] ||
                          !form[workItem.workItemId].section
                            ? 'true'
                            : 'false'
                        }
                        disabled={
                          !form[workItem.workItemId] ||
                          !form[workItem.workItemId].section
                        }
                        error={
                          validationErrors[workItem.workItemId] &&
                          validationErrors[workItem.workItemId].assigneeId
                        }
                        formatter={user => user.name}
                        id={`assignee-id-${idx}`}
                        keys={user => user.userId}
                        label="Select recipient"
                        name="assigneeId"
                        values={users}
                        onChange={e => {
                          updateForwardFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                            workItemId: workItem.workItemId,
                          });
                          validateForwardMessageSequence({
                            workItemId: workItem.workItemId,
                          });
                        }}
                      />

                      <TextArea
                        aria-labelledby={`message-label-${idx}`}
                        className="margin-bottom-5"
                        error={
                          validationErrors[workItem.workItemId] &&
                          validationErrors[workItem.workItemId].forwardMessage
                        }
                        id={`forward-message-${idx}`}
                        label="Add message"
                        name="forwardMessage"
                        onChange={e => {
                          updateForwardFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                            workItemId: workItem.workItemId,
                          });
                          validateForwardMessageSequence({
                            workItemId: workItem.workItemId,
                          });
                        }}
                      />
                      <Button type="submit">Send</Button>
                    </form>
                  </div>
                )}
              </div>
            ),
          )}
      </div>
    );
  },
);
