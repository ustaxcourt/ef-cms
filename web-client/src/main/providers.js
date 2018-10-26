import axios from 'axios';

export const api = {
  getDocumentPolicy: async baseUrl => {
    try {
      const response = await axios.get(`${baseUrl}/documents/policy`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDocumentId: async (baseUrl, user, type) => {
    try {
      const response = await axios.post(`${baseUrl}/documents`, {
        userId: user,
        documentType: type,
      });
      return response.data;
    } catch (error) {
      return error;
    }
  },

  uploadDocumentToS3: async (policy, documentId, file) => {
    try {
      let formData = new FormData();
      formData.append('key', documentId);
      formData.append('X-Amz-Algorithm', policy.fields['X-Amz-Algorithm']);
      formData.append('X-Amz-Credential', policy.fields['X-Amz-Credential']);
      formData.append('X-Amz-Date', policy.fields['X-Amz-Date']);
      formData.append(
        'X-Amz-Security-Token',
        policy.fields['X-Amz-Security-Token'],
      );
      formData.append('Policy', policy.fields.Policy);
      formData.append('X-Amz-Signature', policy.fields['X-Amz-Signature']);
      formData.append('file', file, file.name);
      await axios.post(policy.url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return;
    } catch (error) {
      return error;
    }
  },
};
