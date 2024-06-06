import { openPdfInNewTabAction } from '../actions/openPdfInNewTabAction';

export const openPdfInNewTabSequence = [openPdfInNewTabAction] as unknown as ({
  file,
}: {
  file: Blob;
}) => void;
