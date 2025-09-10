import {
  AlertError, AlertInfo, AlertSuccess, AlertWarning
} from '@web-client/dawson-ui/ui/Alert/Alert';
import { Button } from '@web-client/dawson-ui/ui/button';

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
          header='Warning Status'
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
          header='Error Status'
        >
            This is a succinct, helpful message
        </AlertError>
      ) : (
        <Button onClick={() => setAlert({ ...alert, error: true })}>
          Display Error Alert
        </Button>
      )}

      {/* Success Alert */}
      {alert.success ? (
        <AlertSuccess
          closeButtonOnClick={() => setAlert({ ...alert, success: false })}
          className="tw:mb-4"
          header='Success Status'
        >
            This is a succinct, helpful message
        </AlertSuccess>
      ) : (
        <Button onClick={() => setAlert({ ...alert, success: true })}>
          Display Success Alert
        </Button>
      )}

      {/* Static Alerts (with only descriptions) */}
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
          closeButtonOnClick={() =>
            setStaticAlerts({ ...staticAlerts, error: false })
          }
          variant="error"
          className="tw:mb-4"
        >
            Sorry, a password needs more than four characters.
        </AlertError>
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
