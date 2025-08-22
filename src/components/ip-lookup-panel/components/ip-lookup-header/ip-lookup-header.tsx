import type { IpLookupHeaderProps } from "../../ip-lookup-panel.type";

export const IpLookupHeader = ({ title }: IpLookupHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between border-[#D3D3D3] border-b py-[12px] px-[20px]">
      <h3 className="text-xl font-semibold text-[#363636]">{title}</h3>
    </div>
  );
};
