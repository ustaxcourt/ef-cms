import { state } from '@web-client/presenter/app.cerebral';
import { EVENT_CODES_WITH_NO_ORDER } from '@shared/business/entities/EntityConstants';

/**
 * defaults state.form.freeText if props.key is eventCode and props.value is NOT or O
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setDefaultFreeTextForCourtIssuedDocketEntryAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { key, value } = props;
  if (key === 'eventCode' && value) {
    const eventCode = value;
    const isEditingDocketEntry = get(state.isEditingDocketEntry);
    if (isEditingDocketEntry) {
      return;
    }

    if (eventCode === 'NOT') {
      store.set(state.form.freeText, 'Notice');
    } else if (!EVENT_CODES_WITH_NO_ORDER.includes(eventCode)) {
      const text = get(state.form.freeText);

      store.set(
        state.form.freeText,
        text.startsWith('Order') ? text : `Order - ${text}`,
      );
    }
  }
};
