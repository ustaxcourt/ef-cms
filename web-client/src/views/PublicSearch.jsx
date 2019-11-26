import { BigHeader } from './BigHeader';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import { SearchForm } from './AdvancedSearch/SearchForm';
import React from 'react';

export const PublicSearch = () => {
  return (
    <>
      <NonMobile>
        <BigHeader text="Search for a Case" />

        <section className="usa-section grid-container advanced-search">
          <SearchForm />
        </section>
      </NonMobile>
      <Mobile>
        <BigHeader text="Welcome to the U.S Tax Court’s Case Management System" />

        <section className="usa-section grid-container advanced-search">
          <h2>Search for a Case</h2>
          <SearchForm />
        </section>
      </Mobile>
    </>
  );
};
