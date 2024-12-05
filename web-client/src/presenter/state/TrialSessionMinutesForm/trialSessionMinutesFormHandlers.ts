export type OnChangeHandler = ({
  name,
  rowInfo,
  section,
  value,
}: {
  name: string;
  rowInfo?: { key: string; nestedName?: string };
  section: string;
  value: string | boolean;
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
