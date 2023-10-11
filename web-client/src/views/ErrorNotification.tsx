import { Focus } from '../ustc-ui/Focus/Focus';
import { connect } from '@cerebral/react';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';

export const ErrorNotification = connect(
  {
    alertError: state.alertError,
    alertHelper: state.alertHelper,
  },
  function ErrorNotification({ alertError, alertHelper }) {
    const notificationRef = useRef(null);

    useEffect(() => {
      const notification = notificationRef.current;
      if (notification && !alertHelper.preventAutoScroll) {
        window.scrollTo(0, 0);
      }
    });

    return (
      <>
        {alertHelper.showErrorAlert && (
          <div
            aria-live="polite"
            className="usa-alert usa-alert--error"
            ref={notificationRef}
            role="alert"
          >
            <div className="usa-alert__body">
              <Focus>
                <h3 className="usa-alert__heading">{alertError.title}</h3>
              </Focus>
              {alertHelper.showSingleMessage && (
                <p className="usa-alert__text">{alertError.message}</p>
              )}
              {alertHelper.showMultipleMessages && (
                <ul>
                  {alertHelper.messagesDeduped.map(message => {
                    if (message.includes('validation error mismatch')) {
                      const errorObject = JSON.parse(message);
                      return (
                        <div key={errorObject.entityName}>
                          <br />
                          <b>Validation message mismatch</b>
                          <p>
                            Please take a screenshot of this page and add to
                            Devex Card{' '}
                            <a href="https://trello.com/c/J4S7ZhKx/1187-convert-validation-messages-for-entities-to-using-joi-syntax">
                              1187
                            </a>
                          </p>
                          <p>Entity Name: {errorObject.entityName}</p>
                          <p>
                            Old Results:{' '}
                            {JSON.stringify(errorObject.oldResults, null, 2)}
                          </p>
                          <p>
                            New Results:{' '}
                            {JSON.stringify(errorObject.newResults, null, 2)}
                          </p>
                        </div>
                      );
                    }
                    return <li key={message}>{message}</li>;
                  })}
                </ul>
              )}
              {alertHelper.showTitleOnly && (
                <div className="alert-blank-message" />
              )}
            </div>
          </div>
        )}
      </>
    );
  },
);

ErrorNotification.displayName = 'ErrorNotification';
