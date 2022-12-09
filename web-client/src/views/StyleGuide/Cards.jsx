import React from 'react';

export const Cards = () => (
  <section className="usa-section grid-container">
    <h1>Cards</h1>
    <div className="card">
      <div className="content-wrapper">
        <span className="label-inline">Label</span>
        <span>Value</span>
      </div>
      <div className="actions-wrapper">
        <div className="content-wrapper">
          <span>Buttons</span>
        </div>
      </div>
    </div>
  </section>
);

Cards.displayName = 'Cards';
