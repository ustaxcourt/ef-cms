import { IWindowWithCerebralExposed } from '../../../types/IWindow';

// This is a hack, but I do not know a better way.
export const overrideIdleTimeouts = ({
  modalTimeout,
  sessionTimeout,
  windowObj, // For native cypress, this needs to be defined. For the puppeteer plugin, it should be left blank.
}: {
  modalTimeout: number;
  sessionTimeout: number;
  windowObj?: IWindowWithCerebralExposed;
}) => {
  const currentWindow =
    windowObj || (window as unknown as IWindowWithCerebralExposed);
  currentWindow.cerebral.getModel().set(['constants'], {
    ...currentWindow.cerebral.getState().constants,
    SESSION_MODAL_TIMEOUT: modalTimeout,
    SESSION_TIMEOUT: sessionTimeout,
  });
};
