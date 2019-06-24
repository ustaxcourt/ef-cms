import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CompletedMessages = connect(
  {
    documentDetailHelper: state.documentDetailHelper,
  },
  ({ documentDetailHelper }) => {
    return (
      <div className="blue-container">
        {(!documentDetailHelper.formattedDocument ||
          !documentDetailHelper.formattedDocument.completedWorkItems ||
          !documentDetailHelper.formattedDocument.completedWorkItems
            .length) && (
          <div>
            There are no completed messages associated with this document.
          </div>
        )}
        {documentDetailHelper.formattedDocument &&
          documentDetailHelper.formattedDocument.completedWorkItems &&
          documentDetailHelper.formattedDocument.completedWorkItems.map(
            (workItem, idx) => (
              <div
                className="card completed-card"
                aria-labelledby="tab-pending-messages"
                key={idx}
              >
                <div className="content-wrapper">
                  <div className="completed-icon">
                    <FontAwesomeIcon icon={['fas', 'check-circle']} />
                  </div>
                  <div className="completed-content">
                    {workItem.completedBy && (
                      <React.Fragment>
                        <div>
                          <span className="label-inline">
                            Closed by {workItem.completedBy}
                          </span>
                        </div>
                        <div>
                          <span className="label-inline">
                            {workItem.completedAtFormatted}
                          </span>
                        </div>
                        {workItem.completedMessage && (
                          <div className="completed-message">
                            <span>{workItem.completedMessage}</span>
                          </div>
                        )}
                      </React.Fragment>
                    )}
                    {workItem.completedMessage === 'Served on IRS' && (
                      <p>
                        <span className="label-inline">
                          Served on IRS at {workItem.completedAtFormatted}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="content-wrapper gray">
                  {workItem.messages.map((message, messageIdx) => (
                    <React.Fragment key={messageIdx}>
                      <div className={`workitem-${workItem.workItemId}`}>
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
                        <div className="completed-message">
                          {message.message}
                        </div>
                      </div>
                      {messageIdx < workItem.messages.length - 1 && <hr />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ),
          )}
      </div>
    );
  },
);
