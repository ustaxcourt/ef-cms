import { state } from 'cerebral';

export const createOrderHelper = get => {
  let richText = get(state.form.richText) || '';
  const caseCaption = get(state.caseDetail.caseCaption);

  richText = richText.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');

  let pdfTemplate = `
    <!doctype html>
    <html>
      <head>
        <style type="text/css">
          @page {
            size: 8.5in 11in;
            margin: 2cm;
          }
          .court-header {
            text-align: center;
          }
          .order-title-header {
            text-align: center;
            font-weight: bold;
          }
          .caption-header {
            margin-bottom: 20px;
          }
          .more-indent {
            margin-left: 100px;
          }
        </style>
      </head>
      <body>
        <div class="main">
          <div class="content-header">
            <div class="court-header">
              UNITED STATES TAX COURT<br>
              Washington, DC 20217
            </div>
            <div class="caption-header">
              ${caseCaption}
              <br>
              <div class="more-indent">
                v.
              </div>
              Commissioner of Internal Revenue
              <br>
              <div class="more-indent">
                Respondent
              </div>
            </div>
            <div class="order-title-header">
              ORDER OF DISMISSAL FOR LACK OF JURISDICTION
            </div>
          </div>
          ${richText}
        </div>
      </body>
    </html>
  `;

  return { pdfTemplate };
};
