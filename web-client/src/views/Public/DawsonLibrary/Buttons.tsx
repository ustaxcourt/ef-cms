import { Button } from '@web-client/dawson-ui/ui/button';
import React from 'react';

export function Buttons() {
  return (
    <div className="tw:my-4">
      <h2>Buttons</h2>

      <div>
        <div className="tw:xs:inline-block tw:m-4 tw:xs:m-2">
          <Button
            variant="primary"
            icon="file"
            aria-label="Primary Default"
            title="Primary Default"
          >
            Primary Default
          </Button>
        </div>
        <div className="tw:xs:inline-block tw:m-4 tw:xs:m-2">
          <Button variant="secondary" icon="file">
            Secondary Default
          </Button>
        </div>
        <div className="tw:xs:inline-block tw:m-4 tw:xs:m-2">
          <Button variant="destructive" icon="file">
            Destructive Default
          </Button>
        </div>
        <div className="tw:xs:inline-block tw:m-4 tw:xs:m-2">
          <Button variant="primaryTertiary" icon="file">
            Tertiary Default
          </Button>
        </div>
        <div className="tw:xs:inline-block tw:m-4 tw:xs:m-2">
          <Button variant="destructiveTertiary" icon="file">
            Tertiary Default
          </Button>
        </div>
      </div>
    </div>
  );
}
