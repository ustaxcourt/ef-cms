export const systemPerformanceLogsMappings = {
  properties: {
    actionPerformanceArray: {
      properties: {
        'actionName.S': {
          type: 'keyword',
        },
        'duration.N': {
          type: 'integer',
        },
      },
      type: 'nested',
    },
    'date.S': {
      type: 'date',
    },
    'duration.N': {
      type: 'integer',
    },
    'email.S': {
      type: 'text',
    },
    'sequenceName.S': {
      type: 'keyword',
    },
  },
};

export const systemPerformanceLogsIndex: string = 'system-performance-logs';
