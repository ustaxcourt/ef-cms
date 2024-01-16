export const navigateToChangePasswordAction = async ({ props, router }) => {
  await router.route(`/change-password?userEmail=${props.userEmail}`);
};
