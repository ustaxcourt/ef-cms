import { state } from 'cerebral';
import orderTemplate from '../../../views/CreateOrder/orderTemplate.html';

const replaceWithID = (replacements, domString) => {
  const parser = new window.DOMParser();
  const doc = parser.parseFromString(domString, 'text/html');

  Object.keys(replacements).forEach(id => {
    if (doc.querySelector(id)) {
      doc.querySelector(id).innerHTML = replacements[id];
    }
  });

  return doc;
};

export const createOrderAction = async ({ applicationContext, get }) => {
  let richText = get(state.form.richText) || '';
  let documentTitle = (get(state.form.documentTitle) || '').toUpperCase();
  richText = richText.replace(
    /\t/g,
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
  );
  const caseDetail = get(state.caseDetail);
  const caseCaption = caseDetail.caseCaption || '';
  const isOrderEvent = get(state.form.eventCode) == 'NOT'; // 'NOT' === 'notice'
  let caseTitle = applicationContext.getCaseTitle(caseCaption);
  let caseCaptionExtension = '';
  if (caseTitle !== caseCaption) {
    caseTitle += ', ';
    caseCaptionExtension = caseCaption.replace(caseTitle, '');
  }
  let signatureForNotice = '';
  if (isOrderEvent) {
    signatureForNotice = `<p>${applicationContext.getClerkOfCourtNameForSigning()}<br />Clerk of the Court</p>`;
  }

  const docketNumberWithSuffix = applicationContext
    .getUtilities()
    .formatDocketNumberWithSuffix(caseDetail);

  const doc = replaceWithID(
    {
      '#caseCaptionExtension': caseCaptionExtension,
      '#caseTitle': caseTitle,
      '#docketNumber': docketNumberWithSuffix,
      '#orderBody': richText,
      '#orderTitleHeader': documentTitle,
      '#signature': signatureForNotice,
    },
    orderTemplate,
  );

  let result = doc.children[0].innerHTML;

  result = result.replace(
    '/* STYLES_PLACEHOLDER */',
    await applicationContext.getPdfStyles(),
  );

  return { htmlString: result };
};
