import React from 'react';

export const Typography = () => (
  <section className="usa-section grid-container">
    <div className="subsection">
      <h1>Typography</h1>
      <hr />
      <h1 className="display-1">Display 1</h1>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>
      <p className="lead">Lead paragraph</p>
      <p>
        Body copy. Do not create extra content just to fill the template. You
        can remove individual components (such as the media block) or
        sub-components (such as individual menu items in the header) from the
        template as you implement it. This version gives you a broad idea of the
        number of things your landing page could include. But never make a page
        more complex than you need to. If you’re unsure, interview users to find
        out what they need to know.
      </p>
      <p>
        <a href="#a" name="a">
          This
        </a>{' '}
        is a text link on a light background.
      </p>
      <p>
        This is a link that goes to an{' '}
        <a
          className="usa-external_link"
          href="https://media.giphy.com/media/8sgNa77Dvj7tC/giphy.gif"
        >
          external website
        </a>
        .
      </p>
    </div>
  </section>
);

Typography.displayName = 'Typography';
