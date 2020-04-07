const { capitalize } = require('lodash');
const { generateHTMLTemplateForPDF } = require('./generateHTMLTemplateForPDF');

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
        <td>${
          row.previousTermsData[0].join('<br />') ||
          '<div class="calendar-icon"></div>'
        }</td>
        <td>${
          row.previousTermsData[1].join('<br />') ||
          '<div class="calendar-icon"></div>'
        }</td>
        <td>${
          row.previousTermsData[2].join('<br />') ||
          '<div class="calendar-icon"></div>'
        }</td>
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

module.exports = { generateTrialSessionPlanningReportTemplate };
