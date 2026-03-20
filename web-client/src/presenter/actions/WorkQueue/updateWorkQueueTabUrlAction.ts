import { state } from '@web-client/presenter/app.cerebral';

export const updateWorkQueueTabUrlAction = ({
  get,
  props,
}: ActionProps<{ box: string; queue?: string; section?: string }>) => {
  const queue = props.queue || get(state.workQueueToDisplay.queue);
  const section = props.section ?? get(state.workQueueToDisplay.section);
  const { box } = props;

  const path = section
    ? `/document-qc/${queue}/${box}/selectedSection?section=${section}`
    : `/document-qc/${queue}/${box}`;

  window.history.replaceState(null, '', path);
};
