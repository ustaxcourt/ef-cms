import { AlertWarning } from '@web-client/dawson-ui/ui/Alert/AlertWarning';
import React from 'react';

export function PIIRedactedWarning() {
  return (
    <AlertWarning
      alertWarning={{
        message:
          'Ensure that personal information (such as Social Security Numbers, Taxpayer Identification Numbers, Employer Identification Numbers) has been removed or redacted.',
      }}
      className="tw:mb-8"
      isDismissible={false}
      scrollToTop={false}
    />
  );
}
