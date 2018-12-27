import { state } from 'cerebral';

export default get => {
  const selectedWorkItems = get(state.selectedWorkItems);

  return {
    showSendToBar: selectedWorkItems.length > 0,
  };
};
