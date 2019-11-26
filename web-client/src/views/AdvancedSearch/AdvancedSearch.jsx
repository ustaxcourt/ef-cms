import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SearchForm } from './SearchForm';
import { SearchResults } from './SearchResults';
import React from 'react';

export const AdvancedSearch = () => (
  <>
    <BigHeader text="Advanced Search" />

    <section className="usa-section grid-container advanced-search">
      <ErrorNotification />

      <SearchForm />

      <SearchResults />
    </section>
  </>
);
