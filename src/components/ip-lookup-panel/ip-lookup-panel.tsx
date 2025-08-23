import { IP_LOOKUP_CONSTANTS } from "./ip-lookup-panel.const";

import { IpLookupDescription } from "./components/ip-lookup-description/ip-lookup-description";
import { Divider } from "../divider/divider";
import { IpLookupHeader } from "./components/ip-lookup-header/ip-lookup-header";
import { IpLookupRow } from "./components/ip-lookup-row/ip-lookup-row";
import { useIpLookup } from "./hooks/use-ip-lookup";

export const IpLookupPanel = () => {
  const {
    rows,
    handleAdd,
    updateRow,
    handleRemove,
    handleKeydown,
    startLookup,
    refListElement,
  } = useIpLookup();

  return (
    <div className="w-full h-dvh bg-neutral-100">
      <div className="w-full h-full flex flex-col gap-[24px] bg-neutral-100 min-h-0">
        {/* Header */}
        <IpLookupHeader title={IP_LOOKUP_CONSTANTS.TITLE} />

        <div className="flex flex-col justify-start items-center gap-[20px] w-[90%] mx-auto flex-1 min-h-0">
          {/* Body */}
          <IpLookupDescription handleAdd={handleAdd} />

          {rows.length > 0 && <Divider />}

          {/* Rows */}
          <div className="w-[90%] flex-1 min-h-0 mb-[24px]">
            <ol
              className="flex flex-col items-center justify-start gap-[12px] overflow-y-auto max-h-full h-full"
              ref={refListElement}
            >
              {rows.map((row, idx) => (
                <IpLookupRow
                  key={row.id}
                  row={row}
                  index={idx + 1}
                  handleRemove={handleRemove}
                  handleKeydown={handleKeydown}
                  startLookup={startLookup}
                  updateRow={updateRow}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
