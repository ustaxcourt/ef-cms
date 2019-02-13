export default async ({ applicationContext, path }) => {
  const env = await applicationContext.getCurrentEnvironment();
  return path[env]();
};
