import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const Buttons = () => (
  <section className="usa-section usa-grid">
    <h1>Buttons</h1>
    <hr />
    <h2>Primary buttons</h2>
    <button className="usa-button">Default</button>
    <button className="usa-button usa-button-hover">Hover</button>
    <button className="usa-button usa-button-active">Active</button>
    <button className="usa-button usa-focus">Focus</button>
    <button className="usa-button" disabled>
      Disabled
    </button>
    <h2>Secondary buttons</h2>
    <button className="usa-button usa-button-secondary">Default</button>
    <button className="usa-button usa-button-secondary usa-button-hover">
      Hover
    </button>
    <button className="usa-button usa-button-secondary usa-button-active">
      Active
    </button>
    <button className="usa-button usa-button-secondary usa-focus">Focus</button>
    <button className="usa-button usa-button-secondary" disabled>
      Disabled
    </button>
    <h2>Icon button</h2>
    <button className="usa-button">
      <FontAwesomeIcon icon="check-circle" size="sm" />
      Icon
    </button>
    <h2>Big button</h2>
    <button className="usa-button usa-button-big">Default</button>
  </section>
);
