import { Focus } from '../ustc-ui/Focus/Focus';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';

export const ErrorNotification = connect(
  {
    alertError: state.alertError,
    alertHelper: state.alertHelper,
  },
  function ErrorNotification({
    alertError,
    alertHelper,
  }: {
    alertError?: {
      title?: string;
      message?: string;
    };
    alertHelper: {
      preventAutoScroll?: boolean;
      showErrorAlert?: boolean;
      showSingleMessage?: boolean;
      showMultipleMessages?: boolean;
      showTitleOnly?: boolean;
      messagesDeduped: any;
    };
  }) {
    const notificationRef = useRef(null);

    useEffect(() => {
      const notification = notificationRef.current;
      if (notification && !alertHelper.preventAutoScroll) {
        window.scrollTo(0, 0);
      }
    });

    return (
      <>
        {alertError && alertHelper.showErrorAlert && (
          <div
            aria-live="polite"
            className="usa-alert usa-alert--error"
            data-testid="error-alert"
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
                  {alertHelper.messagesDeduped.map(message => (
                    <li key={message}>{message}</li>
                  ))}
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
