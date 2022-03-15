import React from 'react';

export const PretrialMemorandum = ({ trialInfo }) => {
  return (
    <div>
      <p style={{ marginBottom: '20px', textAlign: 'right' }}>
        Trial Calendar: {trialInfo.formattedTrialLocation}
        <br />
        <span>Date: {trialInfo.formattedStartDate}</span>
      </p>

      <p className="text-center" style={{ marginBottom: '10px' }}>
        <span className="text-bold">PRETRIAL MEMORANDUM FOR </span>
        <span className="text-underline">(Petitioner/Respondent)</span>
        <br />
        (Please type or print legibly. This form may be expanded as necessary.)
      </p>
      <div style={{ marginBottom: '29px' }}>
        <p style={{ float: 'left', width: '60%' }}>
          <span className="text-bold text-underline">NAME OF CASE</span>:
        </p>
        <p style={{ float: 'left', width: '39%' }}>
          <span className="text-bold text-underline">DOCKET NO(S).</span>:
        </p>
        <div className="clear"></div>
      </div>

      <p style={{ marginBottom: '10px' }}>
        <span className="text-bold text-underline">ATTORNEYS</span>:
      </p>
      <div style={{ marginBottom: '23px' }}>
        <p
          className="margin-top-0"
          style={{ float: 'left', marginRight: '1%', width: '49%' }}
        >
          Petitioner: ___________________________________
          <br />
          Tel No.: _____________________________________
          <br />
          Email: ______________________________________
        </p>
        <p
          className="margin-top-0"
          style={{ float: 'left', marginRight: '1%', width: '49%' }}
        >
          Respondent: __________________________________
          <br />
          Tel No.: _____________________________________
          <br />
          Email: ______________________________________
        </p>
        <div className="clear"></div>
      </div>

      <p style={{ marginBottom: '20px' }}>
        <strong className="text-underline">AMOUNTS IN DISPUTE</strong>:
      </p>
      <p className="margin-top-0" style={{ marginBottom: '52px' }}>
        <span className="text-underline text-bold">Year(s)/Period(s)</span>
        <span
          className="text-underline text-bold"
          style={{ marginLeft: '95px' }}
        >
          Deficiencies/Liabilities
        </span>
        <span
          className="text-underline text-bold"
          style={{ marginLeft: '95px' }}
        >
          Additions/Penalties
        </span>
      </p>
      <p>
        <strong className="text-underline">STATUS OF CASE</strong>:
      </p>
      <p style={{ marginBottom: '30px' }}>
        <span>Probable Settlement________</span>
        <span style={{ marginLeft: '30px' }}>Probable Trial________</span>
        <span style={{ marginLeft: '30px' }}>Definite Trial________</span>
      </p>
      <p style={{ marginBottom: '30px' }}>
        <strong className="text-underline">
          CURRENT ESTIMATE OF TRIAL TIME:
        </strong>
        __________________________________________hour(s)
      </p>
      <p style={{ marginBottom: '53px' }}>
        <strong className="text-underline">MOTIONS YOU EXPECT TO MAKE</strong>:
        <br />
        (Title and brief description)
      </p>
      <p style={{ marginBottom: '2px' }}>
        <strong className="text-underline">
          STATUS OF STIPULATION OF FACTS:
        </strong>
      </p>

      <p className="margin-top-0" style={{ marginBottom: '45px' }}>
        <input id="completed" type="checkbox"></input>
        <label htmlFor="completed" id="completed-label">
          Completed, will be filed electronically
        </label>
        <input
          id="in-progress"
          style={{ marginLeft: '15px' }}
          type="checkbox"
        ></input>
        <label htmlFor="in-progress" id="in-progress-label">
          In Progress
        </label>
      </p>
      <p>
        <strong className="text-underline">ISSUES</strong>:
      </p>

      <div style={{ pageBreakAfter: 'always' }}></div>

      <p style={{ marginBottom: '88px' }}>
        <strong className="text-underline">
          WITNESS(ES) YOU EXPECT TO CALL:
        </strong>
        <br />
        (Name and brief summary of expected testimony)
      </p>
      <p style={{ marginBottom: '97px' }}>
        <strong className="text-underline">SUMMARY OF FACTS</strong>:
        <br />
        (Attach separate pages, if necessary, to inform the Court of facts in
        chronological narrative form)
      </p>

      <p style={{ marginBottom: '91px' }}>
        <strong className="text-underline">
          BRIEF SYNOPSIS OF LEGAL AUTHORITIES:
        </strong>
        <br />
        (Attach separate pages, if necessary, to fully discuss your legal
        position)
      </p>

      <p style={{ marginBottom: '91px' }}>
        <strong className="text-underline">EVIDENTIARY PROBLEMS</strong>:
      </p>

      <div style={{ marginBottom: '61px' }}>
        <p style={{ float: 'left', width: '40%' }}>
          <span className="text-bold">Date:</span> _________________________
        </p>
        <p style={{ float: 'left', width: '59%' }}>
          ________________________________________
          <br />
          Petitioner/ Respondent
        </p>
        <div className="clear"></div>
      </div>

      <div className="final-page-footer">
        <p style={{ float: 'left', width: '15%' }}>Trial Judge:</p>

        <p style={{ float: 'left', width: '70%' }}>
          <strong>
            {trialInfo.formattedJudgeName}
            <br />
            United States Tax Court
            <br />
            400 Second Street, N.W.
            <br />
            Washington, D.C. 20217
            <br />
            {trialInfo.chambersPhoneNumber}
          </strong>
        </p>

        <div className="clear"></div>
      </div>
    </div>
  );
};
