import { BigHeader } from './BigHeader';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const CaseSearchNoMatches = connect(
  {
    caseSearchNoMatchesHelper: state.caseSearchNoMatchesHelper,
  },
  function CaseSearchNoMatches({ caseSearchNoMatchesHelper }) {
    return (
      <>
        <BigHeader text="Search Results" />

        <section className="usa-section grid-container">
          <h1>No Matches Found</h1>
          <p>
            Check your docket number and try again.{' '}
            {caseSearchNoMatchesHelper.showSearchByNameOption ? (
              <>
                Or you can try <a href="/search">searching by name</a>.
              </>
            ) : (
              <>
                If you need help, <a href="/contact">contact us</a>.
              </>
            )}
          </p>
        </section>
      </>
    );
  },
);

CaseSearchNoMatches.displayName = 'CaseSearchNoMatches';
