export const toggleShowPasswordAction = ({
  props,
  store,
}: ActionProps<{ passwordType: string }>) => {
  store.toggle(props.passwordType);
};
