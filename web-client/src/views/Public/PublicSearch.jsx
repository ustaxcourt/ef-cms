import { BigHeader } from '../BigHeader';
import { CaseSearchForm } from '../AdvancedSearch/CaseSearchForm';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { SearchResults } from '../AdvancedSearch/SearchResults';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const PublicSearch = connect(
  {
    submitCaseDocketNumberSearchSequence:
      sequences.submitCaseDocketNumberSearchSequence,
    submitPublicAdvancedSearchSequence:
      sequences.submitPublicAdvancedSearchSequence,
  },
  function PublicSearch({
    submitCaseDocketNumberSearchSequence,
    submitPublicAdvancedSearchSequence,
  }) {
    return (
      <>
        <NonMobile>
          <BigHeader text="Search for a Case" />

          <section className="usa-section grid-container advanced-search">
            <CaseSearchForm
              submitAdvancedSearchSequence={submitPublicAdvancedSearchSequence}
              submitDocketNumberSearchSequence={
                submitCaseDocketNumberSearchSequence
              }
            />
            <SearchResults />
          </section>
        </NonMobile>
        <Mobile>
          <BigHeader text="Welcome to the U.S Tax Court’s Case Management System" />

          <section className="usa-section grid-container advanced-search">
            <h2>Search for a Case</h2>
            <CaseSearchForm
              submitAdvancedSearchSequence={submitPublicAdvancedSearchSequence}
              submitDocketNumberSearchSequence={
                submitCaseDocketNumberSearchSequence
              }
            />
            <SearchResults />
          </section>
        </Mobile>
      </>
    );
  },
);
