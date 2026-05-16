const BASE = "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets";

// Maps emoji character → Fluent 3D PNG URL
export const FLUENT_3D: Record<string, string> = {
  // Products
  "🏗️": `${BASE}/Building%20Construction/3D/building_construction_3d.png`,
  "🦁":  `${BASE}/Lion/3D/lion_3d.png`,
  "⚙️": `${BASE}/Gear/3D/gear_3d.png`,
  "🔩":  `${BASE}/Nut%20and%20Bolt/3D/nut_and_bolt_3d.png`,
  "🏠":  `${BASE}/House/3D/house_3d.png`,
  "🏚️": `${BASE}/Derelict%20House/3D/derelict_house_3d.png`,
  "🧱":  `${BASE}/Brick/3D/brick_3d.png`,
  "⛱️": `${BASE}/Umbrella%20on%20Ground/3D/umbrella_on_ground_3d.png`,
  "⛏️": `${BASE}/Pick/3D/pick_3d.png`,
  "🎨":  `${BASE}/Artist%20Palette/3D/artist_palette_3d.png`,
  "🔧":  `${BASE}/Wrench/3D/wrench_3d.png`,
  "🪣":  `${BASE}/Bucket/3D/bucket_3d.png`,
  "🪟":  `${BASE}/Window/3D/window_3d.png`,
  "🗂️": `${BASE}/Card%20Index%20Dividers/3D/card_index_dividers_3d.png`,
  "🕸️": `${BASE}/Spider%20Web/3D/spider_web_3d.png`,
  // Vendors
  "🏔️": `${BASE}/Snow-Capped%20Mountain/3D/snow-capped_mountain_3d.png`,
  "☀️": `${BASE}/Sun/3D/sun_3d.png`,
  // Categories
  "🏪":  `${BASE}/Convenience%20Store/3D/convenience_store_3d.png`,
};

export function fluent3D(emoji: string): string | null {
  return FLUENT_3D[emoji] ?? null;
}
