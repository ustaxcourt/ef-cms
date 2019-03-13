import React from 'react';

export const Tabs = () => (
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
);
