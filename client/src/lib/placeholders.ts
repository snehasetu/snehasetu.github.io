// Placeholder image URLs when generated_images are not available (e.g. for build).
// Replace with real assets from @assets/generated_images/ when available.
const base = "https://picsum.photos/seed";
export const placeholderImages = {
  hero: `${base}/elderly-care/1200/600`,
  blankets: `${base}/blankets/800/450`,
  medical: `${base}/medical/800/450`,
  volunteer: `${base}/volunteer/800/450`,
  fundraising: `${base}/fundraising/800/450`,
  avatar1: `${base}/avatar-female/200/200`,
  avatar2: `${base}/avatar-male/200/200`,
  oahExterior: `${base}/oah-exterior/800/450`,
  oahModern: `${base}/oah-modern/800/450`,
  oahTraditional: `${base}/oah-traditional/800/450`,
} as const;
