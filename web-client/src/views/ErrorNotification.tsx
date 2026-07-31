import { Focus } from '../ustc-ui/Focus/Focus';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';

export const ErrorNotification = connect(
  { alertError: state.alertError, alertHelper: state.alertHelper },
  function ErrorNotification({
    alertError,
    alertHelper,
  }: {
    alertError?: {
      title?: string;
      message?: string;
      scrollToErrorNotification?: boolean;
      insertContactSupportClause?: boolean;
    };
    alertHelper: {
      showErrorAlert?: boolean;
      showSingleMessage?: boolean;
      showMultipleMessages?: boolean;
      showTitleOnly?: boolean;
      messagesDeduped: any;
      insertContactSupportClause: boolean;
    };
  }) {
    const notificationRef = useRef(null);

    useEffect(() => {
      const notification = notificationRef.current;
      if (notification && alertError?.scrollToErrorNotification) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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
                <p className="usa-alert__text">
                  {alertError.message}
                  {alertHelper.insertContactSupportClause && (
                    <span>
                      {' '}
                      Contact{' '}
                      <a
                        href={`mailto:${TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}`}
                      >
                        {TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}
                      </a>
                      .
                    </span>
                  )}
                </p>
              )}
              {alertHelper.showMultipleMessages && (
                <ul>
                  {alertHelper.messagesDeduped.map(message => (
                    <li key={message}>{message}</li>
                  ))}
                  {alertHelper.insertContactSupportClause && (
                    <li>
                      Contact{' '}
                      <a
                        href={`mailto:${TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}`}
                      >
                        {TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}
                      </a>
                      .
                    </li>
                  )}
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
