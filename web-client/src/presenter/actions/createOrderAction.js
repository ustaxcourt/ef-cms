import { state } from 'cerebral';

/* TODO move this to its own file */
const orderTemplate = `
<!doctype html>
<html>
  <head>
    <style type="text/css">
      @page {
        margin: 3cm 2cm 2cm;
        size: 8.5in 11in;
      }
      .court-header {
        text-align: center;
      }
      .order-title-header {
        clear: both;
        font-weight: bold;
        text-align: center;
      }
      .caption-header {
        margin-bottom: 20px;
      }
      .more-indent {
        margin-left: 100px;
      }
      .caption-header .caption {
        display: inline-block;
        width: 50%;
        margin: 25px 0;
      }
      .caption.left {
        float: left;
      }
      .caption.right {
        float: right;
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
            <div class="caption left">
              <span id="caseCaption"></span>
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
            <div class="caption right">
              <p>Docket Number: <span id="docketNumber"></span></p>
            </div>
        </div>
        <div class="order-title-header" id="orderTitleHeader"></div>
      </div>
      <div id="orderBody"></div>
    </div>
  </body>
</html> 
`;

const replaceWithID = (replacements, domString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(domString, 'text/html');

  Object.keys(replacements).forEach(id => {
    doc.querySelector(id).innerHTML = replacements[id];
  });

  return doc;
};

export const createOrderAction = ({ get }) => {
  let richText = get(state.form.richText) || '';
  richText = richText.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
  const caseCaption = get(state.caseDetail.caseCaption);
  const docketNumberWithSuffix = get(
    state.formattedCaseDetail.docketNumberWithSuffix,
  );

  const doc = replaceWithID(
    {
      '#caseCaption': caseCaption,
      '#docketNumber': docketNumberWithSuffix,
      '#orderBody': richText,
      '#orderTitleHeader': 'ORDER OF DISMISSAL FOR LACK OF JURISDICTION',
    },
    orderTemplate,
  );

  const result = doc.children[0].innerHTML;

  return { htmlString: result };
};
