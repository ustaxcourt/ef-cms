import axios from 'axios';

export const api = {
  getHello: async baseUrl => {
    try {
      const response = await axios.get(`${baseUrl}/hello`);
      return response.data;
    } catch (error) {
      return 'Bad response!';
    }
  },

  addDocument: async baseUrl => {
    try {
      const response = await axios.put(`${baseUrl}/document`);
      return response.data;
    } catch (error) {
      return error;
    }
  },

  filePetition: async baseUrl => {
    try {
      const response = await axios.put(`${baseUrl}/petitions`);
      return response.data;
    } catch (error) {
      return error;
    }
  },
};
