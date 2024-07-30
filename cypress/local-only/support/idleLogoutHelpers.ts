import { ITestableWindow } from '../../helpers/ITestableWindow';

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
