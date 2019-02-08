import { connect } from '@cerebral/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default connect(
  {},
  function BeforeStartingCase() {
    return (
      <section className="usa-section usa-grid before-starting-case">
        <h1 tabIndex="-1">Before you begin ...</h1>
        <p>
          There are a few things you need to do before you can submit your case
          online.
        </p>
        <div role="list">
          <div role="listitem">
            <div className="fa-before" role="display">
              <FontAwesomeIcon icon={['far', 'copy']} />
            </div>
            <div className="before-explanation">
              <div className="before-label">
                Have the IRS Notice(s) You've Received Available to Submit
              </div>
              <p>
                If you've received an IRS notice, such as a Notice of Deficiency
                or Notice of Determination, you'll need to include a copy of
                those with your Petition. The U.S. Tax Court must receive all
                Petitions in a timely manner. The IRS notice shows the last date
                to file or the number of days you have to file a petition.{' '}
                <strong>
                  The Court must receive your electronically filed petition no
                  later than 11:59 pm Eastern Time on the last date to file.
                </strong>
              </p>
            </div>
          </div>

          <div role="listitem">
            <div className="fa-before" role="display">
              <FontAwesomeIcon icon={['far', 'edit']} />
            </div>
            <div className="before-explanation">
              <div className="before-label">Fill Out Your Petition Form</div>
              <p>
                Complete the petition form,{' '}
                <a
                  href="https://www.ustaxcourt.gov/forms/Petition_Simplified_Form_2.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  USTC Form 2
                </a>
                , or you can upload your own petition that complies with the
                requirements of the{' '}
                <a href="#">Tax Court Rules of Practice and Procedure</a>.{' '}
                <strong>Do not</strong> include personal information (such as
                Social Security Numbers or employer identification numbers,
                birthdates, names of minor children, or financial account
                information) in your Petition.
              </p>
            </div>
          </div>

          <div role="listitem">
            <div className="fa-before" role="display">
              <FontAwesomeIcon icon={['far', 'eye-slash']} />
            </div>
            <div className="before-explanation">
              <div className="before-label">
                Remove Personal Information From Your Petition and IRS Notice(s)
              </div>
              <p>
                If the IRS notice includes personal information (such as Social
                Security Numbers or employer identification numbers), remove or
                redact that information before including it with your Petition.
                You can remove this information by deleting it, marking through
                it so it's illegible, or any other method that will prevent it
                from being seen.
              </p>
            </div>
          </div>

          <div role="listitem">
            <div className="fa-before" role="display">
              <FontAwesomeIcon icon={['far', 'file-pdf']} />
            </div>
            <div className="before-explanation">
              <div className="before-label">
                Combine Your Petition and IRS Notice(s) Into a Single PDF
              </div>
              <p>
                Scan your petition and IRS notice into one Petition PDF or
                combine them digitally. This is what you'll upload to the Court
                to start your case.{' '}
                <a href="#">
                  Learn more about how to merge files into one PDF.
                </a>
              </p>
            </div>
          </div>

          <div role="listitem">
            <div className="fa-before stacked" role="display">
              <span className="fa-layers fa-fw">
                <FontAwesomeIcon icon={['fas', 'paperclip']} />
                <FontAwesomeIcon
                  icon={['fas', 'slash']}
                  className="slash-white"
                  color="white"
                />
                <FontAwesomeIcon icon={['fas', 'slash']} />
              </span>
            </div>
            <div className="before-explanation">
              <div className="before-label">
                Don't Submit Extra Documents With Your Petition
              </div>
              <p>
                <strong>Do not</strong> include any additional documents with
                your Petition, except for the IRS Notice. Documents that might
                be evidence can be submitted at a later time.
              </p>
            </div>
          </div>
        </div>

        <div className="button-box-container">
          <a className="usa-button" href="/start-a-case">
            Got It, Let's Start My Case
          </a>
          <a className="usa-button usa-button-secondary" href="/">
            Cancel
          </a>
        </div>
      </section>
    );
  },
);
