import React from 'react';

export default function FilePetition() {
  return (
    <React.Fragment>
      <section className="usa-section usa-grid">
        <h1>File a petition</h1>
        <h2>Please upload the following PDFs</h2>
        <p>* All are required.</p>
        <form>
          <div className="usa-form-group">
            <label htmlFor="petition-file">1. Petition file (form #)</label>
            <span>Contains details about your case</span>
            <input id="petition-file" type="file" />
          </div>
          <div className="usa-form-group">
            <label htmlFor="request-for-place-of-trial">
              2. Request for place of trial (form #5)
            </label>
            <span>To submit the city and state for your trial</span>
            <input id="request-for-place-of-trial" type="file" />
          </div>
          <div className="usa-form-group">
            <label htmlFor="statement-of-taxpayer-id">
              3. Statement of taxpayer identification number (form #4)
            </label>
            <span>
              To submit your Social Security number or employee identification
              number
            </span>
            <input id="statement-of-taxpayer-id" type="file" />
          </div>
          <input type="submit" value="Upload" />
        </form>
      </section>
    </React.Fragment>
  );
}
