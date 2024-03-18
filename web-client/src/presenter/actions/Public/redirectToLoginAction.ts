export const redirectToLoginAction = ({ applicationContext, router }) => {
  router.externalRoute(`${applicationContext.getPrivateUrl()}/login`);
};
