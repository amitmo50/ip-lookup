import type { KeyboardEventHandler } from "react";
import type { Row } from "../../utils/utils";

// IpLookupRowProps
export type IpLookupRowProps = {
  row: Row;
  index: number;
  handleRemove: (rowId: string) => void;
  handleKeydown: KeyboardEventHandler<HTMLInputElement>;
  startLookup: (row: Row) => void;
  updateRow: (rowId: string, param: Partial<Row>) => void;
};

// IpLookupHeaderProps
export type IpLookupHeaderProps = {
  title: string;
};

// IpLookupDescriptionProps
export type IpLookupDescriptionProps = {
  handleAdd: () => void;
};

// IpLookupRowStatusProps
export type IpLookupRowStatusProps = {
  row: Row;
};
