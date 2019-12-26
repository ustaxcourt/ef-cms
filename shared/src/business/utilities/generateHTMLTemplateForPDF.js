const { capitalize } = require('lodash');

/**
 * HTML template generator for printable PDF views
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @param {object} deconstructed.options optional content that modifies the template
 * @returns {string} hydrated HTML content in string form
 */
const generateHTMLTemplateForPDF = async ({
  applicationContext,
  content,
  options = {},
}) => {
  const sassContent = require('./htmlGenerator/index.scss_');
  const template = require('./htmlGenerator/index.pug_');

  const pug = applicationContext.getPug();
  const sass = applicationContext.getNodeSass();

  const { css } = await new Promise(resolve => {
    sass.render({ data: sassContent }, (err, result) => {
      return resolve(result);
    });
  });
  const compiledFunction = pug.compile(template);
  const html = compiledFunction({
    content,
    css,
    options,
  });

  return html;
};

/**
 * HTML template generator for printable change of address/telephone PDF views
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @returns {string} hydrated HTML content in string form
 */
const generateChangeOfAddressTemplate = async ({
  applicationContext,
  content,
}) => {
  const {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    documentTitle,
    name,
    newData,
    oldData,
  } = content;

  let oldAddress = '';
  let newAddress = '';

  if (documentTitle === 'Notice of Change of Telephone Number') {
    oldAddress = `<div>${oldData.phone}</div>`;
    newAddress = `<div>${newData.phone}</div>`;
  } else {
    if (oldData.inCareOf) {
      oldAddress += `<div>c/o ${oldData.inCareOf}</div>`;
    }

    if (newData.inCareOf) {
      newAddress += `<div>c/o ${newData.inCareOf}</div>`;
    }

    oldAddress += `<div>${oldData.address1}</div>`;
    newAddress += `<div>${newData.address1}</div>`;

    if (oldData.address2) {
      oldAddress += `<div>${oldData.address2}</div>`;
    }

    if (newData.address2) {
      newAddress += `<div>${newData.address2}</div>`;
    }

    if (oldData.address3) {
      oldAddress += `<div>${oldData.address3}</div>`;
    }

    if (newData.address3) {
      newAddress += `<div>${newData.address3}</div>`;
    }

    oldAddress += `<div>${oldData.city}, ${oldData.state} ${oldData.postalCode}</div>`;
    newAddress += `<div>${newData.city}, ${newData.state} ${newData.postalCode}</div>`;

    if (oldData.country) {
      oldAddress += `<div>${oldData.country}</div>`;
    }

    if (newData.country) {
      newAddress += `<div>${newData.country}</div>`;
    }

    if (documentTitle === 'Notice of Change of Address and Telephone Number') {
      oldAddress += `<div style="margin-top:8px;">${oldData.phone}</div>`;
      newAddress += `<div style="margin-top:8px;">${newData.phone}</div>`;
    }
  }

  const main = `
    <p class="please-change">
      Please change the contact information for ${name} on the records of the Court.
    </p>
    <div>
      <table>
        <thead>
          <tr>
            <th>Old Contact Information</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              ${oldAddress}
            </td>
          </tr>
        </tbody>
      </table>
      <br /><br />
      <table>
        <thead>
          <tr>
            <th>New Contact Information</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              ${newAddress}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  const styles = `
    .please-change {
      margin-bottom: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    th, td {
      font-size: 10px;
    }
    th {
      font-weight: 600;
    }
    .case-information #caption {
      line-height:18px;
    }
  `;

  const templateContent = {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    main,
  };

  const options = {
    h3: documentTitle,
    styles,
    title: 'Change of Contact Information',
  };

  return await generateHTMLTemplateForPDF({
    applicationContext,
    content: templateContent,
    options,
  });
};

/**
 * HTML template generator for printable docket record PDF views
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @returns {string} hydrated HTML content in string form
 */
const generatePrintableDocketRecordTemplate = async ({
  applicationContext,
  content,
}) => {
  const {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    docketRecord,
    partyInfo,
  } = content;

  const styles = `
    .party-info {
      border: 1px solid #ccc;
      margin: 15px 0 30px 0;
    }

    .party-info-header {
      padding: 10px;
      border-bottom: 1px solid #ccc;
      background: #f0f0f0;
      font-size: 10px;
      font-weight: bold;
    }

    .party-info-content {
      display: flex;
      flex-flow: row wrap;
      align-items: flex-start;
      padding: 0 10px 10px 10px;
    }

    .party-details {
      width: 25%;
    }

    .docket-record-table {
      margin-top: 30px;
    }
  `;

  const templateContent = {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    main: `
    ${partyInfo}
    <div class="docket-record">${docketRecord}</div>
  `,
  };
  const options = {
    h2: 'Docket Record',
    styles,
    title: 'Docket Record',
  };

  return await generateHTMLTemplateForPDF({
    applicationContext,
    content: templateContent,
    options,
  });
};

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
  const {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    documentTitle,
    formattedTrialSessionDetails,
    openCases,
  } = content;

  const renderCases = item => {
    return `<tr>
      <td style="width: 13%;" class="valign-top">
        ${item.docketNumberWithSuffix}
      </td>
      <td class="line-height-13">${item.caseCaption}</td>
      <td style="width: 25%;" class="line-height-13">
        ${item.practitioners
          .map(practitioner => practitioner.name)
          .join('<br />')}
      </td>
      <td style="width: 25%;" class="line-height-13">
        ${item.respondents.map(respondent => respondent.name).join('<br />')}
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
            <th>Docket No.</th>
            <th>Case Name</th>
            <th>Petitioner Counsel</th>
            <th>Respondent Counsel</th>
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
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    main,
  };

  const options = {
    h3: documentTitle,
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

/**
 * HTML template generator for printable filing receipt PDF views
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @returns {string} hydrated HTML content in string form
 */
const generatePrintableFilingReceiptTemplate = async ({
  applicationContext,
  content,
}) => {
  const {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    documentsFiledContent,
    filedAt,
    filedBy,
  } = content;

  const templateContent = {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    main: `
    <div class="filing-info">
      <div class="filed-by">Filed by ${filedBy}</div>
      <div class="filed-at">Filed ${filedAt}</div>
    </div>
    <div class="clear"></div>
    <div class="grid-container-main">
      <div class="panel">
        <div class="header">
          Documents Filed
        </div>
        <div class="content grid-container">${documentsFiledContent}</div>
      </div>
    </div>
  `,
  };

  const options = {
    h3: 'Receipt of Filing',
    styles: `
      .filing-info {
        margin: 10px 0;
      }

      .filed-by {
        width: 50%;
        float: left;
      }

      .filed-at {
        width: 50%;
        float: right;
        text-align: right;
      }

      h4.document-includes-header {
        margin-bottom: 5px;
        padding-bottom: 0;
      }

      .included {
        margin: 5px 0px;
      }

      hr {
        margin: 12px 0px 8px 0px;
      }
    `,
    title: 'Receipt of Filing',
  };

  return await generateHTMLTemplateForPDF({
    applicationContext,
    content: templateContent,
    options,
  });
};

/**
 * HTML template generator for printable trial session planning report PDF views
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @returns {string} hydrated HTML content in string form
 */
const generateTrialSessionPlanningReportTemplate = async ({
  applicationContext,
  content,
}) => {
  const { previousTerms, rows, selectedTerm, selectedYear } = content;

  const contentRows = rows.map(row => {
    return `
      <tr>
        <td>${row.stateAbbreviation}</td>
        <td>${row.trialCityState}</td>
        <td>${row.allCaseCount}</td>
        <td>${row.smallCaseCount}</td>
        <td>${row.regularCaseCount}</td>
        <td>${row.previousTermsData[0].join('<br />') ||
          '<div class="calendar-icon"></div>'}</td>
        <td>${row.previousTermsData[1].join('<br />') ||
          '<div class="calendar-icon"></div>'}</td>
        <td>${row.previousTermsData[2].join('<br />') ||
          '<div class="calendar-icon"></div>'}</td>
      </tr>
    `;
  });

  const templateContent = {
    main: `
    <div class="court-header">
      <div class="us-tax-court-seal"></div>
      <h1>United States Tax Court</h1>
      <h2>Trial Session Planning Report - ${capitalize(
        selectedTerm,
      )} ${selectedYear}</h2>
    </div>
    <table>
      <thead>
        <tr>
          <th>State</th>
          <th>Location</th>
          <th>All</th>
          <th>Small</th>
          <th>Regular</th>
          <th>${capitalize(previousTerms[0].term)} ${previousTerms[0].year}</th>
          <th>${capitalize(previousTerms[1].term)} ${previousTerms[1].year}</th>
          <th>${capitalize(previousTerms[2].term)} ${previousTerms[2].year}</th>
        </tr>
      </thead>
      <tbody>
        ${contentRows.join('')}
      </tbody>
    </table>
  `,
  };

  const options = {
    overwriteMain: true,
    styles: `
      @page {
        margin: 1.75cm 0cm 1.5cm;
        size: 8.5in 11in;
      }
      @page :first {
        margin-top: 1cm;
        margin-bottom: 2cm;
      }
      .calendar-icon {
        width: 12px;
        height: 12px;
        background: url('data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhciIgZGF0YS1pY29uPSJjYWxlbmRhci10aW1lcyIgY2xhc3M9InN2Zy1pbmxpbmUtLWZhIGZhLWNhbGVuZGFyLXRpbWVzIGZhLXctMTQiIHJvbGU9ImltZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNDQ4IDUxMiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMzExLjcgMzc0LjdsLTE3IDE3Yy00LjcgNC43LTEyLjMgNC43LTE3IDBMMjI0IDMzNy45bC01My43IDUzLjdjLTQuNyA0LjctMTIuMyA0LjctMTcgMGwtMTctMTdjLTQuNy00LjctNC43LTEyLjMgMC0xN2w1My43LTUzLjctNTMuNy01My43Yy00LjctNC43LTQuNy0xMi4zIDAtMTdsMTctMTdjNC43LTQuNyAxMi4zLTQuNyAxNyAwbDUzLjcgNTMuNyA1My43LTUzLjdjNC43LTQuNyAxMi4zLTQuNyAxNyAwbDE3IDE3YzQuNyA0LjcgNC43IDEyLjMgMCAxN0wyNTcuOSAzMDRsNTMuNyA1My43YzQuOCA0LjcgNC44IDEyLjMuMSAxN3pNNDQ4IDExMnYzNTJjMCAyNi41LTIxLjUgNDgtNDggNDhINDhjLTI2LjUgMC00OC0yMS41LTQ4LTQ4VjExMmMwLTI2LjUgMjEuNS00OCA0OC00OGg0OFYxMmMwLTYuNiA1LjQtMTIgMTItMTJoNDBjNi42IDAgMTIgNS40IDEyIDEydjUyaDEyOFYxMmMwLTYuNiA1LjQtMTIgMTItMTJoNDBjNi42IDAgMTIgNS40IDEyIDEydjUyaDQ4YzI2LjUgMCA0OCAyMS41IDQ4IDQ4em0tNDggMzQ2VjE2MEg0OHYyOThjMCAzLjMgMi43IDYgNiA2aDM0MGMzLjMgMCA2LTIuNyA2LTZ6Ij48L3BhdGg+PC9zdmc+');
        background-size: 12px 12px;
      }

      tr {
        break-inside: avoid !important;
      } 
    `,
    title: 'Trial Session Planning Report',
  };

  return await generateHTMLTemplateForPDF({
    applicationContext,
    content: templateContent,
    options,
  });
};

module.exports = {
  generateChangeOfAddressTemplate,
  generateHTMLTemplateForPDF,
  generatePrintableDocketRecordTemplate,
  generatePrintableFilingReceiptTemplate,
  generateTrialCalendarTemplate,
  generateTrialSessionPlanningReportTemplate,
};
