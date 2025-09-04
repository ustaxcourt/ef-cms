import { Button } from '@web-client/dawson-ui/ui/button';
import { BigHeader } from '@web-client/views/BigHeader';
import {
  Alert,
  AlertDescription,
  AlertHeader,
} from '@web-client/dawson-ui/ui/alert';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tag } from '@web-client/dawson-ui/ui/tag';

export const DawsonLibrary = () => {
  return (
    <>
      <BigHeader text="Dawson Library" />
      <div className="card margin-2 padding-2">
        <h2>Button</h2>

        <div className="tw:flex tw:flex-col tw:gap-4">
          {/* First row */}
          <div className="tw:flex tw:flex-wrap tw:gap-4">
            <Button variant={'primary'} className="tw:flex-shrink-0">
              <FontAwesomeIcon
                className="fa:margin-right-1"
                icon="file"
                size="1x"
              />
              Primary Default
            </Button>

            <Button variant={'secondary'} className="tw:flex-shrink-0">
              <FontAwesomeIcon
                className="fa:margin-right-1"
                icon="file"
                size="1x"
              />
              Secondary Default
            </Button>

            <Button variant={'destructive'} className="tw:flex-shrink-0">
              <FontAwesomeIcon
                className="fa:margin-right-1"
                icon="file"
                size="1x"
              />
              Destructive Default
            </Button>
          </div>

          {/* Second row */}
          <div className="tw:flex tw:flex-wrap tw:gap-4 tw:w-fit">
            <Button variant={'primaryTertiary'} className="tw:flex-shrink-0">
              <FontAwesomeIcon
                className="fa:margin-right-1"
                icon="file"
                size="1x"
              />
              Tertiary Default
            </Button>

            <Button
              variant={'destructiveTertiary'}
              className="tw:flex-shrink-0"
            >
              <FontAwesomeIcon
                className="fa:margin-right-1"
                icon="file"
                size="1x"
              />
              Tertiary Default
            </Button>
          </div>
        </div>
        <AlertContainer />

        <div className="tw:mt-4">
          <h2>Tag</h2>

          <div className="tw:bg-primary tw:p-5">
            <Tag
              variant="primary"
              className="tw:mr-[10px]"
              iconProps={{ icon: 'gavel' }}
            >
              TAG
            </Tag>

            <Tag variant="primary" className="tw:mr-[10px]">
              TAG
            </Tag>

            <Tag
              variant="destructive"
              className="tw:mr-[10px]"
              iconProps={{ icon: 'gavel' }}
            >
              TAG
            </Tag>
          </div>
        </div>
      </div>
    </>
  );
};

export function AlertContainer() {
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
    <div>
      <h2>Alerts</h2>
      {/* Info Alert */}
      {alert.info ? (
        <Alert
          closeButtonOnClick={() => setAlert({ ...alert, info: false })}
          variant="info"
          className="tw:mb-4"
        >
          <AlertHeader>Info Status</AlertHeader>
          <AlertDescription>
            This is a succinct, helpful message
          </AlertDescription>
        </Alert>
      ) : (
        <Button onClick={() => setAlert({ ...alert, info: true })}>
          Display Info Alert
        </Button>
      )}

      {/* Warning Alert */}
      {alert.warning ? (
        <Alert
          closeButtonOnClick={() => setAlert({ ...alert, warning: false })}
          variant="warning"
          className="tw:mb-4"
        >
          <AlertHeader>Warning Status</AlertHeader>
          <AlertDescription>
            This is a succinct, helpful message
            <ul>
              <li>This is a succinct, helpful message</li>
            </ul>
          </AlertDescription>
        </Alert>
      ) : (
        <Button onClick={() => setAlert({ ...alert, warning: true })}>
          Display Warning Alert
        </Button>
      )}

      {/* Error Alert */}
      {alert.error ? (
        <Alert
          closeButtonOnClick={() => setAlert({ ...alert, error: false })}
          variant="error"
          className="tw:mb-4"
        >
          <AlertHeader>Error Status</AlertHeader>
          <AlertDescription>
            This is a succinct, helpful message
          </AlertDescription>
        </Alert>
      ) : (
        <Button onClick={() => setAlert({ ...alert, error: true })}>
          Display Error Alert
        </Button>
      )}

      {/* Success Alert */}
      {alert.success ? (
        <Alert
          closeButtonOnClick={() => setAlert({ ...alert, success: false })}
          variant="success"
          className="tw:mb-4"
        >
          <AlertHeader>Success Status</AlertHeader>
          <AlertDescription>
            This is a succinct, helpful message
          </AlertDescription>
        </Alert>
      ) : (
        <Button onClick={() => setAlert({ ...alert, success: true })}>
          Display Success Alert
        </Button>
      )}

      {/* Static Alerts (with only descriptions) */}
      {/* Static Alerts (with only descriptions) */}
      {staticAlerts.info ? (
        <Alert
          closeButtonOnClick={() =>
            setStaticAlerts({ ...staticAlerts, info: false })
          }
          variant="info"
          className="tw:mb-4"
        >
          <AlertDescription>
            You’ll need to change your password by April 25, 2020.
          </AlertDescription>
        </Alert>
      ) : (
        <Button
          onClick={() => setStaticAlerts({ ...staticAlerts, info: true })}
        >
          Show Info Static Alert
        </Button>
      )}

      {staticAlerts.warning ? (
        <Alert
          closeButtonOnClick={() =>
            setStaticAlerts({ ...staticAlerts, warning: false })
          }
          variant="warning"
          className="tw:mb-4"
        >
          <AlertDescription>
            You’ll need to change your password by April 25, 2020.
          </AlertDescription>
        </Alert>
      ) : (
        <Button
          onClick={() => setStaticAlerts({ ...staticAlerts, warning: true })}
        >
          Show Warning Static Alert
        </Button>
      )}

      {staticAlerts.error ? (
        <Alert
          closeButtonOnClick={() =>
            setStaticAlerts({ ...staticAlerts, error: false })
          }
          variant="error"
          className="tw:mb-4"
        >
          <AlertDescription>
            Sorry, a password needs more than four characters.
          </AlertDescription>
        </Alert>
      ) : (
        <Button
          onClick={() => setStaticAlerts({ ...staticAlerts, error: true })}
        >
          Show Error Static Alert
        </Button>
      )}

      {staticAlerts.success ? (
        <Alert
          closeButtonOnClick={() =>
            setStaticAlerts({ ...staticAlerts, success: false })
          }
          variant="success"
          className="tw:mb-4"
        >
          <AlertDescription>
            You successfully changed your password.
          </AlertDescription>
        </Alert>
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
