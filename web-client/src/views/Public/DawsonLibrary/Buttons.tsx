import { Button } from '@web-client/dawson-ui/ui/button';
import React from 'react';

export function Buttons() {
  return (
    <div className="tw:my-4">
      <h2>Buttons</h2>

      <div>
        <div className="tw:xs:inline-block tw:m-4 tw:xs:m-2">
          <Button variant="primary" icon="file" aria-label="Primary Default">
            Primary Default
          </Button>
        </div>
        <div className="tw:xs:inline-block tw:m-4 tw:xs:m-2">
          <Button
            variant="secondary"
            icon="file"
            aria-label="Secondary Default"
          >
            Secondary Default
          </Button>
        </div>
        <div className="tw:xs:inline-block tw:m-4 tw:xs:m-2">
          <Button
            variant="destructive"
            icon="file"
            aria-label="Destructive Default"
          >
            Destructive Default
          </Button>
        </div>
        <div className="tw:xs:inline-block tw:m-4 tw:xs:m-2">
          <Button
            variant="primaryTertiary"
            icon="file"
            aria-label="Tertiary Default"
          >
            Tertiary Default
          </Button>
        </div>
        <div className="tw:xs:inline-block tw:m-4 tw:xs:m-2">
          <Button
            variant="destructiveTertiary"
            icon="file"
            aria-label="Tertiary Default"
          >
            Tertiary Default
          </Button>
        </div>
        <div className="tw:xs:inline-block tw:m-4 tw:xs:m-2">
          <Button variant="terminatorButton" aria-label="Terminator Button">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
