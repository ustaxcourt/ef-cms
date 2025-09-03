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

        <div>
          <h2>Alerts</h2>
          <Alert variant="info">
            <AlertHeader>This is a header</AlertHeader>
            <AlertDescription>This is a description</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertDescription>This is a description</AlertDescription>
          </Alert>
          <Alert variant="error">
            <AlertHeader>
              This is a really long header This is a really long header This is
              a really long header This is a really long header This is a really
              long header This is a really long header This is a really long
              header
            </AlertHeader>
            <AlertDescription>
              <ul className="list-inside list-disc text-sm">
                <li>An example with a list inside of the description</li>
                <li>Another list item here to demonstrate usage</li>
                <li>Any markup can go inside a description</li>
              </ul>
            </AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertHeader>This is a header</AlertHeader>
            <AlertDescription>This is a description</AlertDescription>
          </Alert>
        </div>
      </div>
    </>
  );
};
