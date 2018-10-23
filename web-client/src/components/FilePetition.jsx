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
            <label htmlFor="petition-file">Petition file</label>
            <input id="petition-file" type="file" />
          </div>
          <div className="usa-form-group">
            <label htmlFor="request-for-place-of-trial">
              Request for place of trial
            </label>
            <input id="request-for-place-of-trial" type="file" />
          </div>
          <div className="usa-form-group">
            <label htmlFor="statement-of-taxpayer-id">
              Statement of taxpayer identification number
            </label>
            <input id="statement-of-taxpayer-id" type="file" />
          </div>
          <input type="submit" value="Upload" />
        </form>
      </section>
    </React.Fragment>
  );
}
