export default async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  let workItems = await applicationContext
    .getUseCases()
    .getSentWorkItemsForSection({
      applicationContext,
      section: user.section,
    });
  return { workItems };
};
