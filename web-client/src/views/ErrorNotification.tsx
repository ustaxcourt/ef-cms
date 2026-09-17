import { Button } from '../ustc-ui/Button/Button';
import { Focus } from '../ustc-ui/Focus/Focus';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';
import classNames from 'classnames';

export const ErrorNotification = connect(
  {
    alertError: state.alertError,
    alertHelper: state.alertHelper,
    dismissAlertSequence: sequences.dismissAlertSequence,
  },
  function ErrorNotification({
    alertError,
    alertHelper,
    dismissAlertSequence = sequences.dismissAlertSequence,
  }: {
    alertError?: {
      title?: string;
      titleClass?: string;
      message?: string;
      messageClass?: string;
      className?: string;
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
    dismissAlertSequence?: Function;
  }) {
    const notificationRef = useRef(null);

    useEffect(() => {
      const notification = notificationRef.current;
      if (notification && alertError?.scrollToErrorNotification) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    });

    const alertClassName = classNames(
      'usa-alert',
      'usa-alert--error',
      alertError?.className,
    );
    const titleClassName = classNames(
      'usa-alert__heading',
      alertError?.titleClass,
    );
    const messageClassName = classNames(
      'usa-alert__text',
      alertError?.messageClass,
    );

    return (
      <>
        {alertError && alertHelper.showErrorAlert && (
          <div
            aria-live="polite"
            className={alertClassName}
            data-testid="error-alert"
            ref={notificationRef}
            role="alert"
          >
            <div className="usa-alert__body">
              <div className="grid-container padding-x-0">
                <div className="grid-row flex-align-start">
                  <div className="tablet:grid-col-9 grid-col-8">
                    <Focus>
                      <h3 className={titleClassName}>{alertError.title}</h3>
                    </Focus>
                    {alertHelper.showSingleMessage && (
                      <p className={messageClassName}>
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
                      </ul>
                    )}
                    {alertHelper.showTitleOnly && (
                      <div className="alert-blank-message" />
                    )}
                  </div>
                  <div className="tablet:grid-col-3 grid-col-4 usa-alert__action display-flex flex-justify-end flex-align-start padding-right-105 no-wrap-white-space">
                    <Button
                      link
                      className="padding-0 no-wrap-white-space"
                      icon="times-circle"
                      iconRight
                      onClick={() => dismissAlertSequence()}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
);

ErrorNotification.displayName = 'ErrorNotification';
