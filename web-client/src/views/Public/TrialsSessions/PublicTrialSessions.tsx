import { BigHeader } from '@web-client/views/BigHeader';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { PublicTrialSessionsFilters } from '@web-client/views/Public/TrialsSessions/PublicTrialSessionsFilters';
import { PublicTrialSessionsRemoteProceedingsCard } from '@web-client/views/Public/TrialsSessions/PublicTrialSessionsRemoteProceedingsCard';
import { PublicTrialSessionsTable } from '@web-client/views/Public/TrialsSessions/PublicTrialSessionsTable';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

export const PublicTrialSessions = connect(
  {
    publicTrialSessionsHelper: state.publicTrialSessionsHelper,
    resetPublicTrialSessionDataSequence:
      sequences.resetPublicTrialSessionDataSequence,
  },
  function ({
    publicTrialSessionsHelper,
    resetPublicTrialSessionDataSequence,
  }) {
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
          <div className="grid-row">
            <Button
              link
              disabled={!publicTrialSessionsHelper.filtersHaveBeenModified}
              onClick={() => resetPublicTrialSessionDataSequence()}
            >
              Reset Filters
            </Button>
          </div>
          <div className="grid-row padding-top-1">
            <PublicTrialSessionsTable></PublicTrialSessionsTable>
          </div>
        </section>
      </>
    );
  },
);

PublicTrialSessions.displayName = 'PublicTrialSessions';
