const NEVER_TRANSFERABLE_RESOURCE_TYPES = new Set([
  "MNSUAMEstateFacilities",
  "RAEDCEquipment",
  "AgriculturalExtensionWing",
  "AdaptiveResearchPosition",
]);

const EXACT_TRANSFERABLE_TYPES = new Set([
  "machinery",
  "farm machinery",
  "lab equipment",
  "laboratory equipment",
  "equipment",
  "analytical equipment",
  "analytical instrument",
  "analytical instruments",
  "testing equipment",
  "processing equipment",
  "balances & scales",
  "meters & sensors",
  "microscopy",
  "sterilization",
  "sterilization equipment",
  "incubation",
  "water systems",
  "separation",
  "measurement tools",
  "support equipment",
  "heating equipment",
  "safety equipment",
  "storage equipment",
  "field equipment",
  "research equipment",
  "it equipment",
  "vehicles",
  "collection tools",
  "insect traps",
  "rearing cages",
  "sprayers",
  "glassware",
]);

const EXACT_TRANSFERABLE_CATEGORIES = new Set([
  "farm machinery",
  "lab equipment",
  "vehicles",
  "instrument",
]);

const TEMPORARY_KEYWORDS = [
  "equipment",
  "machinery",
  "instrument",
  "meter",
  "sensor",
  "microscope",
  "balance",
  "steril",
  "incubat",
  "process",
  "test",
  "storage",
  "heating",
  "vehicle",
  "tractor",
  "truck",
  "trolley",
  "rig",
  "generator",
  "sprayer",
  "pipette",
  "glassware",
  "stirrer",
  "spectrophotometer",
];

const EXCLUDED_KEYWORDS = [
  "land",
  "building",
  "infrastructure",
  "training facility",
  "library",
  "auditorium",
  "farm facility",
  "estate facility",
  "administrative office",
  "building details",
  "human resource",
  "human resources",
  "hr - officers",
  "hr - officials",
  "staff",
  "budget",
  "allowance",
  "contingent",
  "grand total",
  "civil work",
  "repair & maintenance",
  "meeting hall",
  "meeting room",
  "lecture hall",
  "office",
  "furniture",
  "chemical",
  "pesticide",
  "inventory item",
];

export interface TransferableResourceAttributes {
  name?: string | null;
  type?: string | null;
  category?: string | null;
  sectionCategory?: string | null;
}

export interface TransferabilityDecision {
  allowed: boolean;
  reason?: string;
}

export function isNeverTransferableResourceType(resourceType: string): boolean {
  return NEVER_TRANSFERABLE_RESOURCE_TYPES.has(resourceType);
}

export function getResourceTransferability(
  resourceType: string,
  resource: TransferableResourceAttributes
): TransferabilityDecision {
  if (isNeverTransferableResourceType(resourceType)) {
    return {
      allowed: false,
      reason: "This resource type is permanent and cannot be transferred.",
    };
  }

  switch (resourceType) {
    case "AMRIInventory":
      return exactType(resource.type, ["machinery"]);
    case "RARIBahawalpurAssets":
      return exactType(resource.type, ["farm machinery", "lab equipment"]);
    case "MRIAssets":
      return exactType(resource.type, ["equipment"]).allowed &&
        exactCategory(resource.category, ["farm machinery", "lab equipment", "vehicles"]).allowed
        ? allowedUnlessExcluded(resource)
        : blockedTemporaryOnly();
    case "CRIMultanAssets":
      return exactType(resource.type, ["farm machinery", "laboratory equipment"]);
    case "FloricultureStationAssets":
      return exactType(resource.type, ["equipment"]).allowed ||
        exactCategory(resource.category, ["farm machinery", "lab equipment"]).allowed
        ? allowedUnlessExcluded(resource)
        : blockedTemporaryOnly();
    case "SoilWaterTestingProject":
      return exactType(resource.type, ["machinery"]);
    case "PesticideQCLabData":
      return exactType(resource.type, ["lab equipment"]).allowed ||
        exactCategory(resource.sectionCategory, ["instrument"]).allowed
        ? allowedUnlessExcluded(resource)
        : blockedTemporaryOnly();
    case "AgriEngineeringMultanRegionData":
      return exactType(resource.type, ["farm machinery"]);
    case "AgronomyLabEquipment":
      return isClearlyExcluded(resource) ? blockedTemporaryOnly() : { allowed: true };
    case "FoodAnalysisLabEquipment":
    case "ValueAdditionLabEquipment":
    case "ERSSStockRegister":
    case "Equipment":
      return hasTemporarySignals(resource) ? { allowed: true } : blockedTemporaryOnly();
    default:
      return blockedTemporaryOnly();
  }
}

function blockedTemporaryOnly(): TransferabilityDecision {
  return {
    allowed: false,
    reason: "Only temporary movable assets such as hardware, vehicles, machinery, and equipment can be transferred.",
  };
}

function allowedUnlessExcluded(resource: TransferableResourceAttributes): TransferabilityDecision {
  return isClearlyExcluded(resource) ? blockedTemporaryOnly() : { allowed: true };
}

function exactType(value: string | null | undefined, allowed: string[]): TransferabilityDecision {
  return allowed.includes(normalize(value)) ? { allowed: true } : blockedTemporaryOnly();
}

function exactCategory(value: string | null | undefined, allowed: string[]): TransferabilityDecision {
  return allowed.includes(normalize(value)) ? { allowed: true } : blockedTemporaryOnly();
}

function hasTemporarySignals(resource: TransferableResourceAttributes): boolean {
  if (isClearlyExcluded(resource)) {
    return false;
  }

  return [
    resource.type,
    resource.category,
    resource.sectionCategory,
  ].some((value) => isExactTransferableValue(value) || hasTemporaryKeyword(value)) ||
    hasTemporaryKeyword(resource.name);
}

function isClearlyExcluded(resource: TransferableResourceAttributes): boolean {
  return [
    resource.name,
    resource.type,
    resource.category,
    resource.sectionCategory,
  ].some(hasExcludedKeyword);
}

function isExactTransferableValue(value: string | null | undefined): boolean {
  const normalized = normalize(value);
  return EXACT_TRANSFERABLE_TYPES.has(normalized) || EXACT_TRANSFERABLE_CATEGORIES.has(normalized);
}

function hasTemporaryKeyword(value: string | null | undefined): boolean {
  const normalized = normalize(value);
  return !!normalized && TEMPORARY_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function hasExcludedKeyword(value: string | null | undefined): boolean {
  const normalized = normalize(value);
  return !!normalized && EXCLUDED_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function normalize(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}
