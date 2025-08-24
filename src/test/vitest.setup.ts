import "@testing-library/jest-dom";

import { vi } from "vitest";

// Mock scrollTo for HTMLElement
HTMLElement.prototype.scrollTo = vi.fn();
