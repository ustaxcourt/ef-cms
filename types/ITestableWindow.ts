export interface ITestableWindow {
  cerebral: {
    getState: () => any;
    getModel: () => any;
  };
  setRenderInstanceManagement: any;
}
