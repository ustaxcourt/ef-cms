export default async ({ applicationContext, props }) => {
  const {
    url,
  } = await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    documentId: props.documentId,
    applicationContext,
  });
  window.open(url, '_blank', 'noopener noreferrer');
};
