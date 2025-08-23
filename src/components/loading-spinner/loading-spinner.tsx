export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={`size-[18px] rounded-full border-2 border-[#D3D3D3] border-t-[#008000] animate-spin p-[2px] ${className || ''}`}
    />
  );
};
