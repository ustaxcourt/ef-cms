import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import React from 'react';

export const NoticeOfChangeOfTrialLocation = ({
  docketNumberWithSuffix,
  trialSession,
}: {
  docketNumberWithSuffix: string;
  trialSession: RawTrialSession;
}) => {
  return (
    <div>
      TEST WIP THIS IS WHERE WE SEE LOCATION CHANGE INFO{' '}
      {docketNumberWithSuffix}, {trialSession.trialSessionId}
    </div>
  );
};
