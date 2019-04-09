import React from 'react';

export const DocumentCategoryAccordion = () => (
  <div className="subsection document-category-accordion">
    <h3>What Document Category Should You Select?</h3>
    <p>
      Which of these most closely matches the reason that you’re filing the
      document? Look at the document categories underneath that reason for the
      ones most commonly associated with it.
    </p>

    <div role="list" className="document-category-features usa-grid-full">
      <div role="listitem" className="usa-width-one-fourth document-feature">
        <h4>To Request Something From the Court</h4>
        <ul>
          <li>Application</li>
          <li>Motion</li>
          <li>Petition</li>
        </ul>
      </div>
      <div role="listitem" className="usa-width-one-fourth document-feature">
        <h4>To Notify the Court of a Change</h4>
        <ul>
          <li>Brief</li>
          <li>Memorandum</li>
          <li>Notice</li>
          <li>Statement</li>
          <li>Stipulation</li>
        </ul>
      </div>
      <div role="listitem" className="usa-width-one-fourth document-feature">
        <h4>To Update or Add to a Previous Document</h4>
        <ul>
          <li>Miscellaneous</li>
          <li>Supporting Documents</li>
        </ul>
      </div>
      <div
        role="listitem"
        className="usa-width-one-fourth document-feature warning"
      >
        <h4>To Respond to a Previous Document</h4>
        <ul>
          <li>Answer</li>
          <li>Opposition</li>
          <li>Reply</li>
          <li>Response</li>
        </ul>
      </div>
    </div>
  </div>
);
