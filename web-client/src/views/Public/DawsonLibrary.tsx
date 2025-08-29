import { Button } from '@web-client/dawson-ui/ui/button';
import { BigHeader } from '@web-client/views/BigHeader';
import {
  Alert,
  AlertDescription,
  AlertHeader,
} from '@web-client/dawson-ui/ui/alert';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tag } from '@web-client/dawson-ui/ui/tag';

export const DawsonLibrary = () => {
  return (
    <>
      <BigHeader text="Dawson Library" />
      <div className="card margin-2 padding-2">
        <div>
          <h2>Button</h2>

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

        <div className="tw:mt-4">
          <h2>Tag</h2>

          <Tag variant="primary">
            <FontAwesomeIcon
              className="fa:margin-right-1"
              icon="gavel"
              size="1x"
            />
            TAG
          </Tag>
        </div>
      </div>
    </>
  );
};
