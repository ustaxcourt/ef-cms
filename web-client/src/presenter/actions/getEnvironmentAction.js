export default async ({ applicationContext, path }) => {
  const env = await applicationContext.getCurrentEnvironment();
  console.log(env)
  return path[env]();
};
