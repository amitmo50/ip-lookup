import { PlusIcon } from "@radix-ui/react-icons";
import { IP_LOOKUP_CONSTANTS } from "../../ip-lookup-panel.const";
import { Button } from "@radix-ui/themes";
import type { IpLookupDescriptionProps } from "../../ip-lookup-panel.type";

export const IpLookupDescription = ({
  handleAdd,
}: IpLookupDescriptionProps) => {
  return (
    <div className="flex flex-col items-start justify-center w-[90%] py-[4px] gap-[12px]">
      <p className="text-[16px] text-[#363636]">
        {IP_LOOKUP_CONSTANTS.DESCRIPTION}
      </p>
      <Button
        type="button"
        onClick={handleAdd}
        variant="solid"
        size="2"
        style={{ cursor: "pointer" }}
      >
        <PlusIcon />
        {IP_LOOKUP_CONSTANTS.ADD_BUTTON_TEXT}
      </Button>
    </div>
  );
};
