import { Button } from '@web-client/dawson-ui/ui/button';
import { AlertError } from '@web-client/dawson-ui/ui/Alert/AlertError';
import { AlertSuccess } from '@web-client/dawson-ui/ui/Alert/AlertSuccess';
import React, { useState } from 'react';
import { AlertWarning } from '@web-client/dawson-ui/ui/Alert/AlertWarning';
import { AlertInfo } from '@web-client/dawson-ui/ui/Alert/AlertInfo';

export function Alerts() {
  const [alert, setAlert] = useState({
    info: true,
    warning: true,
    error: true,
    success: true,
  });

  const [staticAlerts, setStaticAlerts] = useState({
    info: true,
    warning: true,
    error: true,
    success: true,
  });

  const alertError = {
    title: 'Error Alert',
    message: 'This is a succinct, helpful message',
    scrollToErrorNotification: false,
  };

  const alertHelper = {
    showErrorAlert: true,
    showSingleMessage: true,
    showMultipleMessages: false,
    showTitleOnly: false,
    messagesDeduped: [],
  };

  const alertInfoProps = {
    alertInfo: {
      title: 'Alert Info',
      linkText: '',
      linkUrl: '',
      inlineLinkText: '',
      inlineLinkUrl: '',
      message: 'This is a succinct informational message',
      dismissText: '',
      dismissIcon: '',
    },
    dismissible: true,
    messageNotBold: true,
    className: 'tw:mb-4',
  };

  return (
    <div className="tw:my-4">
      <h2>Alerts</h2>
      {alert.info ? (
        <AlertInfo {...alertInfoProps}></AlertInfo>
      ) : (
        <Button onClick={() => setAlert({ ...alert, info: true })}>
          Display Info Alert
        </Button>
      )}
      {/* Warning Alert */}
      {alert.warning ? (
        <AlertWarning
          dismissAlertSequence={() => setAlert({ ...alert, warning: false })}
          className="tw:mb-4"
          alertWarning={{
            title: 'Warning Status',
            message: (
              <>
                This is a succinct, helpful message
                <ul>
                  <li>This is a succinct, helpful message</li>
                </ul>
              </>
            ),
          }}
        />
      ) : (
        <Button
          className="tw:mb-4 tw:mr-4"
          onClick={() => setAlert({ ...alert, warning: true })}
        >
          Display Warning Alert
        </Button>
      )}
      {/* Error Alert */}
      {alert.error ? (
        <AlertError
          closeButtonOnClick={() => setAlert({ ...alert, error: false })}
          className="tw:mb-4"
          alertError={alertError}
          alertHelper={alertHelper}
        />
      ) : (
        <Button
          onClick={() => setAlert({ ...alert, error: true })}
          className="tw:mb-4 tw:mr-4"
        >
          Display Error Alert
        </Button>
      )}
      {/* Success Alert */}
      {alert.success ? (
        <AlertSuccess
          alertSuccess={{
            title: 'Success Status',
            message: 'This is a succinct, helpful message',
          }}
          dismissAlertSequence={() => setAlert({ ...alert, success: false })}
          className="tw:mb-4"
        ></AlertSuccess>
      ) : (
        <Button
          onClick={() => setAlert({ ...alert, success: true })}
          className="tw:mb-4 tw:mr-4"
        >
          Display Success Alert
        </Button>
      )}
      {/* Static Alerts (with only descriptions) */}
      {staticAlerts.info ? (
        <AlertInfo
          alertInfo={{
            message: 'You’ll need to change your password by April 25, 2020.',
          }}
          isDismissible
          dismissAlertSequence={() =>
            setStaticAlerts({ ...staticAlerts, info: false })
          }
          className="tw:mb-4"
        />
      ) : (
        <Button
          onClick={() => setStaticAlerts({ ...staticAlerts, info: true })}
        >
          Show Info Static Alert
        </Button>
      )}
      {staticAlerts.warning ? (
        <AlertWarning
          dismissAlertSequence={() =>
            setStaticAlerts({ ...staticAlerts, warning: false })
          }
          className="tw:mb-4"
          alertWarning={{
            message: 'You’ll need to change your password by April 25, 2020.',
          }}
        />
      ) : (
        <Button
          onClick={() => setStaticAlerts({ ...staticAlerts, warning: true })}
          className="tw:mb-4 tw:mr-4"
        >
          Show Warning Static Alert
        </Button>
      )}
      {staticAlerts.error ? (
        <AlertError
          alertError={{
            message: 'Sorry, a password needs more than four characters.',
          }}
          alertHelper={alertHelper}
          closeButtonOnClick={() =>
            setStaticAlerts({ ...staticAlerts, error: false })
          }
          className="tw:mb-4"
        ></AlertError>
      ) : (
        <Button
          onClick={() => setStaticAlerts({ ...staticAlerts, error: true })}
          className="tw:mb-4 tw:mr-4"
        >
          Show Error Static Alert
        </Button>
      )}
      {staticAlerts.success ? (
        <AlertSuccess
          alertSuccess={{
            message: 'This is a succinct, helpful message',
          }}
          dismissAlertSequence={() =>
            setStaticAlerts({ ...staticAlerts, success: false })
          }
          className="tw:mb-4"
        />
      ) : (
        <Button
          onClick={() => setStaticAlerts({ ...staticAlerts, success: true })}
          className="tw:mb-4 tw:mr-4"
        >
          Show Success Static Alert
        </Button>
      )}
    </div>
  );
}
