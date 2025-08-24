import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { Theme } from "@radix-ui/themes";
import { IpLookupDescription } from "../ip-lookup-description";
import { IP_LOOKUP_CONSTANTS } from "../../../ip-lookup-panel.const";

// Wrapper component to provide Radix UI Theme context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Theme>{children}</Theme>
);

describe("IpLookupDescription", () => {
  const mockHandleAdd = vi.fn();

  beforeEach(() => {
    mockHandleAdd.mockClear();
  });

  it("renders the description text", () => {
    render(
      <TestWrapper>
        <IpLookupDescription handleAdd={mockHandleAdd} />
      </TestWrapper>
    );

    expect(
      screen.getByText(IP_LOOKUP_CONSTANTS.DESCRIPTION)
    ).toBeInTheDocument();
  });

  it("renders the add button with correct text", () => {
    render(
      <TestWrapper>
        <IpLookupDescription handleAdd={mockHandleAdd} />
      </TestWrapper>
    );

    const addButton = screen.getByRole("button", { name: /add/i });
    expect(addButton).toHaveTextContent(IP_LOOKUP_CONSTANTS.ADD_BUTTON_TEXT);
  });

  it("renders the plus icon in the button", () => {
    render(
      <TestWrapper>
        <IpLookupDescription handleAdd={mockHandleAdd} />
      </TestWrapper>
    );

    const button = screen.getByRole("button", { name: /add/i });
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("calls handleAdd when the add button is clicked", () => {
    render(
      <TestWrapper>
        <IpLookupDescription handleAdd={mockHandleAdd} />
      </TestWrapper>
    );

    const addButton = screen.getByRole("button", { name: /add/i });
    fireEvent.click(addButton);

    expect(mockHandleAdd).toHaveBeenCalledTimes(1);
  });

  it("has correct button styling and attributes", () => {
    render(
      <TestWrapper>
        <IpLookupDescription handleAdd={mockHandleAdd} />
      </TestWrapper>
    );

    const addButton = screen.getByRole("button", { name: /add/i });

    expect(addButton).toHaveAttribute("type", "button");
    expect(addButton).toHaveStyle({ cursor: "pointer" });
  });
});
