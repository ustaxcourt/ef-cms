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

  const alertHelper = {
    showErrorAlert: true,
    showSingleMessage: true,
    showMultipleMessages: false,
    showTitleOnly: false,
    messagesDeduped: [],
  };

  return (
    <div className="tw:my-4">
      <h2>Alerts</h2>
      {alert.info ? (
        <AlertInfo
          alertInfo={{
            title: 'Info Status',
            message: 'This is a succinct, helpful message',
          }}
          className="tw:mb-4"
        ></AlertInfo>
      ) : (
        <Button
          onClick={() => setAlert({ ...alert, info: true })}
          variant="primary"
        >
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
          variant="primary"
        >
          Display Warning Alert
        </Button>
      )}
      {/* Error Alert */}
      {alert.error ? (
        <AlertError
          closeButtonOnClick={() => setAlert({ ...alert, error: false })}
          className="tw:mb-4"
          alertError={{
            title: 'Error Status',
            message:
              'This is a very succinct, & helpful message. I love how helpful this message is its the very best',
            scrollToErrorNotification: false,
          }}
          alertHelper={alertHelper}
        />
      ) : (
        <Button
          onClick={() => setAlert({ ...alert, error: true })}
          className="tw:mb-4 tw:mr-4"
          variant="primary"
        >
          Display Error Alert
        </Button>
      )}
      {/* Success Alert */}
      {alert.success ? (
        <AlertSuccess
          alertSuccess={{
            title: 'Success Status when I need success and here is the success',
            message: 'This is a succinct, helpful message!!!!!!!!!!!!!',
          }}
          dismissAlertSequence={() => setAlert({ ...alert, success: false })}
          className="tw:mb-4"
        ></AlertSuccess>
      ) : (
        <Button
          onClick={() => setAlert({ ...alert, success: true })}
          className="tw:mb-4 tw:mr-4"
          variant="primary"
        >
          Display Success Alert
        </Button>
      )}
      {/* Static Alerts (with only descriptions) */}
      {staticAlerts.info ? (
        <AlertInfo
          alertInfo={{
            message: 'This is a succinct, helpful message.',
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
          variant="primary"
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
            message: 'This is a succinct, helpful algae.',
          }}
        />
      ) : (
        <Button
          onClick={() => setStaticAlerts({ ...staticAlerts, warning: true })}
          className="tw:mb-4 tw:mr-4"
          variant="primary"
        >
          Show Warning Static Alert
        </Button>
      )}
      {staticAlerts.error ? (
        <AlertError
          alertError={{
            message: 'This is a succinct, helpful message.',
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
          variant="primary"
        >
          Show Error Static Alert
        </Button>
      )}
      {staticAlerts.success ? (
        <AlertSuccess
          alertSuccess={{
            message: 'This is a succinct, helpful message.',
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
          variant="primary"
        >
          Show Success Static Alert
        </Button>
      )}
    </div>
  );
}
