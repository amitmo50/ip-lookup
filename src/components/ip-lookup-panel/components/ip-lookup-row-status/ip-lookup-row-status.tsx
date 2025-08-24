import { Tooltip } from "@radix-ui/themes";
import { RowStatus } from "../../../../utils/utils";
import { LoadingSpinner } from "../../../loading-spinner/loading-spinner";
import type { IpLookupRowStatusProps } from "../../ip-lookup-panel.type";

export const IpLookupRowStatus = ({ row }: IpLookupRowStatusProps) => {
  return (
    <div
      className="h-[24px] text-sm flex items-center gap-[12px]"
      data-testid="row-status"
    >
      {row.status === RowStatus.LOADING && <LoadingSpinner />}
      {row.status === RowStatus.OK && (
        <div className="flex flex-row items-center gap-[12px]">
          <Tooltip content={row.country}>
            <img
              className="w-[32px] h-[32px]"
              src={row.flag}
              alt={row.country}
            />
          </Tooltip>
          <span className="text-emerald-700">{row.timezone}</span>
        </div>
      )}
      {row.status === RowStatus.ERROR && (
        <span className="text-red-600">{row.error}</span>
      )}
    </div>
  );
};
