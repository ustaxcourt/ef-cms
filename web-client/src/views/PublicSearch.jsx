import { BigHeader } from './BigHeader';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import { SearchForm } from './AdvancedSearch/SearchForm';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const PublicSearch = connect(
  {
    submitCaseAdvancedSearchSequence:
      sequences.submitCaseAdvancedSearchSequence,
    submitCaseDocketNumberSearchSequence:
      sequences.submitCaseDocketNumberSearchSequence,
  },
  ({
    submitCaseAdvancedSearchSequence,
    submitCaseDocketNumberSearchSequence,
  }) => {
    return (
      <>
        <NonMobile>
          <BigHeader text="Search for a Case" />

          <section className="usa-section grid-container advanced-search">
            <SearchForm
              submitAdvancedSearchSequence={submitCaseAdvancedSearchSequence}
              submitDocketNumberSearchSequence={
                submitCaseDocketNumberSearchSequence
              }
            />
          </section>
        </NonMobile>
        <Mobile>
          <BigHeader text="Welcome to the U.S Tax Court’s Case Management System" />

          <section className="usa-section grid-container advanced-search">
            <h2>Search for a Case</h2>
            <SearchForm
              submitAdvancedSearchSequence={submitCaseAdvancedSearchSequence}
              submitDocketNumberSearchSequence={
                submitCaseDocketNumberSearchSequence
              }
            />
          </section>
        </Mobile>
      </>
    );
  },
);
