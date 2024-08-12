export const systemPerformanceLogsMappings = {
  properties: {
    actionPerformanceArray: {
      properties: {
        actionName: {
          type: 'keyword',
        },
        duration: {
          type: 'float',
        },
      },
      type: 'nested',
    },
    date: {
      type: 'date',
    },
    duration: {
      type: 'float',
    },
    email: {
      type: 'text',
    },
    sequenceName: {
      type: 'keyword',
    },
  },
};

export const systemPerformanceLogsIndex: string = 'system-performance-logs';
