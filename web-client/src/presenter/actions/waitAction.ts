export const waitAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  await applicationContext.getUtilities().sleep(props.retryAfter || 3000);
};
