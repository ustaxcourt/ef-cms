export default async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  let sectionWorkItems = await applicationContext
    .getUseCases()
    .getWorkItemsBySection({
      applicationContext,
      section: user.section,
      userId: user.userId,
    });
  return { sectionWorkItems };
};
