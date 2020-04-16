const { generateHTMLTemplateForPDF } = require('./generateHTMLTemplateForPDF');

/**
 * HTML template generator for trial calendar PDF views
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @returns {string} hydrated HTML content in string form
 */
const generateTrialCalendarTemplate = async ({
  applicationContext,
  content,
}) => {
  const { formattedTrialSessionDetails, openCases } = content;

  const renderCases = item => {
    return `<tr>
      <td style="width: 13%;" class="valign-top">
        ${item.docketNumberWithSuffix}
      </td>
      <td class="line-height-13">${item.caseName}</td>
      <td style="width: 25%;" class="line-height-13">
        ${item.privatePractitioners
          .map(practitioner => practitioner.name)
          .join('<br />')}
      </td>
      <td style="width: 25%;" class="line-height-13">
        ${item.irsPractitioners
          .map(respondent => respondent.name)
          .join('<br />')}
      </td>
    </tr>`;
  };

  const renderTrialCalendar = () => {
    return `
      <div class="court-header">
        <div class="us-tax-court-seal"></div>
        <h1 class="mb-1 text-center">United States Tax Court</h1>
        <h2 class="text-center">${
          formattedTrialSessionDetails.trialLocation
        }</h2>
        <h3 class="text-center">
          ${formattedTrialSessionDetails.formattedStartDateFull}
          ${formattedTrialSessionDetails.sessionType}
        </h3>
      </div>

      <div class="grid-container-main">
        <div class="panel">
          <div class="header">
            Trial Information
          </div>

          <div class="content grid-container">
            <div class="pr-1">
              <h4>Start Time</h4>
              <p>${formattedTrialSessionDetails.formattedStartTime}</p>
            </div>
            <div class="pr-1">
              <h4>Location</h4>
              ${
                formattedTrialSessionDetails.noLocationEntered
                  ? '<p>No location entered</p>'
                  : ''
              }
              <p>${formattedTrialSessionDetails.courthouseName || ''}</p>
              <p>
                <span class="address-line">
                  ${formattedTrialSessionDetails.address1 || ''}
                </span>
                <span class="address-line">
                  ${formattedTrialSessionDetails.address2 || ''}
                </span>
                <span class="address-line">
                  ${formattedTrialSessionDetails.formattedCityStateZip || ''}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div></div>
        <div class="panel">
          <div class="header">
            Assignments
          </div>
          <div class="content grid-container">
            <div class="pr-1">
              <h4>Judge</h4>
              <p class="mb-2">${formattedTrialSessionDetails.formattedJudge}</p>

              <h4>Court Reporter</h4>
              <p>${formattedTrialSessionDetails.formattedCourtReporter}</p>
            </div>
            <div class="pr-1">
              <h4>Trial Clerk</h4>
              <p class="mb-2">${
                formattedTrialSessionDetails.formattedTrialClerk
              }</p>

              <h4>IRS Calendar Administrator</h4>
              <p>${
                formattedTrialSessionDetails.formattedIrsCalendarAdministrator
              }</p>
            </div>
          </div>
        </div>
      </div>

      <div class="panel mb-4">
        <div class="header">
          Session Notes
        </div>
        <div class="content notes">
          <p>${formattedTrialSessionDetails.notes || ''}</p>
        </div>
      </div>

      <h3 class="open-cases bold">Open Cases (${openCases.length})</h3>

      <table>
        <thead>
          <tr>
            <th>Docket no.</th>
            <th>Case title</th>
            <th>Petitioner counsel</th>
            <th>Respondent counsel</th>
          </tr>
        </thead>
        <tbody>
          ${openCases.map(renderCases).join('')}
        </tbody>
      </table>
    `;
  };

  const main = renderTrialCalendar();

  const templateContent = {
    main,
  };

  const options = {
    overwriteMain: true,
    styles: `
      body {
        margin: 35px 50px 10px 50px;
        font-family: sans-serif;
        font-size: 10px;
      }

      h1 {
        padding-top: 10px;
        margin-bottom: 0px;
        font-size: 24px;
        line-height: 15px;
      }

      h2 {
        margin-top: 0px;
        /* padding-bottom: 15px; */
        font-size: 20px;
        font-weight: normal;
      }

      h3 {
        margin-top: 0px;
        font-family: sans-serif;
        font-size: 14px;
        font-weight: normal;
      }

      .bold {
        font-weight: bold;
      }

      .text-center {
        text-align: center;
      }

      table {
        width: 100%;
        border: 1px solid #ccc;
        -webkit-border-horizontal-spacing: 0px;

        border-spacing: 0;
        -webkit-border-vertical-spacing: 0px;
      }

      th,
      td {
        border-bottom: 1px solid #ccc;
        text-align: left;
        vertical-align: top;
      }

      td {
        padding: 12px 8px;
        line-height: 13px;
        vertical-align: top;
      }

      th {
        padding: 8px 10px 10px 8px;
        white-space: nowrap;
      }

      th {
        background-color: #f0f0f0;
      }

      .grid-container {
        display: grid;
        grid-gap: 10px;
        grid-template-columns: 50% 50%;
      }

      .grid-container-main {
        display: grid;
        grid-template-columns: 49% 2% 49%;
      }

      .mb-1 {
        margin-bottom: 10px;
      }

      .mb-2 {
        margin-bottom: 20px;
      }

      h4 {
        margin-bottom: 0px;
      }

      p {
        margin-top: 4px;
      }

      .address-line {
        display: block;
      }

      .court-header {
        margin-bottom: 30px;
        font-family: serif;
      }

      .panel {
        border: 1px solid #ccc;
        margin: 15px 0 5px 0;
      }

      .header {
        padding: 8px 10px;
        border-bottom: 1px solid #ccc;
        background: #f0f0f0;
        font-size: 10px;
        font-weight: bold;
      }

      .open-cases {
        font-size: 12px;
      }

      .content {
        min-height: 15px;
        padding: 0 10px 10px 10px;
      }

      .content.notes {
        padding-top: 12px;
      }

      .mb-4 {
        margin-bottom: 40px;
      }

      .pr-1 {
        padding-right: 10px;
      }

      @page {
        margin-bottom: 55px;
      }

      @page :first {
        margin-top: 0;
      }
    `,
    title: 'Change of Contact Information',
  };

  return await generateHTMLTemplateForPDF({
    applicationContext,
    content: templateContent,
    options,
  });
};

module.exports = { generateTrialCalendarTemplate };
