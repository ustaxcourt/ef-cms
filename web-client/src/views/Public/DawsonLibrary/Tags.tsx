import { Tag } from '@web-client/dawson-ui/ui/tag';
import React from 'react';

export function Tags() {
  return (
    <div className="tw:my-4">
      <h2>Tag</h2>

      <div className="tw:bg-primary tw:p-5">
        <Tag
          variant="primary"
          aria-label="associated judge"
          className="tw:mr-2.5"
          iconProps={{ icon: 'gavel' }}
        >
          Tag
        </Tag>

        <Tag variant="primary" className="tw:mr-2.5">
          TAG
        </Tag>

        <Tag
          variant="destructive"
          className="tw:mr-2.5"
          iconProps={{ icon: 'hand-paper' }}
          data-testid="blocked-case-icon"
        >
          Blocked
        </Tag>
      </div>
    </div>
  );
}
