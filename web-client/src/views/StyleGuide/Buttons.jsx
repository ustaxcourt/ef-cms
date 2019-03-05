import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const Buttons = () => (
  <section className="usa-section usa-grid">
    <h1>Buttons</h1>
    <hr />
    <button className="usa-button">Primary Default</button>
    <button className="usa-button usa-button-hover">Primary Hover</button>
    <button className="usa-button usa-button-active">Primary Active</button>
    <button className="usa-button usa-focus">Primary Focus</button>
    <button className="usa-button" disabled>
      Primary Disabled
    </button>
    <button className="usa-button">
      <FontAwesomeIcon icon="check-circle" size="sm" />
      Primary Icon
    </button>
    <button className="usa-button usa-button-secondary">
      Secondary Default
    </button>
    <button className="usa-button usa-button-secondary usa-button-hover">
      Secondary Hover
    </button>
    <button className="usa-button usa-button-secondary usa-button-active">
      Secondary Active
    </button>
    <button className="usa-button usa-button-secondary usa-focus">
      Secondary Focus
    </button>
    <button className="usa-button usa-button-secondary" disabled>
      Secondary Disabled
    </button>
  </section>
);
