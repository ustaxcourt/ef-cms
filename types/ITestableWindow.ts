export interface ITestableWindow {
  cerebral: {
    getState: () => any;
    getModel: () => any;
  };
}
