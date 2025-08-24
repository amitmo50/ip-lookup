import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { Theme } from "@radix-ui/themes";
import { IpLookupPanel } from "../ip-lookup-panel";
import { IP_LOOKUP_CONSTANTS } from "../ip-lookup-panel.const";
import * as api from "../../../utils/api";

// Wrapper component to provide Radix UI Theme context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Theme>{children}</Theme>
);

// Mock the api module
vi.mock("../../../utils/api", () => ({
  fetchCountry: vi.fn(),
}));

const mockFetchCountry = vi.mocked(api.fetchCountry);

const mockSuccessResponse = {
  country: "United States",
  flag: "https://example.com/flag.png",
  timezone: "12:34:56",
};

const mockErrorResponse = new Error("Lookup failed");

describe("IpLookupPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Component Rendering", () => {
    it("renders the main title", () => {
      render(
        <TestWrapper>
          <IpLookupPanel />
        </TestWrapper>
      );

      expect(screen.getByText(IP_LOOKUP_CONSTANTS.TITLE)).toBeInTheDocument();
    });

    it("renders the description", () => {
      render(
        <TestWrapper>
          <IpLookupPanel />
        </TestWrapper>
      );

      expect(
        screen.getByText(IP_LOOKUP_CONSTANTS.DESCRIPTION).parentElement
      ).toHaveClass(
        "flex",
        "flex-col",
        "items-start",
        "justify-center",
        "w-[90%]",
        "py-[4px]",
        "gap-[12px]"
      );
    });

    it("renders with one initial row", () => {
      render(
        <TestWrapper>
          <IpLookupPanel />
        </TestWrapper>
      );

      const ipInputs = screen.getAllByPlaceholderText(
        IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER
      );
      expect(ipInputs).toHaveLength(1);
    });

    it("does not show divider when there are no rows", () => {
      render(
        <TestWrapper>
          <IpLookupPanel />
        </TestWrapper>
      );

      // The divider should not be visible when there's only the initial empty row
      const divider = screen.queryByRole("separator");
      expect(divider).not.toBeInTheDocument();
    });
  });

  describe("Adding and Removing Rows", () => {
    it("adds a new row when the add button is clicked", async () => {
      render(
        <TestWrapper>
          <IpLookupPanel />
        </TestWrapper>
      );

      const addButton = screen.getByTestId("add-row-button");
      fireEvent.click(addButton);

      await waitFor(() => {
        const ipInputs = screen.getAllByPlaceholderText(
          IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER
        );
        expect(ipInputs).toHaveLength(2);
      });
    });

    it("removes a row when remove button is clicked (but keeps at least one)", async () => {
      render(
        <TestWrapper>
          <IpLookupPanel />
        </TestWrapper>
      );

      // Add a second row first
      const addButton = screen.getByTestId("add-row-button");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(
          screen.getAllByPlaceholderText(IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER)
        ).toHaveLength(2);
      });

      // Remove the second row
      const removeButtons = screen.getAllByTestId("remove-row-button");
      expect(removeButtons).toHaveLength(2);
      fireEvent.click(removeButtons[1]);

      await waitFor(() => {
        const ipInputs = screen.getAllByPlaceholderText(
          IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER
        );
        expect(ipInputs).toHaveLength(1);
      });
    });

    it("clears data when removing the last row instead of removing it", async () => {
      render(
        <TestWrapper>
          <IpLookupPanel />
        </TestWrapper>
      );

      // Add some text to the input
      const ipInput = screen.getByPlaceholderText(
        IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER
      );
      fireEvent.change(ipInput, { target: { value: "8.8.8.8" } });

      // Remove the only row
      const removeButton = screen.getByTestId("remove-row-button");
      fireEvent.click(removeButton);

      await waitFor(() => {
        const ipInputs = screen.getAllByPlaceholderText(
          IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER
        );
        expect(ipInputs).toHaveLength(1);
        expect(ipInputs[0]).toHaveValue("");
      });
    });
  });

  describe("API Integration", () => {
    it("displays loading state during API call", async () => {
      // Mock a delayed response
      mockFetchCountry.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockSuccessResponse), 100)
          )
      );

      render(
        <TestWrapper>
          <IpLookupPanel />
        </TestWrapper>
      );

      const ipInput = screen.getByPlaceholderText(
        IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER
      );

      fireEvent.change(ipInput, { target: { value: "8.8.8.8" } });
      fireEvent.blur(ipInput);

      // Should show loading spinner
      await waitFor(() => {
        const rowStatus = screen.getByTestId("row-status");
        expect(rowStatus).toBeInTheDocument();
        // Look for the loading spinner inside the row status
        expect(rowStatus.querySelector(".animate-spin")).toBeInTheDocument();
      });
    });

    it("displays country data after successful API call", async () => {
      mockFetchCountry.mockResolvedValueOnce(mockSuccessResponse);

      render(
        <TestWrapper>
          <IpLookupPanel />
        </TestWrapper>
      );

      const ipInput = screen.getByPlaceholderText(
        IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER
      );

      fireEvent.change(ipInput, { target: { value: "8.8.8.8" } });
      fireEvent.blur(ipInput);

      await waitFor(() => {
        expect(
          screen.getByText(mockSuccessResponse.timezone)
        ).toBeInTheDocument();
      });

      // Should display the flag image with country name in alt attribute
      const flagImage = screen.getByAltText(mockSuccessResponse.country);
      expect(flagImage).toBeInTheDocument();
      expect(flagImage).toHaveAttribute("src", mockSuccessResponse.flag);
    });

    it("displays error message when API call fails", async () => {
      mockFetchCountry.mockRejectedValueOnce(mockErrorResponse);

      render(
        <TestWrapper>
          <IpLookupPanel />
        </TestWrapper>
      );

      const ipInput = screen.getByPlaceholderText(
        IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER
      );

      fireEvent.change(ipInput, { target: { value: "8.8.8.8" } });
      fireEvent.blur(ipInput);

      await waitFor(() => {
        expect(screen.getByText(mockErrorResponse.message)).toBeInTheDocument();
      });
    });

    it("handles multiple concurrent API calls correctly", async () => {
      const firstResponse = {
        country: "United States",
        flag: "https://cdn.ipwhois.io/flags/us.svg",
        timezone: "04:02:26",
      };
      const secondResponse = {
        country: "Australia",
        flag: "https://cdn.ipwhois.io/flags/au.svg",
        timezone: "21:02:26",
      };

      mockFetchCountry
        .mockResolvedValueOnce(firstResponse)
        .mockResolvedValueOnce(secondResponse);

      render(
        <TestWrapper>
          <IpLookupPanel />
        </TestWrapper>
      );

      // Add a second row
      const addButton = screen.getByRole("button", { name: /add/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(
          screen.getAllByPlaceholderText(IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER)
        ).toHaveLength(2);
      });

      const ipInputs = screen.getAllByPlaceholderText(
        IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER
      );

      // Make both API calls
      fireEvent.change(ipInputs[0], { target: { value: "8.8.8.8" } });
      fireEvent.change(ipInputs[1], { target: { value: "1.1.1.1" } });
      fireEvent.blur(ipInputs[0]);
      fireEvent.blur(ipInputs[1]);

      // Both responses should be displayed
      await waitFor(() => {
        expect(screen.getByAltText(firstResponse.country)).toBeInTheDocument();
        expect(screen.getByAltText(secondResponse.country)).toBeInTheDocument();
        expect(screen.getByText(firstResponse.timezone)).toBeInTheDocument();
        expect(screen.getByText(secondResponse.timezone)).toBeInTheDocument();
      });
    });

    it("validates IPv4 addresses correctly", async () => {
      mockFetchCountry.mockResolvedValueOnce(mockSuccessResponse);

      render(
        <TestWrapper>
          <IpLookupPanel />
        </TestWrapper>
      );

      const ipInput = screen.getByPlaceholderText(
        IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER
      );

      // Use a public IPv4 address that won't be rejected as reserved
      fireEvent.change(ipInput, { target: { value: "1.1.1.1" } });
      fireEvent.blur(ipInput);

      await waitFor(() => {
        expect(mockFetchCountry).toHaveBeenCalledWith(
          "1.1.1.1",
          expect.any(AbortSignal)
        );
      });
    });

    it("validates IPv6 addresses correctly", async () => {
      mockFetchCountry.mockResolvedValueOnce(mockSuccessResponse);

      render(
        <TestWrapper>
          <IpLookupPanel />
        </TestWrapper>
      );

      const ipInput = screen.getByPlaceholderText(
        IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER
      );

      fireEvent.change(ipInput, { target: { value: "2001:4860:4860::8888" } });
      fireEvent.blur(ipInput);

      await waitFor(() => {
        expect(mockFetchCountry).toHaveBeenCalledWith(
          "2001:4860:4860::8888",
          expect.any(AbortSignal)
        );
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid successive lookups on the same row", async () => {
      mockFetchCountry
        .mockResolvedValueOnce(mockSuccessResponse)
        .mockResolvedValueOnce({
          ...mockSuccessResponse,
          country: "Different Country",
        });

      render(
        <TestWrapper>
          <IpLookupPanel />
        </TestWrapper>
      );

      const ipInput = screen.getByPlaceholderText(
        IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER
      );

      fireEvent.change(ipInput, { target: { value: "8.8.8.8" } });

      // Make two rapid calls
      fireEvent.blur(ipInput);
      fireEvent.blur(ipInput);

      // Should handle race conditions properly
      await waitFor(() => {
        // Check that at least one of the responses is displayed via flag alt text
        const elements = screen.queryAllByRole("img");
        const hasCountryFlag = elements.some(
          (el) =>
            el.getAttribute("alt")?.includes("Country") ||
            el.getAttribute("alt")?.includes("United States")
        );
        expect(hasCountryFlag).toBe(true);
      });
    });

    it("trims whitespace from IP input", async () => {
      mockFetchCountry.mockResolvedValueOnce(mockSuccessResponse);

      render(
        <TestWrapper>
          <IpLookupPanel />
        </TestWrapper>
      );

      const ipInput = screen.getByPlaceholderText(
        IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER
      );

      fireEvent.change(ipInput, { target: { value: "  8.8.8.8  " } });
      fireEvent.blur(ipInput);

      await waitFor(() => {
        expect(mockFetchCountry).toHaveBeenCalledWith(
          "8.8.8.8",
          expect.any(AbortSignal)
        );
      });
    });
  });

  describe("Row Numbers", () => {
    it("displays correct row numbers", async () => {
      render(
        <TestWrapper>
          <IpLookupPanel />
        </TestWrapper>
      );

      // Add multiple rows
      const addButton = screen.getByRole("button", { name: /add/i });
      fireEvent.click(addButton);
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(
          screen.getAllByPlaceholderText(IP_LOOKUP_CONSTANTS.IP_PLACEHOLDER)
        ).toHaveLength(3);
      });

      // Check that row numbers are displayed
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });
});
