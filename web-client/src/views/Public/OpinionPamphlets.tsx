import { BigHeader } from '../BigHeader';
import { connect } from '@cerebral/react';
import React from 'react';

export const OpinionPamphlets = connect({}, function OpinionPamphlets() {
  return (
    <>
      <BigHeader text="United States Tax Court Reports" />

      <section className="usa-section grid-container opinion-pamphlets"></section>
    </>
  );
});

OpinionPamphlets.displayName = 'OpinionPamphlets';
