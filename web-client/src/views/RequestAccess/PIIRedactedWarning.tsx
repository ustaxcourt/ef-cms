import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import React from 'react';

export function PIIRedactedWarning() {
  return (
    <WarningNotificationComponent
      alertWarning={{
        message:
          'Ensure that personal information (such as Social Security Numbers, Taxpayer Identification Numbers, Employer Identification Numbers) has been removed or redacted.',
      }}
      dismissable={false}
      scrollToTop={false}
    />
  );
}
