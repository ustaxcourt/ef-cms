import { Judge } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

export type OnChangeHandler = ({
  name,
  rowInfo,
  section,
  value,
}: {
  name: string;
  rowInfo?: { key: string; nestedName?: string };
  section: string;
  value: string | boolean | Judge;
}) => void;

export type AddRowHandler = ({
  name,
  section,
}: {
  name: string;
  section: string;
}) => void;

export type RemoveRowHandler = ({
  key,
  name,
  section,
}: {
  name: string;
  key: string;
  section: string;
}) => void;

export type DownloadPdfHandler = () => void;

export type AutoSaveHandler = () => void;
