import { render } from "@testing-library/react";
import { LoadingSpinner } from "../loading-spinner";

describe("LoadingSpinner", () => {
  it("renders correctly", () => {
    const { container } = render(<LoadingSpinner />);

    // Get the first div element (the spinner itself)
    const spinner = container.firstChild as HTMLElement;
    expect(spinner).toBeInTheDocument();
    expect(spinner.tagName).toBe("DIV");
  });

  it("applies custom className when provided", () => {
    const customClass = "custom-class";
    const { container } = render(<LoadingSpinner className={customClass} />);

    const spinner = container.firstChild as HTMLElement;
    expect(spinner).toHaveClass(customClass);
    // Should still have default classes
    expect(spinner).toHaveClass("size-[18px]", "animate-spin");
  });

  it("maintains all classes when custom className is provided", () => {
    const customClass = "my-custom-spinner";
    const { container } = render(<LoadingSpinner className={customClass} />);

    const spinner = container.firstChild as HTMLElement;

    // Check that the custom class is included
    expect(spinner.className).toContain(customClass);

    // Check that default classes are still present
    expect(spinner.className).toContain("size-[18px]");
    expect(spinner.className).toContain("animate-spin");
    expect(spinner.className).toContain("border-2");
  });

  it("handles undefined className gracefully", () => {
    const { container } = render(<LoadingSpinner className={undefined} />);

    const spinner = container.firstChild as HTMLElement;

    // Should not contain "undefined" string
    expect(spinner.className).not.toContain("undefined");
    // Should still have default classes
    expect(spinner).toHaveClass("size-[18px]", "animate-spin");
  });
});
