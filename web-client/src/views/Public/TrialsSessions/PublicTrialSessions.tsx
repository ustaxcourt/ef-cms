import { BigHeader } from '@web-client/views/BigHeader';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { PublicTrialSessionsFilters } from '@web-client/views/Public/TrialsSessions/PublicTrialSessionsFilters';
import { PublicTrialSessionsHelperResults } from '@web-client/presenter/computeds/Public/publicTrialSessionsHelper';
import { PublicTrialSessionsRemoteProceedingsCard } from '@web-client/views/Public/TrialsSessions/PublicTrialSessionsRemoteProceedingsCard';
import { PublicTrialSessionsTable } from '@web-client/views/Public/TrialsSessions/PublicTrialSessionsTable';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

const ROOT = 'publicTrialSessionData';

type TrialsSessionsUiParams = {
  publicTrialSessionsHelper: PublicTrialSessionsHelperResults;
  resetPublicTrialSessionDataSequence: () => void;
  publicTrialSessionData: {
    judges?: {
      [key: string]: string;
    };
    locations?: {
      [key: string]: string;
    };
    sessionTypes?: {
      [key: string]: string;
    };
    pageNumber?: number;
    proceedingType?: string;
  };
};

export const PublicTrialSessions = connect(
  {
    publicTrialSessionData: state[ROOT],
    publicTrialSessionsHelper: state.publicTrialSessionsHelper,
    resetPublicTrialSessionDataSequence:
      sequences.resetPublicTrialSessionDataSequence,
  },
  function ({
    publicTrialSessionData,
    publicTrialSessionsHelper,
    resetPublicTrialSessionDataSequence,
  }) {
    return (
      <>
        <BigHeader text="Scheduled Trial Sessions" />

        {NonMobilePublicTrialsSessions({
          publicTrialSessionData,
          publicTrialSessionsHelper,
          resetPublicTrialSessionDataSequence,
        })}
        {MobilePublicTrialsSessions()}
      </>
    );
  },
);

function NonMobilePublicTrialsSessions({
  publicTrialSessionData,
  publicTrialSessionsHelper,
  resetPublicTrialSessionDataSequence,
}: TrialsSessionsUiParams) {
  return (
    <NonMobile>
      <section className="usa-section grid-container">
        <div className="grid-row">
          <div className="tablet:grid-col-8 grid-col-12 padding-top-2">
            <PublicTrialSessionsFilters
              ROOT={ROOT}
            ></PublicTrialSessionsFilters>
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
          <PublicTrialSessionsTable
            ROOT={ROOT}
            pageNumber={publicTrialSessionData.pageNumber || 0}
            totalPages={publicTrialSessionsHelper.totalPages}
          ></PublicTrialSessionsTable>
        </div>
      </section>
    </NonMobile>
  );
}
function MobilePublicTrialsSessions() {
  return (
    <Mobile>
      <section className="usa-section grid-container">
        John is testing mobile
      </section>
    </Mobile>
  );
}

PublicTrialSessions.displayName = 'PublicTrialSessions';
