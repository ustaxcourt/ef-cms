export const waitAction = async ({ applicationContext, props }) => {
  await applicationContext.getUtilities().sleep(props.retryAfter || 3000);
};
