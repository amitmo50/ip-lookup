import { IconButton, TextField, Tooltip } from "@radix-ui/themes";
import { RowStatus } from "../../../../utils/utils";
import { IpLookupRowStatus } from "../ip-lookup-row-status/ip-lookup-row-status";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { IP_LOOKUP_CONSTANTS } from "../../ip-lookup-panel.const";
import type { IpLookupRowProps } from "../../ip-lookup-panel.type";

export const IpLookupRow = ({
  row,
  index,
  handleRemove,
  handleKeydown,
  startLookup,
  updateRow,
}: IpLookupRowProps) => {
  return (
    <li
      key={row.id}
      className="flex flex-row justify-center items-center gap-[12px] w-full transition-all duration-300 ease-in-out hover:bg-neutral-200 rounded-md px-[4px] py-[8px]"
    >
      <Tooltip content={IP_LOOKUP_CONSTANTS.TOOLTIP_REMOVE_ROW}>
        <IconButton
          data-testid="remove-row-button"
          type="button"
          variant="soft"
          radius="full"
          size="2"
          onClick={() => handleRemove(row.id)}
          style={{ cursor: "pointer" }}
        >
          <Cross2Icon />
        </IconButton>
      </Tooltip>

      <div className="flex items-center justify-center w-[32px] h-[32px] p-[12px] rounded-full text-(--accent-a11) bg-(--accent-a3)">
        {index}
      </div>
      <div className="flex flex-row items-center justify-start gap-[12px] w-full">
        {/* IP input */}
        <TextField.Root
          size="3"
          className="w-[80%]"
          placeholder={IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER}
          value={row.ip}
          onChange={(e) => updateRow(row.id, { ip: e.target.value })}
          onBlur={() => startLookup(row)}
          onKeyDown={handleKeydown}
          disabled={row.status === RowStatus.LOADING}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>

        {/* Status / result */}
        <IpLookupRowStatus row={row} />
      </div>
    </li>
  );
};
