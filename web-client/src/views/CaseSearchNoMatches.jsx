import { BigHeader } from './BigHeader';
import React from 'react';

export const CaseSearchNoMatches = () => (
  <>
    <BigHeader text="Search Results" />

    <section className="usa-section grid-container">
      <h1>No Matches Found</h1>
      <p>
        Check your docket number and try again. Or you can try{' '}
        <a href="/search">searching by name</a>.
      </p>
    </section>
  </>
);
