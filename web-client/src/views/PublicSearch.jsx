import { connect } from '@cerebral/react';
import React from 'react';

export const PublicSearch = connect(
  {},
  () => {
    return (
      <>
        <section className="usa-section grid-container advanced-search">
          <h1>Public Search</h1>
        </section>
      </>
    );
  },
);
