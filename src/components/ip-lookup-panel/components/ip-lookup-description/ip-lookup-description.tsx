import { PlusIcon } from "@radix-ui/react-icons";
import { IP_LOOKUP_CONSTANTS } from "../../ip-lookup-panel.const";
import type { IpLookupDescriptionProps } from "../../ip-lookup-panel.type";

export const IpLookupDescription = ({
  handleAdd,
}: IpLookupDescriptionProps) => {
  return (
    <div className="flex flex-col items-start justify-center w-[90%] py-[4px] gap-[12px]">
      <p className="text-[18px] text-[#363636] text-left">
        {IP_LOOKUP_CONSTANTS.DESCRIPTION}
      </p>
      <button
        className="px-[12px] rounded-sm bg-blue-700 text-white hover:bg-blue-800"
        type="button"
        data-testid="add-row-button"
        onClick={handleAdd}
        style={{ cursor: "pointer" }}
      >
        <span className="flex flex-row items-center gap-[8px] min-h-[32px] text-[14px]">
          <PlusIcon />
          {IP_LOOKUP_CONSTANTS.ADD_BUTTON_TEXT}
        </span>
      </button>
    </div>
  );
};
