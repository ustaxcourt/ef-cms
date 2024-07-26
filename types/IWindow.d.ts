export interface IWindowWithCerebralExposed {
  cerebral: {
    getState: () => any;
    getModel: () => any;
  };
}
