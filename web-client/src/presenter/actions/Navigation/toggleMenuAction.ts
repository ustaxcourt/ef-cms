import { state } from '@web-client/presenter/app.cerebral';

export const toggleMenuAction = ({
  get,
  props,
  store,
}: ActionProps<{ openMenu?: string; caseDetailMenu?: string }>) => {
  const openMenu = get(state.navigation.openMenu);
  if (openMenu === props.openMenu) {
    store.unset(state.navigation.openMenu);
  } else {
    store.set(state.navigation.openMenu, props.openMenu);
  }

  const caseDetailMenu = get(state.navigation.caseDetailMenu);
  if (caseDetailMenu === props.caseDetailMenu) {
    store.unset(state.navigation.caseDetailMenu);
  } else {
    store.set(state.navigation.caseDetailMenu, props.caseDetailMenu);
  }
};
