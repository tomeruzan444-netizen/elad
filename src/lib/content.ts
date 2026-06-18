import type { Block, Doc } from '../data/site';
import { site } from '../data/site';

export interface Faq { q: string; a: string; }

const FAQ_HEAD = /שאלות\s*(ו?תשובות|נפוצות)/;

/**
 * Detect a FAQ section: a heading matching "שאלות ותשובות/נפוצות" followed by
 * alternating heading(question)/para(answer) or para pairs. Returns the FAQs and
 * the set of block indexes consumed (so the prose renderer can exclude them).
 */
export function extractFaq(blocks: Block[]): { faqs: Faq[]; consumed: Set<number> } {
  const faqs: Faq[] = [];
  const consumed = new Set<number>();
  let start = -1;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === 'heading' && FAQ_HEAD.test(blocks[i].text || '')) { start = i; break; }
  }
  if (start === -1) return { faqs, consumed };
  consumed.add(start);
  let q: string | null = null;
  for (let i = start + 1; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === 'heading' && (b.level || 2) <= 2 && !FAQ_HEAD.test(b.text || '')) break; // next major section
    if (b.type === 'heading' || (b.type === 'para' && !q && (b.text || '').length < 120 && (b.text || '').includes('?'))) {
      q = b.text || null; consumed.add(i);
    } else if (b.type === 'para' && q) {
      faqs.push({ q, a: b.text || '' }); consumed.add(i); q = null;
    }
  }
  return { faqs: faqs.filter((f) => f.q && f.a), consumed };
}

function stripTitle(t: string): string {
  return (t || '').split('|')[0].trim();
}

/** Build JSON-LD graph for a document. */
export function buildJsonLd(doc: Doc): object[] {
  const url = new URL(`/${doc.slug === 'index' ? '' : doc.slug + '/'}`, site.domain).href;
  const out: object[] = [];

  const org = {
    '@type': 'Person',
    '@id': `${site.domain}/#person`,
    name: 'אלעד שורתי',
    url: site.domain,
    jobTitle: 'יועץ עסקי ומומחה שיווק דיגיטלי',
    image: new URL(site.logoDark, site.domain).href,
    telephone: site.phone,
    sameAs: [site.social.facebook, site.social.instagram],
  };
  out.push(org);

  // Breadcrumbs
  const crumbs: any[] = [{ '@type': 'ListItem', position: 1, name: 'דף הבית', item: site.domain + '/' }];
  if (doc.group !== 'home') {
    crumbs.push({ '@type': 'ListItem', position: 2, name: stripTitle(doc.title), item: url });
  }
  out.push({ '@type': 'BreadcrumbList', itemListElement: crumbs });

  if (doc.type === 'post') {
    out.push({
      '@type': 'Article',
      headline: stripTitle(doc.title),
      description: doc.meta_description || '',
      author: { '@id': `${site.domain}/#person` },
      publisher: { '@id': `${site.domain}/#person` },
      mainEntityOfPage: url,
      image: doc.og_image_local ? new URL(doc.og_image_local, site.domain).href : undefined,
      inLanguage: 'he-IL',
    });
  } else {
    out.push({
      '@type': 'WebPage',
      name: stripTitle(doc.title),
      description: doc.meta_description || '',
      url,
      inLanguage: 'he-IL',
      isPartOf: { '@type': 'WebSite', name: site.name, url: site.domain },
    });
  }

  const faqs = doc.faqs && doc.faqs.length ? doc.faqs : extractFaq(doc.blocks).faqs;
  if (faqs.length) {
    out.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }
  return out.map((o) => ({ '@context': 'https://schema.org', ...o }));
}
