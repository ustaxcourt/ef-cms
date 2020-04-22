const { checkSearchClientMappings } = require('./checkSearchClientMappings');

describe('checkSearchClientMappings', () => {
  let applicationContext;
  let notifyMock;
  let environment = {
    elasticsearchEndpoint: '',
  };

  beforeEach(() => {
    jest.resetModules();
    jest.mock('aws-sdk', () => ({
      EnvironmentCredentials: function EnvironmentCredentials() {},
      config: {
        httpOptions: {
          timeout: null,
        },
      },
    }));

    notifyMock = jest.fn();

    applicationContext = {
      environment,
      initHoneybadger: jest.fn().mockReturnValue({
        notify: notifyMock,
      }),
    };
  });

  it('sends a warning when when the counts hit the 50% threshold', async () => {
    jest.mock('elasticsearch', () => ({
      Client: function Client() {
        return {
          indices: {
            getMapping: () => ({
              efcms: {
                mappings: {
                  properties: {
                    field1: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field2: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field3: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field4: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field5: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                  },
                },
              },
            }),
            getSettings: () => ({
              efcms: {
                settings: {
                  index: {
                    mapping: {
                      total_fields: {
                        limit: 10,
                      },
                    },
                  },
                },
              },
            }),
          },
        };
      },
    }));

    await checkSearchClientMappings({ applicationContext });

    expect(notifyMock).toHaveBeenCalledWith(
      'Warning: Search Client Mappings have reached the 50% threshold - currently 50%',
    );
  });

  it('sends a warning when when the counts hit the 75% threshold', async () => {
    jest.mock('elasticsearch', () => ({
      Client: function Client() {
        return {
          indices: {
            getMapping: () => ({
              efcms: {
                mappings: {
                  properties: {
                    field1: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field2: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field3: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field4: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field5: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field6: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field7: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field8: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field9: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                  },
                },
              },
            }),
            getSettings: () => ({
              efcms: {
                settings: {
                  index: {
                    mapping: {
                      total_fields: {
                        limit: 10,
                      },
                    },
                  },
                },
              },
            }),
          },
        };
      },
    }));

    await checkSearchClientMappings({ applicationContext });

    expect(notifyMock).toHaveBeenCalledWith(
      'Warning: Search Client Mappings have reached the 75% threshold - currently 90%',
    );
  });

  it('does not send a warning when when the counts do not meet a threshold', async () => {
    jest.mock('elasticsearch', () => ({
      Client: function Client() {
        return {
          indices: {
            getMapping: () => ({
              efcms: {
                mappings: {
                  properties: {
                    field1: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                  },
                },
              },
            }),
            getSettings: () => ({
              efcms: {
                settings: {
                  index: {
                    mapping: {
                      total_fields: {
                        limit: 10,
                      },
                    },
                  },
                },
              },
            }),
          },
        };
      },
    }));

    await checkSearchClientMappings({ applicationContext });

    expect(notifyMock).not.toHaveBeenCalled();
  });

  it('does not send a warning if honeybadger can not be instantiated', async () => {
    jest.mock('elasticsearch', () => ({
      Client: function Client() {
        return {
          indices: {
            getMapping: () => ({
              efcms: {
                mappings: {
                  properties: {
                    field1: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field2: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field3: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field4: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field5: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                  },
                },
              },
            }),
            getSettings: () => ({
              efcms: {
                settings: {
                  index: {
                    mapping: {
                      total_fields: {
                        limit: 10,
                      },
                    },
                  },
                },
              },
            }),
          },
        };
      },
    }));

    applicationContext.initHoneybadger = () => null;

    await checkSearchClientMappings({ applicationContext });

    expect(notifyMock).not.toHaveBeenCalled();
  });

  it('sends a warning when when the number of fields indexed on a given object exceed 50', async () => {
    jest.mock('elasticsearch', () => ({
      Client: function Client() {
        return {
          indices: {
            getMapping: () => ({
              efcms: {
                mappings: {
                  properties: {
                    field1: {
                      properties: {
                        S: {
                          type: 'text',
                        },
                      },
                    },
                    field2: {
                      properties: (() => {
                        const fiftyOneProperties = {};
                        for (let i = 0; i < 51; i++) {
                          fiftyOneProperties[`prop_${i}`] = { type: 'text' };
                        }
                        return fiftyOneProperties;
                      })(),
                    },
                  },
                },
              },
            }),
            getSettings: () => ({
              efcms: {
                settings: {
                  index: {
                    mapping: {
                      total_fields: {
                        limit: 10,
                      },
                    },
                  },
                },
              },
            }),
          },
        };
      },
    }));

    await checkSearchClientMappings({ applicationContext });
    expect(notifyMock.mock.calls[0]).toEqual([
      'Warning: Search Client creating greater than 50 indexes on the following fields: field2: 51',
    ]);
    expect(notifyMock.mock.calls[1]).toEqual([
      'Warning: Search Client Mappings have reached the 75% threshold - currently 520%',
    ]);
  });
});
