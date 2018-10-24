import axios from 'axios';

export const api = {
  getDocument: async baseUrl => {
    try {
      const response = await axios.get(`${baseUrl}/document`);
      return response.data;
    } catch (error) {
      return 'Bad response!';
    }
  },
};
