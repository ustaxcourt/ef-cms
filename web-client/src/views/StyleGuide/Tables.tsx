import React from 'react';

export const Tables = () => (
  <section className="usa-section grid-container">
    <h1>Tables</h1>
    <hr />
    <h2>Responsive Table</h2>
    <table className="usa-table responsive-table subsection">
      <thead>
        <tr>
          <th>Docket number</th>
          <th>Date filed</th>
          <th>Petitioner name</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <span className="responsive-label">Docket number</span>
            <span>Docket number</span>
          </td>
          <td>
            <span className="responsive-label">Date filed</span>
            <span>Date filed</span>
          </td>
          <td>
            <span className="responsive-label">Petitioner name</span>
            <span>Petitioner name</span>
          </td>
        </tr>
        <tr>
          <td>
            <span className="responsive-label">Docket number</span>
            <span>Docket number</span>
          </td>
          <td>
            <span className="responsive-label">Date filed</span>
            <span>Date filed</span>
          </td>
          <td>
            <span className="responsive-label">Petitioner name</span>
            <span>Petitioner name</span>
          </td>
        </tr>
        <tr>
          <td>
            <span className="responsive-label">Docket number</span>
            <span>Docket number</span>
          </td>
          <td>
            <span className="responsive-label">Date filed</span>
            <span>Date filed</span>
          </td>
          <td>
            <span className="responsive-label">Petitioner name</span>
            <span>Petitioner name</span>
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Work Queue Table</h2>
    <table className="usa-table ustc-table subsection">
      <thead>
        <tr>
          <th aria-label="Docket Number">Docket No.</th>
          <th>Date filed</th>
          <th>Petitioner name</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <span>Docket number</span>
          </td>
          <td>
            <span>Date filed</span>
          </td>
          <td>
            <span>Petitioner name</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Docket number</span>
          </td>
          <td>
            <span>Date filed</span>
          </td>
          <td>
            <span>Petitioner name</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Docket number</span>
          </td>
          <td>
            <span>Date filed</span>
          </td>
          <td>
            <span>Petitioner name</span>
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Dashboard Table</h2>
    <table className="usa-table dashboard subsection">
      <thead>
        <tr>
          <th>Docket number</th>
          <th>Date filed</th>
          <th>Petitioner name</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <span>Docket number</span>
          </td>
          <td>
            <span>Date filed</span>
          </td>
          <td>
            <span>Petitioner name</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Docket number</span>
          </td>
          <td>
            <span>Date filed</span>
          </td>
          <td>
            <span>Petitioner name</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Docket number</span>
          </td>
          <td>
            <span>Date filed</span>
          </td>
          <td>
            <span>Petitioner name</span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
);

Tables.displayName = 'Tables';
