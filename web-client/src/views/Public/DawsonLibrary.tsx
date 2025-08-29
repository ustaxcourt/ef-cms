import { Button } from '@web-client/dawson-ui/ui/button';
import { BigHeader } from '@web-client/views/BigHeader';
import {
  Alert,
  AlertDescription,
  AlertHeader,
} from '@web-client/dawson-ui/ui/alert';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const DawsonLibrary = () => {
  return (
    <>
      <BigHeader text="Dawson Library" />
      <div className="card margin-2 padding-2">
        <h2>Button</h2>

        <div>
          <div className="tw:inline tw:m-2">
            <Button variant={'primary'}>
              <FontAwesomeIcon
                className="fa:margin-right-1"
                icon="file"
                size="1x"
              />
              Primary Default
            </Button>
          </div>
          <div className="tw:inline tw:m-2">
            <Button variant={'secondary'}>
              <FontAwesomeIcon
                className="fa:margin-right-1"
                icon="file"
                size="1x"
              />
              Secondary Default
            </Button>
          </div>
          <div className="tw:inline tw:m-2">
            <Button variant={'destructive'}>
              <FontAwesomeIcon
                className="fa:margin-right-1"
                icon="file"
                size="1x"
              />
              Destructive Default
            </Button>
          </div>
          <div className="tw:inline tw:m-2">
            <Button variant={'primaryTertiary'}>
              <FontAwesomeIcon
                className="fa:margin-right-1"
                icon="file"
                size="1x"
              />
              Tertiary Default
            </Button>
          </div>
          <div className="tw:inline tw:m-2">
            <Button variant={'destructiveTertiary'}>
              <FontAwesomeIcon
                className="fa:margin-right-1"
                icon="file"
                size="1x"
              />
              Tertiary Default
            </Button>
          </div>
        </div>

        <div>
          <h2>Alerts</h2>
          <Alert variant="info" className="tw:mb-4">
            <AlertHeader>Info Status</AlertHeader>
            <AlertDescription>
              This is a succinct, helpful message
            </AlertDescription>
          </Alert>
          <Alert variant="warning" className="tw:mb-4">
            <AlertHeader>Warning Status</AlertHeader>
            <AlertDescription>
              This is a succinct, helpful message
              <ul>
                <li>This is a succinct, helpful message</li>
              </ul>
            </AlertDescription>
          </Alert>
          <Alert variant="error" className="tw:mb-4">
            <AlertHeader>Error Status</AlertHeader>
            <AlertDescription>
              This is a succinct, helpful message
            </AlertDescription>
          </Alert>
          <Alert variant="success" className="tw:mb-4">
            <AlertHeader>Success Status</AlertHeader>
            <AlertDescription>
              This is a succinct, helpful message
            </AlertDescription>
          </Alert>
          <Alert variant="info" className="tw:mb-4">
            <AlertDescription>
              You’ll need to change your password by April 25, 2020.
            </AlertDescription>
          </Alert>
          <Alert variant="warning" className="tw:mb-4">
            <AlertDescription>
              You’ll need to change your password by April 25, 2020.
            </AlertDescription>
          </Alert>
          <Alert variant="error" className="tw:mb-4">
            <AlertDescription>
              Sorry, a password needs more than four characters.
            </AlertDescription>
          </Alert>
          <Alert variant="success" className="tw:mb-4">
            <AlertDescription>
              You successfully changed your password.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </>
  );
};
