import { describe, expect, it } from "vitest";
import { getPostAuthPath } from "./redirect";

describe("getPostAuthPath", () => {
  it("sends confirmed customers home", () => {
    expect(
      getPostAuthPath({ role: "customer", vendorStatus: null, source: "confirm" }),
    ).toBe("/");
  });

  it("sends returning customers to the dashboard", () => {
    expect(
      getPostAuthPath({ role: "customer", vendorStatus: null, source: "login" }),
    ).toBe("/dashboard");
  });

  it("sends vendors without a listing to onboarding", () => {
    expect(
      getPostAuthPath({ role: "vendor", vendorStatus: null, source: "login" }),
    ).toBe("/vendor/onboarding");
  });

  it("sends pending vendors to the vendor dashboard", () => {
    expect(
      getPostAuthPath({ role: "vendor", vendorStatus: "pending", source: "login" }),
    ).toBe("/dashboard/vendor");
  });

  it("sends admins to admin", () => {
    expect(
      getPostAuthPath({ role: "admin", vendorStatus: null, source: "login" }),
    ).toBe("/admin");
  });
});
