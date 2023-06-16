import { state } from '@web-client/presenter/app.cerebral';

/**
 * defaults state.form.freeText if props.key is eventCode and props.value is NOT or O
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setDefaultFreeTextForCourtIssuedDocketEntryAction = ({
  props,
  store,
}: ActionProps) => {
  const { key, value } = props;
  if (key === 'eventCode' && value) {
    const eventCode = value;

    if (eventCode === 'NOT') {
      store.set(state.form.freeText, 'Notice');
    } else if (eventCode === 'O') {
      store.set(state.form.freeText, 'Order');
    }
  }
};
