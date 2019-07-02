import { state } from 'cerebral';
import orderTemplate from '../../../views/CreateOrder/orderTemplate.html';

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
  let documentTitle = get(state.form.documentTitle);
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
      '#orderTitleHeader': documentTitle,
    },
    orderTemplate,
  );

  const result = doc.children[0].innerHTML;

  return { htmlString: result };
};
