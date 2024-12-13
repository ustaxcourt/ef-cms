- Make DocketRecordSortInfo more agnostic (we can use this for anywhere we sort any field), or use the state key idea
- Figure out how to update old docketRecordSort, which I have slowly been doing
- Figure out how to avoid the different sorts we currently have going on as a result of docket number table sorting, which I started to do in generateDocketRecordPdfProxy (we were sorting the docket entries multiple times unnecessarily). It looks like we are passing along docketRecordSort and docketRecordTableSort, sometimes using one and sometimes the other (in fact, the latter was overwriting whatever we did in the former in generateDocketRecordPdfProxy). This is a code smell.
-- Do we need separate state for sorting the table vs. sorting the entries? I suspect not. But why is sessionMetaData by docket number

TODOS lists as DEVEX TODO

X - sortDocketEntryTable should be replaced by the existing sort function, but the existing sort function should use the <T> dynamic type idea of sortDocketEntryTable
