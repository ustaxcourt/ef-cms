import axios from 'axios';

export const api = {
  getDocumentPolicy: async baseUrl => {
    try {
      const response = await axios.get(`${baseUrl}/documents/policy`);
      return response.data;
    } catch (error) {
      return error;
    }
  },

  addDocument: async baseUrl => {
    try {
      const response = await axios.post(`${baseUrl}/document`, {});
      return response.data;
    } catch (error) {
      return error;
    }
  },

  filePetition: async baseUrl => {
    try {
      const response = await axios.post(`${baseUrl}/petitions`);
      return response.data;
    } catch (error) {
      return error;
    }
  },
};
