export default async ({ router, props }) => {
  await router.route(`/case-detail/${props.caseId}`);
};
