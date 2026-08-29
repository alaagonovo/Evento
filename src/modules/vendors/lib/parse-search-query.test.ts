import { describe, expect, it } from "vitest";
import { parseCategoryQuery } from "./parse-search-query";

describe("parseCategoryQuery", () => {
  it("reads repeated category params", () => {
    expect(parseCategoryQuery(["venues", "florist"])).toEqual(["venues", "florist"]);
  });

  it("reads a comma-separated list", () => {
    expect(parseCategoryQuery("venues,florist")).toEqual(["venues", "florist"]);
  });

  it("drops unknown slugs and duplicates", () => {
    expect(parseCategoryQuery(["venues", "venues", "dresses", "florist"])).toEqual([
      "venues",
      "florist",
    ]);
  });

  it("returns an empty list when nothing valid is passed", () => {
    expect(parseCategoryQuery(undefined)).toEqual([]);
    expect(parseCategoryQuery("")).toEqual([]);
  });
});
