import { describe, expect, it } from "vitest";
import { getAuthGateRedirect } from "./route-guard";

describe("getAuthGateRedirect", () => {
  it("sends guests from the dashboard to sign in", () => {
    expect(
      getAuthGateRedirect({
        pathname: "/dashboard",
        isAuthenticated: false,
        role: null,
        vendorStatus: null,
      }),
    ).toEqual({ pathname: "/login", search: "?next=%2Fdashboard" });
  });

  it("leaves public pages open for guests", () => {
    expect(
      getAuthGateRedirect({
        pathname: "/",
        isAuthenticated: false,
        role: null,
        vendorStatus: null,
      }),
    ).toBeNull();
  });

  it("sends signed-in users away from the login page", () => {
    expect(
      getAuthGateRedirect({
        pathname: "/login",
        isAuthenticated: true,
        role: "customer",
        vendorStatus: null,
      }),
    ).toEqual({ pathname: "/dashboard" });
  });

  it("lets customers open vendor onboarding", () => {
    expect(
      getAuthGateRedirect({
        pathname: "/vendor/onboarding",
        isAuthenticated: true,
        role: "customer",
        vendorStatus: null,
      }),
    ).toBeNull();
  });

  it("keeps customers out of the vendor dashboard until they apply", () => {
    expect(
      getAuthGateRedirect({
        pathname: "/dashboard/vendor",
        isAuthenticated: true,
        role: "customer",
        vendorStatus: null,
      }),
    ).toEqual({ pathname: "/dashboard" });
  });

  it("keeps customers out of admin", () => {
    expect(
      getAuthGateRedirect({
        pathname: "/admin",
        isAuthenticated: true,
        role: "customer",
        vendorStatus: null,
      }),
    ).toEqual({ pathname: "/dashboard" });
  });

  it("sends vendors without a listing to onboarding", () => {
    expect(
      getAuthGateRedirect({
        pathname: "/dashboard",
        isAuthenticated: true,
        role: "vendor",
        vendorStatus: null,
      }),
    ).toEqual({ pathname: "/vendor/onboarding" });
  });

  it("sends admins away from vendor onboarding", () => {
    expect(
      getAuthGateRedirect({
        pathname: "/vendor/onboarding",
        isAuthenticated: true,
        role: "admin",
        vendorStatus: null,
      }),
    ).toEqual({ pathname: "/admin" });
  });
});
