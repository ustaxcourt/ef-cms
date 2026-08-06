import { SelectSearch } from '@web-client/ustc-ui/Select/SelectSearch';
import { connect } from '@web-client/presenter/shared.cerebral';
import { reactSelectValue } from '@web-client/ustc-ui/Utils/documentTypeSelectHelper';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useDeferredValue, useMemo, useState } from 'react';

const MAX_VISIBLE_OPTIONS = 50;

type DocumentTypeOption = {
  label: string;
  value: string;
  eventCode: string;
};

type DocumentTypeSearchProps = {
  ariaLabel: string;
  dataTestid: string;
  id: string;
  isClearable?: boolean;
  isMulti?: boolean;
  name: string;
  selectedEventCode?: string;
  onChange: (eventCode: string) => void;
};

const matches = (option: DocumentTypeOption, input: string) =>
  option.label.toLowerCase().includes(input) ||
  option.value.toLowerCase().includes(input);

export const DocumentTypeSearch = connect<
  DocumentTypeSearchProps,
  { documentTypes: DocumentTypeOption[] }
>(
  {
    documentTypes:
      state.internalTypesHelper.internalDocumentTypesForSelectSorted,
  },
  function DocumentTypeSearch({
    ariaLabel,
    dataTestid,
    documentTypes,
    id,
    isClearable = true,
    isMulti = false,
    name,
    onChange,
    selectedEventCode,
  }) {
    const [inputValue, setInputValue] = useState('');
    const deferredInputValue = useDeferredValue(inputValue);

    const visibleOptions = useMemo(() => {
      const input = deferredInputValue.trim().toLowerCase();
      if (!input) return documentTypes;
      const filtered: DocumentTypeOption[] = [];
      for (const option of documentTypes) {
        if (matches(option, input)) {
          filtered.push(option);
          if (filtered.length === MAX_VISIBLE_OPTIONS) break;
        }
      }
      return filtered;
    }, [documentTypes, deferredInputValue]);

    const value = useMemo(
      () =>
        reactSelectValue({
          documentTypes,
          selectedEventCode,
        }),
      [documentTypes, selectedEventCode],
    );

    return (
      <SelectSearch
        aria-label={ariaLabel}
        data-testid={dataTestid}
        filterOption={() => true}
        id={id}
        inputValue={inputValue}
        isClearable={isClearable}
        isMulti={isMulti}
        name={name}
        options={visibleOptions}
        value={value}
        onChange={(picked: any) => {
          onChange(picked?.value || '');
          return true;
        }}
        onInputChange={(text: string, meta: { action: string }) => {
          if (meta.action === 'input-change') setInputValue(text);
          else if (meta.action === 'menu-close' || meta.action === 'set-value')
            setInputValue('');
        }}
      />
    );
  },
);

DocumentTypeSearch.displayName = 'DocumentTypeSearch';
