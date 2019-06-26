import { state } from 'cerebral';

export const createOrderHelper = get => {
  const richText = get(state.form.richText);
  const docketNumber = get(state.caseDetail.docketNumber);
  const caseCaption = get(state.caseDetail.caseCaption);

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
          </div>
          ${richText}
        </div>
      </body>
    </html>
  `;

  return { pdfTemplate };
};
