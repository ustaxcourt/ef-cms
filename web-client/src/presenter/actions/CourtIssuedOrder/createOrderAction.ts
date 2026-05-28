import { GRANT_DENY_MOTION_OPTIONS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const createOrderAction = ({ get }: ActionProps) => {
  let richText = get(state.form.richText) || '';
  const documentTitle =
    get(state.form.orderType) === GRANT_DENY_MOTION_OPTIONS.orderType
      ? 'ORDER'
      : (get(state.form.documentTitle) || '').toUpperCase();
  richText = richText.replace(
    /\t/g,
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
  );
  const eventCode = get(state.form.eventCode);

  return {
    contentHtml: richText,
    documentTitle,
    eventCode,
  };
};
