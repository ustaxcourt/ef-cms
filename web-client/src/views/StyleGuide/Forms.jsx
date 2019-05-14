import React from 'react';

export const Forms = () => (
  <section className="usa-section grid-container">
    <h1>Forms</h1>
    <hr />
    <form className="usa-form usa-form--large">
      <div className="blue-container">
        <div className="usa-form-group">
          <label htmlFor="input-text" className="usa-label">
            Text input
          </label>
          <input id="input-text" className="usa-input" type="text" />
        </div>
      </div>

      <div className="blue-container">
        <div className="usa-form-group">
          <label className="usa-label with-hint" htmlFor="input-text-hint">
            Text input with hint text
          </label>
          <span className="usa-form-hint">This is your hint!</span>
          <input id="input-text-hint" className="usa-input" type="text" />
        </div>

        <div className="usa-form-group">
          <label htmlFor="input-text-optional" className="usa-label">
            Text input <span className="usa-form-hint">(optional)</span>
          </label>
          <input id="input-text-optional" className="usa-input" type="text" />
        </div>

        <div className="usa-form-group usa-form-group--error">
          <label htmlFor="input-text-error" className="usa-label">
            Text input with error
          </label>
          <input
            id="input-text-error"
            className="usa-input usa-input--error"
            type="text"
          />
          <span className="usa-error-message">Error message</span>
        </div>
      </div>

      <div className="blue-container">
        <div className="usa-form-group">
          <label htmlFor="input-email" className="usa-label">
            Email input
          </label>
          <input id="input-email" className="usa-input" type="email" />
        </div>
        <div className="usa-form-group usa-form-group--error">
          <label htmlFor="input-email-error" className="usa-label">
            Email input with error
          </label>
          <input
            id="input-email-error"
            className="usa-input usa-input--error"
            type="email"
          />
          <span className="usa-error-message">Error message</span>
        </div>
        <div className="usa-form-group">
          <label htmlFor="input-number" className="usa-label">
            Number input
          </label>
          <input id="input-number" className="usa-input" type="number" />
        </div>
      </div>

      <div className="blue-container">
        <div className="usa-form-group usa-form-group--error">
          <label htmlFor="input-number-error" className="usa-label">
            Number input with error
          </label>
          <input
            id="input-number-error"
            className="usa-input usa-input--error"
            type="number"
          />
          <span className="usa-error-message">Error message</span>
        </div>
      </div>

      <div className="blue-container">
        <div className="usa-form-group">
          <label htmlFor="input-tel" className="usa-label">
            Phone input
          </label>
          <input id="input-tel" className="usa-input" type="tel" />
        </div>
      </div>

      <div className="blue-container">
        <div className="usa-form-group usa-form-group--error">
          <label htmlFor="input-tel-error" className="usa-label">
            Phone input with error
          </label>
          <input
            id="input-tel-error"
            className="usa-input usa-input--error"
            type="tel"
          />
          <span className="usa-error-message">Error message</span>
        </div>
      </div>

      <div className="blue-container">
        <div className="usa-form-group">
          <label htmlFor="input-file" className="usa-label">
            File input
          </label>
          <input id="input-file" className="usa-input" type="file" />
        </div>
      </div>

      <div className="blue-container">
        <div className="usa-form-group usa-form-group--error">
          <label htmlFor="input-file-error" className="usa-label">
            File input with error
          </label>
          <input id="input-file-error" type="file" />
          <span className="usa-error-message">Error message</span>
        </div>
      </div>

      <div className="blue-container">
        <div className="usa-form-group">
          <label htmlFor="options">Dropdown label</label>
          <select className="usa-select" id="options">
            <option value>- Select -</option>
            <option value="value1">Option A</option>
            <option value="value2">Option B</option>
            <option value="value3">Option C</option>
          </select>
        </div>
      </div>

      <div className="blue-container">
        <div className="usa-form-group usa-form-group--error">
          <label htmlFor="options-error">Dropdown label with error</label>
          <select className="usa-select usa-select--error" id="options-error">
            <option value>- Select -</option>
            <option value="value1">Option A</option>
            <option value="value2">Option B</option>
            <option value="value3">Option C</option>
          </select>
          <span className="usa-error-message">Error message</span>
        </div>
      </div>

      <div className="blue-container">
        <div className="usa-form-group">
          <label htmlFor="textarea" className="usa-label">
            Text Area
          </label>
          <textarea id="textarea" className="usa-textarea" />
        </div>
      </div>
      <div className="blue-container">
        <div className="usa-form-group usa-form-group--error">
          <label htmlFor="textarea-error" className="usa-label">
            Text Area with error
          </label>
          <textarea
            id="textarea-error"
            className="usa-textarea usa-textarea--error"
          />
          <span className="usa-error-message">Error message</span>
        </div>
      </div>

      <div className="blue-container">
        <fieldset className="usa-fieldset">
          <legend>Checkboxes</legend>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id="truth"
              type="checkbox"
              name="historical-figures-1"
              value="truth"
            />
            <label htmlFor="truth" className="usa-checkbox__label">
              Sojourner Truth
            </label>
          </div>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id="douglass"
              type="checkbox"
              name="historical-figures-1"
              value="douglass"
            />
            <label htmlFor="douglass" className="usa-checkbox__label">
              Frederick Douglass
            </label>
          </div>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id="washington"
              type="checkbox"
              name="historical-figures-1"
              value="washington"
            />
            <label htmlFor="washington" className="usa-checkbox__label">
              Booker T. Washington
            </label>
          </div>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id="carver"
              type="checkbox"
              name="historical-figures-1"
              disabled
            />
            <label htmlFor="carver" className="usa-checkbox__label">
              George Washington Carver
            </label>
          </div>
        </fieldset>
      </div>

      <div className="blue-container">
        <fieldset className="usa-fieldset">
          <legend>Radio Buttons</legend>
          <div className="usa-radio">
            <input
              className="usa-radio__input"
              id="stanton"
              type="radio"
              checked
              name="historical-figures-2"
              value="stanton"
            />
            <label className="usa-radio__label" htmlFor="stanton">
              Elizabeth Cady Stanton
            </label>
          </div>
          <div className="usa-radio">
            <input
              className="usa-radio__input"
              id="anthony"
              type="radio"
              name="historical-figures-2"
              value="anthony"
            />
            <label className="usa-radio__label" htmlFor="anthony">
              Susan B. Anthony
            </label>
          </div>
          <div className="usa-radio">
            <input
              className="usa-radio__input"
              id="tubman"
              type="radio"
              name="historical-figures-2"
              value="tubman"
            />
            <label className="usa-radio__label" htmlFor="tubman">
              Harriet Tubman
            </label>
          </div>
        </fieldset>
      </div>

      <div className="blue-container">
        <fieldset className="usa-fieldset">
          <legend>Inline Radio Buttons</legend>
          <div className="usa-radio usa-radio__inline">
            <input
              className="usa-radio__input"
              id="fieri"
              type="radio"
              checked
              name="celebrity-chefs-2"
              value="fieri"
            />
            <label className="usa-radio__label" htmlFor="fieri">
              Guy Fieri
            </label>
          </div>
          <div className="usa-radio usa-radio__inline">
            <input
              className="usa-radio__input"
              id="flay"
              type="radio"
              name="celebrity-chefs-2"
              value="flay"
            />
            <label className="usa-radio__label" htmlFor="flay">
              Bobby Flay
            </label>
          </div>
          <div className="usa-radio usa-radio__inline">
            <input
              className="usa-radio__input"
              id="ramsay"
              type="radio"
              name="celebrity-chefs-2"
              value="ramsay"
            />
            <label className="usa-radio__label" htmlFor="ramsay">
              Gordon Ramsay
            </label>
          </div>
        </fieldset>
      </div>

      <div className="blue-container">
        <fieldset className="usa-fieldset">
          <legend className="usa-legend">Date of birth</legend>
          <div className="usa-memorable-date">
            <div className="usa-form-group usa-form-group--month">
              <label className="usa-label" htmlFor="date_of_birth_1">
                Month
              </label>
              <input
                className="usa-input usa-input--inline"
                aria-describedby="dobHint"
                id="date_of_birth_1"
                name="date_of_birth_1"
                type="number"
                min="1"
                max="12"
                value=""
              />
            </div>
            <div className="usa-form-group usa-form-group--day">
              <label className="usa-label" htmlFor="date_of_birth_2">
                Day
              </label>
              <input
                className="usa-input usa-input--inline"
                aria-describedby="dobHint"
                id="date_of_birth_2"
                name="date_of_birth_2"
                type="number"
                min="1"
                max="31"
                value=""
              />
            </div>
            <div className="usa-form-group usa-form-group--year">
              <label className="usa-label" htmlFor="date_of_birth_3">
                Year
              </label>
              <input
                className="usa-input usa-input--inline"
                aria-describedby="dobHint"
                id="date_of_birth_3"
                name="date_of_birth_3"
                type="number"
                min="1900"
                max="2000"
                value=""
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="usa-fieldset">
          <legend className="usa-legend">Mailing address</legend>
          <label className="usa-label" htmlFor="mailing-address-1">
            Street address 1
          </label>
          <input
            className="usa-input"
            id="mailing-address-1"
            name="mailing-address-1"
            type="text"
          />

          <label className="usa-label" htmlFor="mailing-address-2">
            Street address 2 <span className="usa-form-hint">(optional)</span>
          </label>
          <input
            className="usa-input"
            id="mailing-address-2"
            name="mailing-address-2"
            type="text"
          />

          <div className="grid-row grid-gap">
            <div className="mobile-lg:grid-col-8">
              <label className="usa-label" htmlFor="city">
                City
              </label>
              <input className="usa-input" id="city" name="city" type="text" />
            </div>
            <div className="mobile-lg:grid-col-4">
              <label className="usa-label" htmlFor="state">
                State
              </label>
              <select className="usa-select" id="state" name="state">
                <option value>- Select -</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
              </select>
            </div>
          </div>

          <label className="usa-label" htmlFor="zip">
            ZIP
          </label>
          <input
            className="usa-input usa-input--medium"
            id="zip"
            name="zip"
            type="text"
            pattern="[\d]{5}(-[\d]{4})?"
          />
        </fieldset>
      </div>
    </form>
  </section>
);
