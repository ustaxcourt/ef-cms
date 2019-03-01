import React from 'react';

import { Typography } from './Typography';
import { Buttons } from './Buttons';

export const StyleGuide = () => (
  <React.Fragment>
    <Typography />
    <Buttons />
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
      <h1>Tables</h1>
      <hr />
      <h2>Responsive Table</h2>
      <table className="responsive-table">
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
      <table className="work-queue">
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

    <section className="usa-section usa-grid">
      <h6 className="usa-heading-alt">Alignment</h6>
      <div className="alignment-example">
        <h5>The Grand Canyon</h5>
        <p>
          Grand Canyon National Park is the United States&apos; 15th oldest
          national park. Named a UNESCO World Heritage Site in 1979, the park is
          located in Arizona.
        </p>
      </div>

      <h6 className="usa-heading-alt">Line length - Desktop</h6>
      <div className="usa-line-length-example">
        <p>
          Yosemite National Park is set within California’s Sierra Nevada
          mountains. It’s famed for its giant, ancient sequoias, and for Tunnel
          View, the iconic vista of towering Bridalveil Fall and the granite
          cliffs of El Capitan and Half Dome.
        </p>
        <p className="help-text">75 characters max on desktop</p>
      </div>

      <h6 className="usa-heading-alt">Spacing</h6>

      <h1>Page heading</h1>
      <p className="usa-font-lead">
        Great Smoky Mountains National Park straddles the border of North
        Carolina and Tennessee.
      </p>

      <h2>Section heading</h2>

      <h3>Section of the page</h3>
      <p>
        The sprawling landscape encompasses lush forests and an abundance of
        wildflowers that bloom year-round. Streams, rivers and waterfalls appear
        along hiking routes that include a segment of the Appalachian Trail.
      </p>

      <h4>Subsection of the page</h4>
      <p>
        World renowned for its diversity of plant and animal life, the beauty of
        its ancient mountains, and the quality of its remnants of Southern
        Appalachian mountain culture, this is America&apos;s most visited
        national park.
      </p>
      <p>
        Right now scientists think that we only know about 17 percent of the
        plants and animals that live in the park, or about 17,000 species of a
        probable 100,000 different organisms.
      </p>

      <h5>Subsection of the page</h5>
      <p>
        Entrance to Great Smoky Mountains National Park is free. The park is one
        of the few national parks where no entrance fees are charged.
      </p>
    </section>

    <section className="usa-section usa-grid">
      <h2>Form Controls</h2>
      <form className="usa-form">
        <label htmlFor="input-type-text">Text input label</label>
        <input id="input-type-text" name="input-type-text" type="text" />

        <label htmlFor="input-focus">Text input focused</label>
        <input
          className="usa-focus"
          id="input-focus"
          name="input-focus"
          type="text"
        />

        <div className="usa-input-error">
          <label className="usa-input-error-label" htmlFor="input-error">
            Text input error
          </label>
          <span
            className="usa-input-error-message"
            id="input-error-message"
            role="alert"
          >
            Helpful error message
          </span>
          <input
            id="input-error"
            name="input-error"
            type="text"
            aria-describedby="input-error-message"
          />
        </div>

        <label htmlFor="input-success">Text input success</label>
        <input
          className="usa-input-success"
          id="input-success"
          name="input-success"
          type="text"
        />

        <label htmlFor="input-type-textarea">Text area label</label>
        <textarea id="input-type-textarea" name="input-type-textarea" />

        <label htmlFor="options">Dropdown label</label>
        <select name="options" id="options">
          <option defaultValue>- Select -</option>
          <option defaultValue="defaultValue1">Option A</option>
          <option defaultValue="defaultValue2">Option B</option>
          <option defaultValue="defaultValue3">Option C</option>
        </select>
        <br />
        <fieldset id="checkboxes" className="usa-fieldset-inputs usa-sans">
          <legend>Historical figures 1</legend>
          <ul className="usa-unstyled-list">
            <li>
              <input
                id="truth"
                type="checkbox"
                name="historical-figures-1"
                defaultValue="truth"
                defaultChecked
              />
              <label htmlFor="truth">Sojourner Truth</label>
            </li>
            <li>
              <input
                id="douglass"
                type="checkbox"
                name="historical-figures-1"
                defaultValue="douglass"
              />
              <label htmlFor="douglass">Frederick Douglass</label>
            </li>
            <li>
              <input
                id="washington"
                type="checkbox"
                name="historical-figures-1"
                defaultValue="washington"
              />
              <label htmlFor="washington">Booker T. Washington</label>
            </li>
            <li>
              <input
                id="carver"
                type="checkbox"
                name="historical-figures-1"
                disabled
              />
              <label htmlFor="carver">George Washington Carver</label>
            </li>
          </ul>
        </fieldset>
        <br />
        <fieldset id="radios" className="usa-fieldset-inputs usa-sans">
          <legend>Historical figures 2</legend>
          <ul className="usa-unstyled-list">
            <li>
              <input
                id="stanton"
                type="radio"
                defaultChecked
                name="historical-figures-2"
                defaultValue="stanton"
              />
              <label htmlFor="stanton">Elizabeth Cady Stanton</label>
            </li>
            <li>
              <input
                id="anthony"
                type="radio"
                name="historical-figures-2"
                defaultValue="anthony"
              />
              <label htmlFor="anthony">Susan B. Anthony</label>
            </li>
            <li>
              <input
                id="tubman"
                type="radio"
                name="historical-figures-2"
                defaultValue="tubman"
              />
              <label htmlFor="tubman">Harriet Tubman</label>
            </li>
          </ul>
        </fieldset>
        <br />
        <fieldset>
          <legend>Date of birth</legend>
          <span className="usa-form-hint" id="dobHint">
            For example: 04 28 1986
          </span>
          <div className="usa-date-of-birth">
            <div className="usa-form-group usa-form-group-month">
              <label htmlFor="date_of_birth_1">Month</label>
              <input
                className="usa-input-inline"
                aria-describedby="dobHint"
                id="date_of_birth_1"
                name="date_of_birth_1"
                type="number"
                min="1"
                max="12"
                defaultValue=""
              />
            </div>
            <div className="usa-form-group usa-form-group-day">
              <label htmlFor="date_of_birth_2">Day</label>
              <input
                className="usa-input-inline"
                aria-describedby="dobHint"
                id="date_of_birth_2"
                name="date_of_birth_2"
                type="number"
                min="1"
                max="31"
                defaultValue=""
              />
            </div>
            <div className="usa-form-group usa-form-group-year">
              <label htmlFor="date_of_birth_3">Year</label>
              <input
                className="usa-input-inline"
                aria-describedby="dobHint"
                id="date_of_birth_3"
                name="date_of_birth_3"
                type="number"
                min="1900"
                max="2000"
                defaultValue=""
              />
            </div>
          </div>
        </fieldset>
        <br />
        <fieldset>
          <legend className="usa-drop_text">Enter a code</legend>
          <div className="usa-alert usa-alert-info">
            <div className="usa-alert-body">
              <h3 className="usa-alert-heading">Codes must:</h3>
            </div>
            <ul className="usa-checklist" id="validate-code">
              <li data-validator="uppercase">
                Have at least 1 uppercase character
              </li>
              <li data-validator="numerical">
                Have at least 1 numerical character
              </li>
            </ul>
          </div>
          <label htmlFor="code">Code</label>
          <input
            id="code"
            name="code"
            type="text"
            aria-describedby="validate-code"
            data-validate-uppercase="[A-Z]"
            data-validate-numerical="\d"
            data-validation-element="#validate-code"
          />
        </fieldset>

        <label htmlFor="range-slider">Range slider</label>
        <input
          id="range-slider"
          type="range"
          min="0"
          max="100"
          step="10"
          defaultValue="20"
        />

        <div className="usa-form-group">
          <label htmlFor="file-upload">File Upload</label>
          <input id="file-upload" type="file" />
        </div>

        <input type="submit" value="Submit code" />
      </form>
    </section>
  </React.Fragment>
);
