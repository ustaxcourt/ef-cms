import React from 'react';

export const Forms = () => (
  <section className="usa-section usa-grid">
    <h1>Forms</h1>
    <hr />
    <form>
      <label htmlFor="input-text">Text input</label>
      <input id="input-text" type="text" />

      <label htmlFor="input-text-hint">Text input with hint text</label>
      <span className="usa-form-hint">This is your hint!</span>
      <input id="input-text-hint" type="text" />

      <div className="usa-input-error">
        <label htmlFor="input-text-error">Text input with error</label>
        <input id="input-text-error" type="text" />
        <div className="usa-input-error-message beneath">Error message</div>
      </div>

      <label htmlFor="input-email">Email input</label>
      <input id="input-email" type="email" />

      <div className="usa-input-error">
        <label htmlFor="input-email-error">Email input with error</label>
        <input id="input-email-error" type="email" />
        <div className="usa-input-error-message beneath">Error message</div>
      </div>

      <label htmlFor="input-number">Number input</label>
      <input id="input-number" type="number" />

      <div className="usa-input-error">
        <label htmlFor="input-number-error">Number input with error</label>
        <input id="input-number-error" type="number" />
        <div className="usa-input-error-message beneath">Error message</div>
      </div>

      <label htmlFor="input-tel">Phone input</label>
      <input id="input-tel" type="tel" />

      <div className="usa-input-error">
        <label htmlFor="input-tel-error">Phone input with error</label>
        <input id="input-tel-error" type="tel" />
        <div className="usa-input-error-message beneath">Error message</div>
      </div>

      <label htmlFor="input-file">File input</label>
      <input id="input-file" type="file" />

      <div className="usa-input-error">
        <label htmlFor="input-file-error">File input with error</label>
        <input id="input-file-error" type="file" />
        <div className="usa-input-error-message beneath">Error message</div>
      </div>

      <label htmlFor="options">Dropdown label</label>
      <select id="options">
        <option value>- Select -</option>
        <option value="value1">Option A</option>
        <option value="value2">Option B</option>
        <option value="value3">Option C</option>
      </select>

      <div className="usa-input-error">
        <label htmlFor="options-error">Dropdown label with error</label>
        <select id="options-error">
          <option value>- Select -</option>
          <option value="value1">Option A</option>
          <option value="value2">Option B</option>
          <option value="value3">Option C</option>
        </select>
        <div className="usa-input-error-message beneath">Error message</div>
      </div>

      <label htmlFor="textarea">Text Area</label>
      <textarea id="textarea" />

      <div className="usa-input-error">
        <label htmlFor="textarea-error">Text Area with error</label>
        <textarea id="textarea-error" />
        <div className="usa-input-error-message beneath">Error message</div>
      </div>

      <fieldset className="usa-fieldset-inputs usa-sans">
        <legend>Checkboxes vertical</legend>
        <ul className="ustc-vertical-option-list">
          <li>
            <input
              id="truth"
              type="checkbox"
              name="historical-figures-1"
              value="truth"
            />
            <label htmlFor="truth">Sojourner Truth</label>
          </li>
          <li>
            <input
              id="douglass"
              type="checkbox"
              name="historical-figures-1"
              value="douglass"
            />
            <label htmlFor="douglass">Frederick Douglass</label>
          </li>
          <li>
            <input
              id="washington"
              type="checkbox"
              name="historical-figures-1"
              value="washington"
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

      <fieldset className="usa-fieldset-inputs usa-sans">
        <legend>Checkboxes horizontal</legend>
        <ul className="usa-unstyled-list">
          <li>
            <input
              id="truth-horizontal"
              type="checkbox"
              name="historical-figures-1-horizontal"
              value="truth"
            />
            <label htmlFor="truth-horizontal">Sojourner Truth</label>
          </li>
          <li>
            <input
              id="douglass-horizontal"
              type="checkbox"
              name="historical-figures-1-horizontal"
              value="douglass"
            />
            <label htmlFor="douglass">Frederick Douglass</label>
          </li>
          <li>
            <input
              id="washington-horizontal"
              type="checkbox"
              name="historical-figures-1-horizontal"
              value="washington"
            />
            <label htmlFor="washington-horizontal">Booker T. Washington</label>
          </li>
          <li>
            <input
              id="carver-horizontal"
              type="checkbox"
              name="historical-figures-1-horizontal"
              disabled
            />
            <label htmlFor="carver-horizontal">George Washington Carver</label>
          </li>
        </ul>
      </fieldset>

      <div className="usa-input-error">
        <fieldset className="usa-fieldset-inputs usa-sans">
          <legend>Checkboxes with error</legend>
          <ul className="ustc-vertical-option-list">
            <li>
              <input
                id="truth-error"
                type="checkbox"
                name="historical-figures-1"
                value="truth"
              />
              <label htmlFor="truth-error">Sojourner Truth</label>
            </li>
            <li>
              <input
                id="douglass-error"
                type="checkbox"
                name="historical-figures-1"
                value="douglass"
              />
              <label htmlFor="douglass-error">Frederick Douglass</label>
            </li>
            <li>
              <input
                id="washington"
                type="checkbox"
                name="historical-figures-1"
                value="washington"
              />
              <label htmlFor="washington">Booker T. Washington</label>
            </li>
            <li>
              <input
                id="carver-error"
                type="checkbox"
                name="historical-figures-1"
                disabled
              />
              <label htmlFor="carver-error">George Washington Carver</label>
            </li>
          </ul>
          <div className="usa-input-error-message beneath">Error message</div>
        </fieldset>
      </div>

      <fieldset className="usa-fieldset-inputs usa-sans">
        <legend>Radio buttons vertical</legend>
        <ul className="ustc-vertical-option-list">
          <li>
            <input
              id="stanton"
              type="radio"
              name="historical-figures-2"
              value="stanton"
            />
            <label htmlFor="stanton-error">Elizabeth Cady Stanton</label>
          </li>
          <li>
            <input
              id="anthony"
              type="radio"
              name="historical-figures-2"
              value="anthony"
            />
            <label htmlFor="anthony-error">Susan B. Anthony</label>
          </li>
          <li>
            <input
              id="tubman"
              type="radio"
              name="historical-figures-2"
              value="tubman"
            />
            <label htmlFor="tubman-error">Harriet Tubman</label>
          </li>
        </ul>
      </fieldset>

      <fieldset className="usa-fieldset-inputs usa-sans">
        <legend>Radio buttons horizontal</legend>
        <ul className="usa-unstyled-list">
          <li>
            <input
              id="stanton-horizontal"
              type="radio"
              name="historical-figures-2-horizontal"
              value="stanton"
            />
            <label htmlFor="stanton-horizontal">Elizabeth Cady Stanton</label>
          </li>
          <li>
            <input
              id="anthony-horizontal"
              type="radio"
              name="historical-figures-2-horizontal"
              value="anthony"
            />
            <label htmlFor="anthony-horizontal">Susan B. Anthony</label>
          </li>
          <li>
            <input
              id="tubman-horizontal"
              type="radio"
              name="historical-figures-2-horizontal"
              value="tubman"
            />
            <label htmlFor="tubman-horizontal">Harriet Tubman</label>
          </li>
        </ul>
      </fieldset>

      <div className="usa-input-error">
        <fieldset className="usa-fieldset-inputs usa-sans">
          <legend>Radio buttons with error</legend>
          <ul className="ustc-vertical-option-list">
            <li>
              <input
                id="stanton-error"
                type="radio"
                name="historical-figures-2"
                value="stanton"
              />
              <label htmlFor="stanton-error">Elizabeth Cady Stanton</label>
            </li>
            <li>
              <input
                id="anthony-error"
                type="radio"
                name="historical-figures-2"
                value="anthony"
              />
              <label htmlFor="anthony-error">Susan B. Anthony</label>
            </li>
            <li>
              <input
                id="tubman-error"
                type="radio"
                name="historical-figures-2"
                value="tubman"
              />
              <label htmlFor="tubman-error">Harriet Tubman</label>
            </li>
          </ul>
          <div className="usa-input-error-message beneath">Error message</div>
        </fieldset>
      </div>

      <fieldset>
        <legend>Date</legend>
        <div className="usa-date-of-birth">
          <div className="usa-form-group usa-form-group-month">
            <label htmlFor="date_of_birth_1">MM</label>
            <input
              className="usa-input-inline"
              id="date_of_birth_1"
              type="number"
              min="1"
              max="12"
            />
          </div>
          <div className="usa-form-group usa-form-group-day">
            <label htmlFor="date_of_birth_2">DD</label>
            <input
              className="usa-input-inline"
              id="date_of_birth_2"
              type="number"
              min="1"
              max="31"
            />
          </div>
          <div className="usa-form-group usa-form-group-year">
            <label htmlFor="date_of_birth_3">YYYY</label>
            <input
              className="usa-input-inline"
              id="date_of_birth_3"
              type="number"
              min="1900"
              max="2000"
            />
          </div>
        </div>
      </fieldset>

      <div className="usa-input-error">
        <fieldset>
          <legend>Date with error</legend>
          <div className="usa-date-of-birth">
            <div className="usa-form-group usa-form-group-month">
              <label htmlFor="date_of_birth_1-error">MM</label>
              <input
                className="usa-input-inline"
                id="date_of_birth_1-error"
                type="number"
                min="1"
                max="12"
              />
            </div>
            <div className="usa-form-group usa-form-group-day">
              <label htmlFor="date_of_birth_2-error">DD</label>
              <input
                className="usa-input-inline"
                id="date_of_birth_2-error"
                type="number"
                min="1"
                max="31"
              />
            </div>
            <div className="usa-form-group usa-form-group-year">
              <label htmlFor="date_of_birth_3-error">YYYY</label>
              <input
                className="usa-input-inline"
                id="date_of_birth_3-error"
                type="number"
                min="1900"
                max="2000"
              />
            </div>
            <div className="usa-input-error-message beneath">Error message</div>
          </div>
        </fieldset>
      </div>
    </form>
  </section>
);
