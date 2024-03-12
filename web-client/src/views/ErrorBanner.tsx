import { Focus } from '../ustc-ui/Focus/Focus';
import React from 'react';

export function ErrorBanner({
  messages,
  showMultipleMessages,
  showSingleMessage,
  showTitleOnly,
  title,
}: {
  messages: string[];
  showMultipleMessages?: boolean;
  showSingleMessage?: boolean;
  showTitleOnly?: boolean;
  title: string;
}) {
  return (
    <div
      aria-live="polite"
      className="usa-alert usa-alert--error"
      data-testid="error-alert"
      role="alert"
    >
      <div className="usa-alert__body">
        <Focus>
          <h3 className="usa-alert__heading">{title}</h3>
        </Focus>
        {showSingleMessage && (
          <p
            className="usa-alert__text"
            dangerouslySetInnerHTML={{ __html: messages[0] }}
          />
        )}
        {showMultipleMessages && (
          <ul>
            {messages.map(message => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}
        {showTitleOnly && <div className="alert-blank-message" />}
      </div>
    </div>
  );
}
