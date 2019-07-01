/**
 * uploadPdf
 * @param policy
 * @param file
 * @returns {Promise<*>}
 */
exports.uploadPdf = async ({
  applicationContext,
  file,
  onUploadProgress,
  policy,
}) => {
  const documentId = applicationContext.getUniqueId();
  const formData = new FormData();
  formData.append('key', documentId);
  formData.append('X-Amz-Algorithm', policy.fields['X-Amz-Algorithm']);
  formData.append('X-Amz-Credential', policy.fields['X-Amz-Credential']);
  formData.append('X-Amz-Date', policy.fields['X-Amz-Date']);
  formData.append(
    'X-Amz-Security-Token',
    policy.fields['X-Amz-Security-Token'] || '',
  );
  formData.append('Policy', policy.fields.Policy);
  formData.append('X-Amz-Signature', policy.fields['X-Amz-Signature']);
  formData.append('Content-Type', 'application/pdf');
  formData.append('file', file, file.name || 'fileName');
  await applicationContext
    .getHttpClient()
    .post(policy.url, formData, {
      headers: {
        /* eslint no-underscore-dangle: ["error", {"allow": ["_boundary"] }] */
        'content-type': `multipart/form-data; boundary=${formData._boundary}`,
      },
      onUploadProgress,
    })
    .then(r => {
      onUploadProgress({ isDone: true });
      return r;
    });
  return documentId;
};
