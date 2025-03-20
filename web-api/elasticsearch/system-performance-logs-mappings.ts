export const systemPerformanceLogsMappings = {
  properties: {
    category: {
      type: 'keyword',
    },
    date: {
      type: 'date',
    },
    duration: {
      type: 'integer',
    },
    environment: {
      type: 'keyword',
    },
    eventName: {
      type: 'keyword',
    },
  },
};

export const systemPerformanceLogsIndex: string = 'system-performance-logs';
