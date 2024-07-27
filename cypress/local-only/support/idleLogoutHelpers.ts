import { ITestableWindow } from '../../../types/ITestableWindow';

// This is a hack, but I do not know a better way.
export const overrideIdleTimeouts = ({
  modalTimeout,
  sessionTimeout,
  windowObj, // For native cypress, this needs to be defined. For the puppeteer plugin, it should be left blank.
}: {
  modalTimeout: number;
  sessionTimeout: number;
  windowObj?: ITestableWindow;
}) => {
  const currentWindow = windowObj || (window as unknown as ITestableWindow);
  currentWindow.cerebral.getModel().set(['constants'], {
    ...currentWindow.cerebral.getState().constants,
    SESSION_MODAL_TIMEOUT: modalTimeout,
    SESSION_TIMEOUT: sessionTimeout,
  });
};

// Set whether or not to render instance management components
// (components for tracking idle activity, broadcasting, etc.).
// When true, most cypress tests fail in CI; this function allows
// us to set it to true only in tests that need it.
export const setRenderInstanceManagement = ({
  value,
  windowObj, // For native cypress, this needs to be defined. For the puppeteer plugin, it should be left blank.
}: {
  value: boolean;
  windowObj?: ITestableWindow;
}) => {
  const currentWindow = windowObj || (window as unknown as ITestableWindow);
  currentWindow.setRenderInstanceManagement(value);
};
