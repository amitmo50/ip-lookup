import { useCallback, useMemo, useRef, useState } from "react";
import { isIP, makeRow, RowStatus, type Row } from "../../../utils/utils";
import { IP_LOOKUP_CONSTANTS } from "../ip-lookup-panel.const";
import { fetchCountry } from "../../../utils/api";

export const useIpLookup = () => {
  const [rows, setRows] = useState<Row[]>([makeRow("1")]);
  const controllers = useRef(new Map<string, AbortController>());

  // Generate a unique id for each row
  const nextId = useMemo(
    () => (Number(rows.at(-1)?.id ?? 0) + 1).toString(),
    [rows]
  );

  // Add a new row
  const handleAdd = useCallback(
    () => setRows((currentRows: Row[]) => [...currentRows, makeRow(nextId)]),
    [nextId]
  );

  // Update a row
  const updateRow = useCallback(
    (id: string, patch: Partial<Row>) =>
      setRows((currentRows: Row[]) =>
        currentRows.map((row) => (row.id === id ? { ...row, ...patch } : row))
      ),
    []
  );

  // Remove a row
  const handleRemove = useCallback(
    (id: string) =>
      setRows((currentRows: Row[]) => {
        if (currentRows.length === 1) {
          return [makeRow("1")];
        }
        return currentRows.filter((row) => row.id !== id);
      }),
    []
  );

  // Handle keydown event
  const handleKeydown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") e.currentTarget.click();
    },
    []
  );

  // Start lookup
  const startLookup = useCallback(
    async (row: Row) => {
      const ip = row.ip.trim();

      if (!ip) {
        setRows([makeRow(nextId)]);
        return;
      }

      if (!isIP(ip)) {
        updateRow(row.id, {
          status: RowStatus.ERROR,
          error: IP_LOOKUP_CONSTANTS.INVALID_IP_ERROR,
        });
        return;
      }

      // Abort any in-flight request for this row
      const prev = controllers.current.get(row.id);
      if (prev) prev.abort();
      const ac = new AbortController();
      controllers.current.set(row.id, ac);

      // Token to prevent race conditions
      const token = row.requestToken + 1;
      updateRow(row.id, {
        status: RowStatus.LOADING,
        error: "",
        requestToken: token,
      });

      try {
        const { country, flag, timezone } = await fetchCountry(ip, ac.signal);
        // Only apply if token still current
        setRows((currentRows: Row[]) =>
          currentRows.map((currentRow) =>
            currentRow.id === row.id && currentRow.requestToken === token
              ? { ...currentRow, country, flag, timezone, status: RowStatus.OK }
              : currentRow
          )
        );
      } catch (error: unknown) {
        if (ac.signal.aborted) return;
        setRows((currentRows: Row[]) =>
          currentRows.map((currentRow) =>
            currentRow.id === row.id && currentRow.requestToken === token
              ? {
                  ...currentRow,
                  status: RowStatus.ERROR,
                  error:
                    error instanceof Error
                      ? error.message
                      : IP_LOOKUP_CONSTANTS.LOOKUP_FAILED_ERROR,
                }
              : currentRow
          )
        );
      }
    },
    [updateRow, nextId]
  );

  return {
    rows,
    handleAdd,
    updateRow,
    handleRemove,
    handleKeydown,
    startLookup,
  };
};
