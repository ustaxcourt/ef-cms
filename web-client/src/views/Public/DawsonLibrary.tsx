import { Button } from '@web-client/dawson-ui/ui/button';
import { BigHeader } from '@web-client/views/BigHeader';
import { Alert } from '@web-client/dawson-ui/ui/alert';
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
          <h2 className="tw:my-4">Alerts:</h2>
          <Alert
            title="this displays when you hover"
            variant="info"
            header="This is a header"
            description="This is a description"
          ></Alert>
          <Alert
            title="this displays when you hover"
            variant="warning"
            header="This is a header"
            description="This is a description"
          ></Alert>
          <Alert
            title="this displays when you hover"
            variant="error"
            header="This is a header"
            description="This is a description"
          ></Alert>
          <Alert
            title="this displays when you hover"
            variant="success"
            header="This is a header"
            description="This is a description"
          ></Alert>
        </div>
      </div>
    </>
  );
};
