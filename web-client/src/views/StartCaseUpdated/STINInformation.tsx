import { Button } from '@web-client/ustc-ui/Button/Button';
import { CardHeader } from './CardHeader';
import React from 'react';

export function STINInformation({ petitionFormatted }) {
  return (
    <div className="border-top-1px padding-top-2 padding-bottom-2 height-full margin-bottom-0">
      <div className="content-wrapper">
        <CardHeader
          step={5}
          title="Statement of Taxpayer Identification Number"
        />
        <div>
          <Button
            link
            className="padding-0 text-left word-break"
            data-testid="stin-preview-button"
            href={petitionFormatted.stinFileUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {petitionFormatted.stinFile.name}
          </Button>
        </div>
      </div>
    </div>
  );
}
