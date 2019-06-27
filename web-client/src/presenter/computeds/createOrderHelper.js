import { state } from 'cerebral';
import orderTemplate from '../../views/CreateOrder/orderTemplate.html';

const replaceWithID = (replacements, domString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(domString, 'text/html');

  Object.keys(replacements).forEach(id => {
    doc.querySelector(id).innerHTML = replacements[id];
  });

  return doc;
};

export const createOrderHelper = get => {
  let richText = get(state.form.richText) || '';
  richText = richText.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
  const caseCaption = get(state.caseDetail.caseCaption);

  const doc = replaceWithID(
    {
      '#caseCaption': caseCaption,
      '#orderBody': richText,
      '#orderTitleHeader': 'ORDER OF DISMISSAL FOR LACK OF JURISDICTION',
    },
    orderTemplate,
  );

  const result = doc.children[0].innerHTML;

  return { pdfTemplate: result };
};
