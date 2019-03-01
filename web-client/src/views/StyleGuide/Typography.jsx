import React from 'react';

export const Typography = () => (
  <section className="usa-section usa-grid">
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
        Body copy. A series of sentences together which make a paragraph. Lorem
        ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a nulla sit
        amet ex facilisis ultricies. Aliquam erat volutpat. Ut congue augue
        mauris, id fermentum magna condimentum eu. Aliquam eget augue lacus.
        Fusce eu urna eros. Sed ornare sed ex non aliquam. Praesent vitae rutrum
        risus. Nam nibh lorem, laoreet sed magna et, aliquet tristique enim.
      </p>
      <p>
        <a href="#a" name="a">
          This
        </a>{' '}
        is a text link on a light background.
      </p>
      <p>
        <a className="usa-color-text-visited" href="#b" name="b">
          This
        </a>{' '}
        is a visited link.
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
      <div className="usa-background-dark" style={{ padding: '1em' }}>
        <p>
          <a href="#c" name="c">
            This
          </a>{' '}
          is a text link on a dark background.
        </p>
      </div>
    </div>
    <div className="usa-section usa-grid">
      <div className="usa-width-one-third">
        <h6 className="usa-heading-alt">Unordered list</h6>
        <ul>
          <li>Unordered list item</li>
          <li>Unordered list item</li>
          <li>Unordered list item</li>
        </ul>
      </div>
      <div className="usa-width-one-third">
        <h6 className="usa-heading-alt mt0">Ordered list</h6>
        <ol>
          <li>Ordered list item</li>
          <li>Ordered list item</li>
          <li>Ordered list item</li>
        </ol>
      </div>
    </div>
  </section>
);
