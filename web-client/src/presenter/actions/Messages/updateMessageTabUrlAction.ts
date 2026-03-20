import { state } from '@web-client/presenter/app.cerebral';

export const updateMessageTabUrlAction = ({
  get,
  props,
}: ActionProps<{ box: string; queue: string; section?: string }>) => {
  const queue = props.queue || get(state.messageBoxToDisplay.queue);
  const section = props.section ?? get(state.messageBoxToDisplay.section);
  const { box } = props;

  const path = section
    ? `/messages/${queue}/${box}/selectedSection?section=${section}`
    : `/messages/${queue}/${box}`;

  window.history.replaceState(null, '', path);
};
