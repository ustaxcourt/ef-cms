import { state } from '@web-client/presenter/app.cerebral';

export const updateTrialSessionMinutesFormAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { name, section, value } = props;
  store.set(state.minuteSheetForm[section][name], value);
  console.log(get(state.minuteSheetForm[section]));
};
