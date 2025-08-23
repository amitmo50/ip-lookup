import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isIP, makeRow, RowStatus, type Row } from "../../../utils/utils";
import { IP_LOOKUP_CONSTANTS } from "../ip-lookup-panel.const";
import { fetchCountry } from "../../../utils/api";

export const useIpLookup = () => {
  const [rows, setRows] = useState<Row[]>([makeRow("1")]);
  const controllers = useRef(new Map<string, AbortController>());
  const refListElement = useRef<HTMLOListElement>(null);

  // Generate a unique id for each row
  const nextId = useMemo(
    () => (Number(rows.at(-1)?.id ?? 0) + 1).toString(),
    [rows]
  );

  // Add a new row
  const handleAdd = useCallback(() => {
    setRows((currentRows: Row[]) => [...currentRows, makeRow(nextId)]);
  }, [nextId]);

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

  const fetchCountryByIp = useCallback(
    async (
      ip: string,
      token: number,
      rowId: string,
      abortController: AbortController
    ) => {
      try {
        const { country, flag, timezone } = await fetchCountry(
          ip,
          abortController.signal
        );
        // Only apply if token still current
        setRows((currentRows: Row[]) =>
          currentRows.map((currentRow) =>
            currentRow.id === rowId && currentRow.requestToken === token
              ? { ...currentRow, country, flag, timezone, status: RowStatus.OK }
              : currentRow
          )
        );
      } catch (error: unknown) {
        if (abortController.signal.aborted) return;

        setRows((currentRows: Row[]) =>
          currentRows.map((currentRow) =>
            currentRow.id === rowId && currentRow.requestToken === token
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
    []
  );

  // Start lookup
  const startLookup = useCallback(
    async (row: Row) => {
      const ip = row.ip.trim();

      if (!ip) {
        updateRow(row.id, {
          status: RowStatus.IDLE,
          error: "",
          country: "",
          flag: "",
          timezone: "",
        });
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
      const abortController = new AbortController();
      controllers.current.set(row.id, abortController);

      // Token to prevent race conditions
      const token = row.requestToken + 1;
      updateRow(row.id, {
        status: RowStatus.LOADING,
        error: "",
        requestToken: token,
      });

      await fetchCountryByIp(ip, token, row.id, abortController);
    },
    [updateRow, fetchCountryByIp]
  );
  useEffect(() => {
    refListElement.current?.scrollTo({
      top: refListElement.current?.scrollHeight,
      behavior: "smooth",
    });
  }, [rows]);

  return {
    rows,
    handleAdd,
    updateRow,
    handleRemove,
    handleKeydown,
    startLookup,
    refListElement,
  };
};
