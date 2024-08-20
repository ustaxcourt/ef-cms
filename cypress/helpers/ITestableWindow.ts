// An interface for exposing the cerebral controller on the window object, which
// can be useful for temporarily overwriting constants in cypress.
export interface ITestableWindow {
  cerebral: {
    getState: () => any;
    getModel: () => any;
  };
}
