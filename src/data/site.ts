// Central site configuration: brand, contact, social, navigation, sidebar groups.
import pagesRaw from './pages.json';

export interface Block {
  type: string;
  level?: number;
  text?: string;
  html?: string;
  items?: string[];
  ordered?: boolean;
  src?: string;
  alt?: string;
  placeholder?: boolean;
}
export interface Doc {
  id: number;
  type: 'page' | 'post';
  slug: string;
  url: string;
  title: string;
  meta_description: string | null;
  canonical: string | null;
  robots: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_image_local?: string;
  h1: string[];
  group: 'home' | 'service' | 'industry' | 'blog-index' | 'post' | 'utility';
  blocks: Block[];
  faqs: { q: string; a: string }[];
}

export const pages = pagesRaw as unknown as Doc[];

export const bySlug = (slug: string) => pages.find((p) => p.slug === slug);
export const byGroup = (group: Doc['group']) => pages.filter((p) => p.group === group);

export const site = {
  name: 'אלעד שורתי',
  tagline: 'ייעוץ ופיתוח עסקי · שיווק דיגיטלי',
  domain: 'https://elad-digital.co.il',
  logoDark: '/assets/img/Elad-logo-dark.svg',
  logoLight: '/assets/img/Elad-logo-light.png',
  logoWhite: '/assets/img/Elad-logo-white.svg',
  heroImage: '/assets/img/-----------min-1.webp',
  phone: '052-7075029',
  phoneRaw: '0527075029',
  whatsapp: 'https://wa.me/972527075029',
  whatsappText: 'היי אלעד, הגעתי מהאתר ואשמח לשמוע פרטים',
  email: 'info@elad-digital.co.il',
  social: {
    instagram: 'https://www.instagram.com/elad_shurati',
    facebook: 'https://www.facebook.com/eladshurati/',
  },
};

// ---- Service sub-groups (for nav + sidebar) ----
export const serviceGroups: { title: string; slugs: string[] }[] = [
  {
    title: 'ייעוץ ואסטרטגיה עסקית',
    slugs: [
      'פיתוח-עסקי',
      'אודות-2', // ייעוץ אסטרטגי
      'אימון-עסקי',
      'מנטור-עסקי',
      'בניית-אסטרטגיה-עסקית',
      'בניית-תכנית-עסקית',
      'ייעוץ-לעסקים-קטנים',
      'תיווך-עסקים',
    ],
  },
  {
    title: 'שיווק ומכירות',
    slugs: [
      'בניית-אסטרטגיה-שיווקית',
      'סוגי-אסטרטגיות-שיווקיות',
      'ייעוץ-שיווקי-מי-צריך-את-זה-ומתי',
      'שיווק-ממומן',
      'שיווק-ממומן-בפייסבוק',
      'פרסום-בפייסבוק',
      'פרסום-בלינקדאין-לעסקים',
      'שיווק-באינסטגרם',
      'לידים-לעסק',
      'מיתוג-אפקטיבי-לעסקים-קטנים',
      'קורס-מכירות',
    ],
  },
  {
    title: 'דיגיטל וטכנולוגיה',
    slugs: ['בניית-אתרים', 'סוכני-ai'],
  },
];

// Clean display labels (override messy/duplicate meta titles where needed)
export const labelOverrides: Record<string, string> = {
  'אודות-2': 'ייעוץ אסטרטגי',
  'פיתוח-עסקי': 'פיתוח עסקי',
  'ייעוץ-שיווקי-מי-צריך-את-זה-ומתי': 'ייעוץ שיווקי',
  'ייעוץ-עסקי-לפתיחת-עסק': 'ייעוץ עסקי לפתיחת עסק',
  'סוכני-ai': 'סוכני AI',
  'קורס-מכירות': 'הכשרת אנשי מכירות',
  'info-articles': 'הבלוג העסקי',
};

export function label(slug: string): string {
  if (labelOverrides[slug]) return labelOverrides[slug];
  const p = bySlug(slug);
  if (!p) return slug;
  // strip trailing "| אלעד שורתי" etc. for a clean short label
  return (p.title || slug).split('|')[0].split('-')[0].split('–')[0].trim();
}

// Industries (sorted by Hebrew label)
export const industries = byGroup('industry')
  .map((p) => ({ slug: p.slug, label: label(p.slug) }))
  .sort((a, b) => a.label.localeCompare(b.label, 'he'));

// Top navigation (mega menu)
export const nav = [
  { label: 'עמוד הבית', href: '/' },
  {
    label: 'שירותים',
    href: '/פיתוח-עסקי/',
    columns: serviceGroups.map((g) => ({
      title: g.title,
      links: g.slugs.map((s) => ({ label: label(s), href: `/${s}/` })),
    })),
  },
  {
    label: 'ייעוץ לפי תחום',
    href: '/ייעוץ-עסקי-לרופאים/',
    mega: industries.map((i) => ({ label: i.label, href: `/${i.slug}/` })),
  },
  { label: 'הבלוג', href: '/info-articles/' },
  { label: 'אודות', href: '/אודות/' },
  { label: 'צרו קשר', href: '/צרו-קשר/', cta: true },
];
