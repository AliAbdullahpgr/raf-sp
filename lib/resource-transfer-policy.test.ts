import { describe, expect, it } from "vitest";
import { getResourceTransferability, isNeverTransferableResourceType } from "./resource-transfer-policy";

describe("resource transfer policy", () => {
  it("blocks permanently excluded resource types", () => {
    expect(isNeverTransferableResourceType("MNSUAMEstateFacilities")).toBe(true);
    expect(
      getResourceTransferability("RAEDCEquipment", {
        name: "Training Hall",
        type: "Training Facility",
      }).allowed
    ).toBe(false);
  });

  it("allows temporary machinery from mixed tables", () => {
    expect(
      getResourceTransferability("AMRIInventory", {
        name: "Tractor",
        type: "Machinery",
      }).allowed
    ).toBe(true);

    expect(
      getResourceTransferability("AgriEngineeringMultanRegionData", {
        name: "Bulldozer",
        type: "Farm Machinery",
      }).allowed
    ).toBe(true);
  });

  it("blocks permanent or HR rows from mixed tables", () => {
    expect(
      getResourceTransferability("AMRIInventory", {
        name: "Main Lab",
        type: "Laboratory",
      }).allowed
    ).toBe(false);

    expect(
      getResourceTransferability("MRIAssets", {
        name: "Main Building",
        type: "Resource",
        category: "Building",
      }).allowed
    ).toBe(false);
  });

  it("allows equipment-oriented tables while blocking clearly excluded rows", () => {
    expect(
      getResourceTransferability("FoodAnalysisLabEquipment", {
        name: "Pasteurizer",
        type: "Processing Equipment",
      }).allowed
    ).toBe(true);

    expect(
      getResourceTransferability("ERSSStockRegister", {
        name: "Office Desk",
        type: "Furniture",
      }).allowed
    ).toBe(false);
  });

  it("keeps entomology fallback-style inventory items out of transfers", () => {
    expect(
      getResourceTransferability("ERSSStockRegister", {
        name: "Light microscope",
        type: "Inventory Item",
      }).allowed
    ).toBe(false);

    expect(
      getResourceTransferability("ERSSStockRegister", {
        name: "Field Vehicle",
        type: "Vehicles",
      }).allowed
    ).toBe(true);
  });
});
