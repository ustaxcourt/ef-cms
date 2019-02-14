export default async ({ applicationContext, props }) => {
  const user = await applicationContext.getUseCases().getUser(props.user);
  return { user };
};
