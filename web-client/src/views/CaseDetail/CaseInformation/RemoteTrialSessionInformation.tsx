import { applicationContext } from '@web-client/applicationContext';
import React from 'react';

export const RemoteTrialSessionInformation = ({
  remoteTrialGrantedDate,
}: {
  remoteTrialGrantedDate?: string | null;
}) => {
  const date = remoteTrialGrantedDate
    ? applicationContext
        .getUtilities()
        .formatDateString(remoteTrialGrantedDate, 'MMDDYYYY')
    : '';

  return remoteTrialGrantedDate ? (
    <div>
      <p className="text-semibold margin-bottom-0 Dawson_body Dawson_body_secondary">
        Motion to proceed remotely granted date
      </p>
      <p className="text-ink">{date}</p>
    </div>
  ) : null;
};

RemoteTrialSessionInformation.displayName = 'RemoteTrialSessionInformation';
