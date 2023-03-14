import { Button } from '../../ustc-ui/Button/Button';
import React from 'react';

export const Buttons = () => (
  <section className="usa-section grid-container">
    <h1>Buttons</h1>
    <hr />
    <Button>Primary Default</Button>
    <Button className="usa-button--hover">Primary Hover</Button>
    <Button className="usa-button--active">Primary Active</Button>
    <Button className="usa-focus">Primary Focus</Button>
    <Button disabled>Primary Disabled</Button>
    <Button icon="check-circle">Primary Icon</Button>
    <hr />
    <Button secondary>Secondary Default</Button>
    <Button secondary className="usa-button--hover">
      Secondary Hover
    </Button>
    <Button secondary className="usa-button--active">
      Secondary Active
    </Button>
    <Button secondary className="usa-focus">
      Secondary Focus
    </Button>
    <Button disabled secondary>
      Secondary Disabled
    </Button>
    <hr />
    <Button link>Button Link</Button>
    <Button link icon="question-circle">
      Button Link
    </Button>
  </section>
);

Buttons.displayName = 'Buttons';
