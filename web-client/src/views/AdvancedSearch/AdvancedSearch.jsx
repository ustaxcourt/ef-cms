import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SearchForm } from './SearchForm';
import { SearchResults } from './SearchResults';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const AdvancedSearch = connect(
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
        <BigHeader text="Advanced Search" />

        <section className="usa-section grid-container advanced-search">
          <ErrorNotification />

          <SearchForm
            submitAdvancedSearchSequence={submitCaseAdvancedSearchSequence}
            submitDocketNumberSearchSequence={
              submitCaseDocketNumberSearchSequence
            }
          />

          <SearchResults />
        </section>
      </>
    );
  },
);
