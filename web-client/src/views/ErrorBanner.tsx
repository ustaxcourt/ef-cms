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
      <div className="usa-alert__body" style={{ paddingTop: '12px' }}>
        <p
          className="usa-alert__heading padding-top-0"
          data-testid="error-alert-title"
        >
          {title}
        </p>
        {showSingleMessage && (
          <p
            className="usa-alert__text"
            dangerouslySetInnerHTML={{ __html: messages[0] }}
            data-testid="error-alert-message"
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
