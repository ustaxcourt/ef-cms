import { Button } from '@web-client/dawson-ui/ui/button';
import { CircleXmark } from '@web-client/dawson-ui/ui/icons';
import React from 'react';

export function Buttons() {
  function closeButtonOnClick(_event: React.MouseEvent<HTMLButtonElement>): void {
    throw new Error('Function not implemented.');
  }

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

        <div className="tw:xs:inline-block tw:m-4 tw:xs:m-2 tw:mb-6">
        <Button
          
          variant={'primaryTertiary'}
          onClick={closeButtonOnClick}
        >
          <div className="tw:flex tw:items-center tw:text-sm/3 tw:xs:text-base/4 tw:hover:text-primary-dark tw:active:text-primary-darker tw:active:fill-primary-darker tw:hover:fill-primary-dark tw:xs:mt-1.25">
            <span className="tw:mr-2">Close</span>
            <CircleXmark className="tw:!h-[14px] tw:!w-[14px] tw:xs:!h-[16px] tw:xs:!w-[16px]"/>
          </div>
        </Button>
        </div>
      </div>
    </div>
  );
}
