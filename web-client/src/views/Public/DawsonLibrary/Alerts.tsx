import { AlertInfo, AlertWarning } from '@web-client/dawson-ui/ui/Alert/Alert';
import { Button } from '@web-client/dawson-ui/ui/button';
import { AlertError } from '@web-client/dawson-ui/ui/Alert/AlertError';
import { AlertSuccess } from '@web-client/dawson-ui/ui/Alert/AlertSuccess';
import React, { useState } from 'react';

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
    messagesDeduped: false,
  };
  return (
    <div className="tw:my-4">
      <h2>Alerts</h2>
      {/* Info Alert */}
      {alert.info ? (
        <AlertInfo
          closeButtonOnClick={() => setAlert({ ...alert, info: false })}
          title="info"
          className="tw:mb-4"
        >
          This is a succinct, helpful message
        </AlertInfo>
      ) : (
        <Button onClick={() => setAlert({ ...alert, info: true })}>
          Display Info Alert
        </Button>
      )}

      {/* Warning Alert */}
      {alert.warning ? (
        <AlertWarning
          closeButtonOnClick={() => setAlert({ ...alert, warning: false })}
          className="tw:mb-4"
          header="Warning Status"
        >
          This is a succinct, helpful message
          <ul>
            <li>This is a succinct, helpful message</li>
          </ul>
        </AlertWarning>
      ) : (
        <Button onClick={() => setAlert({ ...alert, warning: true })}>
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
        <Button onClick={() => setAlert({ ...alert, error: true })}>
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
        <Button onClick={() => setAlert({ ...alert, success: true })}>
          Display Success Alert
        </Button>
      )}

      {/* Static Alerts (with only descriptions) */}
      {staticAlerts.info ? (
        <AlertInfo
          closeButtonOnClick={() =>
            setStaticAlerts({ ...staticAlerts, info: false })
          }
          className="tw:mb-4"
        >
          You’ll need to change your password by April 25, 2020.
        </AlertInfo>
      ) : (
        <Button
          onClick={() => setStaticAlerts({ ...staticAlerts, info: true })}
        >
          Show Info Static Alert
        </Button>
      )}

      {staticAlerts.warning ? (
        <AlertWarning
          closeButtonOnClick={() =>
            setStaticAlerts({ ...staticAlerts, warning: false })
          }
          variant="warning"
          className="tw:mb-4"
        >
          You’ll need to change your password by April 25, 2020.
        </AlertWarning>
      ) : (
        <Button
          onClick={() => setStaticAlerts({ ...staticAlerts, warning: true })}
        >
          Show Warning Static Alert
        </Button>
      )}

      {staticAlerts.error ? (
        <AlertError
          alertError={{
            ...alertError,
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
        >
          Show Error Static Alert
        </Button>
      )}

      {staticAlerts.success ? (
        <AlertSuccess
          closeButtonOnClick={() =>
            setStaticAlerts({ ...staticAlerts, success: false })
          }
          variant="success"
          className="tw:mb-4"
        >
          You successfully changed your password.
        </AlertSuccess>
      ) : (
        <Button
          onClick={() => setStaticAlerts({ ...staticAlerts, success: true })}
        >
          Show Success Static Alert
        </Button>
      )}
    </div>
  );
}
