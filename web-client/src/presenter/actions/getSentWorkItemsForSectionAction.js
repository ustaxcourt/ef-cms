export default async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  let sectionWorkItems = await applicationContext
    .getUseCases()
    .getSentWorkItemsForSection({
      applicationContext,
      section: user.section,
      userId: user.userId,
    });
  return { sectionWorkItems };
};
