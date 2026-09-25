import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ErrorNotification as ConnectedErrorNotification } from './ErrorNotification';
import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';

jest.mock('@web-client/presenter/shared.cerebral', () => ({
  connect: (_bindings: unknown, component: unknown) => component,
}));

jest.mock('../ustc-ui/Focus/Focus', () => ({
  Focus: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

let capturedCloseHandler: (() => void) | undefined;

jest.mock('../ustc-ui/Button/Button', () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    [key: string]: unknown;
  }) => {
    if (children === 'Close') {
      capturedCloseHandler = onClick;
    }

    return (
      <button type="button" onClick={onClick} {...props}>
        {children}
      </button>
    );
  },
}));

type ErrorNotificationProps = {
  alertError?: {
    title?: string;
    titleClass?: string;
    message?: string;
    messageClass?: string;
    className?: string;
  };
  alertHelper: {
    insertContactSupportClause: boolean;
    messagesDeduped: string[];
    showErrorAlert?: boolean;
    showMultipleMessages?: boolean;
    showSingleMessage?: boolean;
    showTitleOnly?: boolean;
  };
  dismissAlertSequence?: () => void;
};

const ErrorNotification =
  ConnectedErrorNotification as unknown as React.FC<ErrorNotificationProps>;

describe('ErrorNotification', () => {
  const dismissAlertSequence = jest.fn();

  const baseHelper: ErrorNotificationProps['alertHelper'] = {
    insertContactSupportClause: false,
    messagesDeduped: [],
    showErrorAlert: true,
    showMultipleMessages: false,
    showSingleMessage: false,
    showTitleOnly: false,
  };

  const renderMarkup = ({
    alertError,
    alertHelper = baseHelper,
  }: {
    alertError?: ErrorNotificationProps['alertError'];
    alertHelper?: ErrorNotificationProps['alertHelper'];
  }): string => {
    return renderToStaticMarkup(
      <ErrorNotification
        alertError={alertError}
        alertHelper={alertHelper}
        dismissAlertSequence={dismissAlertSequence}
      />,
    );
  };

  beforeEach(() => {
    dismissAlertSequence.mockClear();
    capturedCloseHandler = undefined;
  });

  it('should not render when there is no alert error', () => {
    const markup = renderMarkup({});

    expect(markup).not.toContain('error-alert');
  });

  it('should apply class overrides for the alert, title, and message', () => {
    const markup = renderMarkup({
      alertError: {
        className: 'tw:max-w-[547px]!',
        message: 'Payment cannot be started',
        messageClass: 'tw:text-xl',
        title: 'Error: payment cannot be started.',
        titleClass: 'tw:font-bold',
      },
      alertHelper: {
        ...baseHelper,
        showSingleMessage: true,
      },
    });

    expect(markup).toContain('usa-alert usa-alert--error tw:max-w-[547px]!');
    expect(markup).toContain('usa-alert__heading tw:font-bold');
    expect(markup).toContain('usa-alert__text tw:text-xl');
    expect(markup).toContain('Error: payment cannot be started.');
    expect(markup).toContain('Payment cannot be started');
  });

  it('should render a single message', () => {
    const markup = renderMarkup({
      alertError: {
        message: 'Something went wrong',
        title: 'Error',
      },
      alertHelper: {
        ...baseHelper,
        showSingleMessage: true,
      },
    });

    expect(markup).toContain('Something went wrong');
    expect(markup).not.toContain('<ul>');
    expect(markup).not.toContain('alert-blank-message');
  });

  it('should render multiple messages', () => {
    const markup = renderMarkup({
      alertError: {
        title: 'Error',
      },
      alertHelper: {
        ...baseHelper,
        messagesDeduped: ['First problem', 'Second problem'],
        showMultipleMessages: true,
      },
    });

    expect(markup).toContain('<ul>');
    expect(markup).toContain('First problem');
    expect(markup).toContain('Second problem');
  });

  it('should render title-only content', () => {
    const markup = renderMarkup({
      alertError: {
        title: 'Error',
      },
      alertHelper: {
        ...baseHelper,
        showTitleOnly: true,
      },
    });

    expect(markup).toContain('alert-blank-message');
    expect(markup).not.toContain('<ul>');
  });

  it('should render the contact support clause when enabled', () => {
    const markup = renderMarkup({
      alertError: {
        message: 'Please try again.',
        title: 'Error',
      },
      alertHelper: {
        ...baseHelper,
        insertContactSupportClause: true,
        showSingleMessage: true,
      },
    });

    expect(markup).toContain('Contact');
    expect(markup).toContain(TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL);
    expect(markup).toContain(
      `mailto:${TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}`,
    );
  });

  it('should call dismissAlertSequence when Close is clicked', () => {
    renderMarkup({
      alertError: {
        message: 'Something went wrong',
        title: 'Error',
      },
      alertHelper: {
        ...baseHelper,
        showSingleMessage: true,
      },
    });

    expect(capturedCloseHandler).toBeDefined();
    capturedCloseHandler!();

    expect(dismissAlertSequence).toHaveBeenCalledTimes(1);
  });
});
