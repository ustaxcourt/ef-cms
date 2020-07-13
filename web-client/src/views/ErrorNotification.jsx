import { Focus } from '../ustc-ui/Focus/Focus';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
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
      <React.Fragment>
        {alertHelper.showErrorAlert && (
          <div
            aria-live="assertive"
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
                  {alertHelper.messagesDeduped.map((message, idx) => (
                    <li key={idx}>{message}</li>
                  ))}
                </ul>
              )}
              {alertHelper.showTitleOnly && (
                <div className="alert-blank-message" />
              )}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  },
);
