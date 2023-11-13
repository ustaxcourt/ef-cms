export const toggleShowPasswordAction = ({ props, store }: ActionProps) => {
  store.toggle(props.passwordType);
};
