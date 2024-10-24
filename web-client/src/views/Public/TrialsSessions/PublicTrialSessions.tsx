import { BigHeader } from '@web-client/views/BigHeader';
import { PublicTrialSessionsFilters } from '@web-client/views/Public/TrialsSessions/PublicTrialSessionsFilters';
import { PublicTrialSessionsRemoteProceedingsCard } from '@web-client/views/Public/TrialsSessions/PublicTrialSessionsRemoteProceedingsCard';
import { PublicTrialSessionsTable } from '@web-client/views/Public/TrialsSessions/PublicTrialSessionsTable';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const PublicTrialSessions = connect({}, function () {
  return (
    <>
      <BigHeader text="Scheduled Trial Sessions" />
      <section className="usa-section grid-container">
        <div className="grid-row">
          <div className="tablet:grid-col-8 grid-col-12 padding-top-2">
            <PublicTrialSessionsFilters></PublicTrialSessionsFilters>
          </div>
          <div className="tablet:grid-col-4 grid-col-12 padding-top-1">
            <PublicTrialSessionsRemoteProceedingsCard></PublicTrialSessionsRemoteProceedingsCard>
          </div>
        </div>
        <div className="grid-row padding-top-1">
          <PublicTrialSessionsTable></PublicTrialSessionsTable>
        </div>
      </section>
    </>
  );
});

PublicTrialSessions.displayName = 'PublicTrialSessions';
