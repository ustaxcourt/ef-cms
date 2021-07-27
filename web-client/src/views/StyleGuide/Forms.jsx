import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { SelectSearch } from '../../ustc-ui/Select/SelectSearch';
import React from 'react';

export const Forms = () => (
  <section className="usa-section grid-container">
    <h1>Forms</h1>
    <hr />
    <form className="usa-form usa-form--large">
      <div className="blue-container margin-bottom-4">
        <div className="usa-form-group">
          <label className="usa-label" htmlFor="input-text">
            Text input
          </label>
          <input className="usa-input" id="input-text" type="text" />
        </div>

        <div className="usa-form-group">
          <label className="usa-label with-hint" htmlFor="input-text-hint">
            Text input with hint text
          </label>
          <span className="usa-hint">This is your hint!</span>
          <input className="usa-input" id="input-text-hint" type="text" />
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor="input-text-optional">
            Text input <span className="usa-hint">(optional)</span>
          </label>
          <input className="usa-input" id="input-text-optional" type="text" />
        </div>

        <div className="usa-form-group usa-form-group--error">
          <label className="usa-label" htmlFor="input-text-error">
            Text input with error
          </label>
          <input
            className="usa-input usa-input--error"
            id="input-text-error"
            type="text"
          />
          <span className="usa-error-message">Error message</span>
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor="input-email">
            Email input
          </label>
          <input className="usa-input" id="input-email" type="email" />
        </div>
        <div className="usa-form-group usa-form-group--error">
          <label className="usa-label" htmlFor="input-email-error">
            Email input with error
          </label>
          <input
            className="usa-input usa-input--error"
            id="input-email-error"
            type="email"
          />
          <span className="usa-error-message">Error message</span>
        </div>
        <div className="usa-form-group">
          <label className="usa-label" htmlFor="input-number">
            Number input
          </label>
          <input className="usa-input" id="input-number" type="number" />
        </div>

        <div className="usa-form-group usa-form-group--error">
          <label className="usa-label" htmlFor="input-number-error">
            Number input with error
          </label>
          <input
            className="usa-input usa-input--error"
            id="input-number-error"
            type="number"
          />
          <span className="usa-error-message">Error message</span>
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor="input-tel">
            Phone input
          </label>
          <input
            className="usa-input max-width-200"
            id="input-tel"
            type="tel"
          />
        </div>

        <div className="usa-form-group usa-form-group--error">
          <label className="usa-label" htmlFor="input-tel-error">
            Phone input with error
          </label>
          <input
            className="usa-input max-width-200 usa-input--error"
            id="input-tel-error"
            type="tel"
          />
          <span className="usa-error-message">Error message</span>
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor="input-file">
            File input
          </label>
          <input id="input-file" type="file" />
        </div>

        <div className="usa-form-group usa-form-group--error">
          <label className="usa-label" htmlFor="input-file-error">
            File input with error
          </label>
          <input id="input-file-error" type="file" />
          <span className="usa-error-message">Error message</span>
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor="options">
            Dropdown label
          </label>
          <select className="usa-select" id="options">
            <option value>- Select -</option>
            <option value="value1">Option A</option>
            <option value="value2">Option B</option>
            <option value="value3">Option C</option>
          </select>
        </div>
        <div className="usa-form-group">
          <label className="usa-label" htmlFor="options-disabled">
            Dropdown label (disabled)
          </label>
          <select disabled className="usa-select" id="options-disabled">
            <option value>- Select -</option>
            <option value="value1">Option A</option>
            <option value="value2">Option B</option>
            <option value="value3">Option C</option>
          </select>
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor="options-searchable">
            Dropdown label (searchable)
          </label>
          <SelectSearch
            id="options-searchable"
            options={[
              { label: 'Bananas (BA)', value: 'BA' },
              { label: 'Craps (C)', value: 'C' },
              { label: 'Carrots (CA)', value: 'CA' },
              { label: 'Baccarat (B)', value: 'B' },
            ]}
          />
        </div>

        <div className="usa-form-group usa-form-group--error">
          <label className="usa-label" htmlFor="options-error">
            Dropdown label with error
          </label>
          <select className="usa-select usa-select--error" id="options-error">
            <option value>- Select -</option>
            <option value="value1">Option A</option>
            <option value="value2">Option B</option>
            <option value="value3">Option C</option>
          </select>
          <span className="usa-error-message">Error message</span>
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor="textarea">
            Text Area
          </label>
          <textarea className="usa-textarea" id="textarea" />
        </div>

        <div className="usa-form-group usa-form-group--error">
          <label className="usa-label" htmlFor="textarea-error">
            Text Area with error
          </label>
          <textarea
            className="usa-textarea usa-textarea--error"
            id="textarea-error"
          />
          <span className="usa-error-message">Error message</span>
        </div>

        <fieldset className="usa-fieldset">
          <legend className="usa-legend">Checkboxes</legend>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id="truth"
              name="historical-figures-1"
              type="checkbox"
              value="truth"
            />
            <label className="usa-checkbox__label" htmlFor="truth">
              Sojourner Truth
            </label>
          </div>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id="douglass"
              name="historical-figures-1"
              type="checkbox"
              value="douglass"
            />
            <label className="usa-checkbox__label" htmlFor="douglass">
              Frederick Douglass
            </label>
          </div>
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id="washington"
              name="historical-figures-1"
              type="checkbox"
              value="washington"
            />
            <label className="usa-checkbox__label" htmlFor="washington">
              Booker T. Washington
            </label>
          </div>
          <div className="usa-checkbox">
            <input
              disabled
              className="usa-checkbox__input"
              id="carver"
              name="historical-figures-1"
              type="checkbox"
            />
            <label className="usa-checkbox__label" htmlFor="carver">
              George Washington Carver
            </label>
          </div>
        </fieldset>

        <fieldset className="usa-fieldset">
          <legend className="usa-legend">Radio Buttons</legend>
          <div className="usa-radio">
            <input
              defaultChecked
              className="usa-radio__input"
              id="stanton"
              name="historical-figures-2"
              type="radio"
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
              name="historical-figures-2"
              type="radio"
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
              name="historical-figures-2"
              type="radio"
              value="tubman"
            />
            <label className="usa-radio__label" htmlFor="tubman">
              Harriet Tubman
            </label>
          </div>
        </fieldset>

        <fieldset className="usa-fieldset margin-bottom-0">
          <legend className="usa-legend">Inline Radio Buttons</legend>
          <div className="usa-radio usa-radio__inline">
            <input
              defaultChecked
              className="usa-radio__input"
              id="fieri"
              name="celebrity-chefs-2"
              type="radio"
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
              name="celebrity-chefs-2"
              type="radio"
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
              name="celebrity-chefs-2"
              type="radio"
              value="ramsay"
            />
            <label className="usa-radio__label" htmlFor="ramsay">
              Gordon Ramsay
            </label>
          </div>
        </fieldset>
      </div>

      <div className="blue-container margin-bottom-4">
        <DateInput
          id="date_of_birth"
          label="Date of birth"
          names={{
            day: 'date_of_birth_1',
            month: 'date_of_birth_2',
            year: 'date_of_birth_3',
          }}
          values={{
            day: 'date_of_birth_1',
            month: 'date_of_birth_2',
            year: 'date_of_birth_3',
          }}
        />

        <fieldset className="usa-fieldset margin-bottom-0">
          <legend className="usa-legend sr-only">Mailing address</legend>
          <div className="usa-form-group">
            <label className="usa-label" htmlFor="mailing-address-1">
              Mailing Address 1
            </label>
            <input
              className="usa-input"
              id="mailing-address-1"
              name="mailing-address-1"
              type="text"
            />
          </div>
          <div className="usa-form-group">
            <label className="usa-label" htmlFor="mailing-address-2">
              Mailing Address 2 <span className="usa-hint">(optional)</span>
            </label>
            <input
              className="usa-input"
              id="mailing-address-2"
              name="mailing-address-2"
              type="text"
            />
          </div>

          <div className="grid-row grid-gap">
            <div className="mobile-lg:grid-col-8">
              <div className="usa-form-group">
                <label className="usa-label" htmlFor="city">
                  City
                </label>
                <input
                  className="usa-input"
                  id="city"
                  name="city"
                  type="text"
                />
              </div>
            </div>
            <div className="mobile-lg:grid-col-4">
              <div className="usa-form-group">
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
          </div>

          <div className="usa-form-group margin-bottom-0">
            <label className="usa-label" htmlFor="zip">
              ZIP
            </label>
            <input
              className="usa-input max-width-200 usa-input--medium"
              id="zip"
              name="zip"
              pattern="[\d]{5}(-[\d]{4})?"
              type="text"
            />
          </div>
        </fieldset>
      </div>
    </form>
  </section>
);
