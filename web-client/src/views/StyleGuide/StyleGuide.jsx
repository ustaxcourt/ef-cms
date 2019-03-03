import React from 'react';

import { Typography } from './Typography';
import { Buttons } from './Buttons';
import { Tables } from './Tables';
import { Forms } from './Forms';

export const StyleGuide = () => (
  <React.Fragment>
    <Typography />
    <Buttons />
    <Tables />
    <Forms />
    <section className="usa-section usa-grid">
      <h1>Tabs</h1>
      <hr />
      <h2>Primary Tabs</h2>
      <div className="horizontal-tabs subsection">
        <ul role="tablist">
          <li className="active">
            <button role="tab" className="tab-link" aria-selected={true}>
              My Queue
            </button>
          </li>
          <li>
            <button role="tab" className="tab-link" aria-selected={false}>
              Section Queue
            </button>
          </li>
        </ul>
      </div>
      <h2>Secondary Tabs</h2>
      <div className="work-queue-tab-container">
        <h3 className="work-queue-tab">Inbox</h3>
      </div>
    </section>

    <section className="usa-section usa-grid">
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
  </React.Fragment>
);
