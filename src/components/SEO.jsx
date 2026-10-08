import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://motherteresaacademybaraut.in';
const DEFAULT_TITLE = 'Mother Teresa Academy | Best CBSE School in Baraut, Baghpat (Senior Secondary)';
const DEFAULT_DESCRIPTION =
  'Mother Teresa Academy (MTA) is rated among the best CBSE schools in Baraut, Baghpat (UP). Co-educational Senior Secondary schooling across Science, Commerce & Humanities streams. Admissions open 2025-26.';
const DEFAULT_IMAGE = `${SITE_URL}/campus-facade.jpg`;

/**
 * Helper to update or create an HTML head meta/link tag
 */
function setMetaTag(selector, attribute, value, content) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    if (attribute && value) {
      element.setAttribute(attribute, value);
    }
    document.head.appendChild(element);
  }
  if (content !== undefined) {
    element.setAttribute(selector.startsWith('link') ? 'href' : 'content', content);
  }
  return element;
}

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  schema = null,
  breadcrumbs = null,
  noindex = false,
}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Page Title
    document.title = title;

    // 2. Canonical URL
    const canonicalPath = canonical || location.pathname;
    const absoluteCanonical = canonicalPath.startsWith('http')
      ? canonicalPath
      : `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;
    setMetaTag('link[rel="canonical"]', 'rel', 'canonical', absoluteCanonical);

    // 3. Robots Meta Directive (CRITICAL: Strictly protects admin pages from being indexed)
    if (noindex) {
      setMetaTag('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow, noarchive, nosnippet');
      setMetaTag('meta[name="googlebot"]', 'name', 'googlebot', 'noindex, nofollow, noarchive, nosnippet');
      setMetaTag('meta[name="bingbot"]', 'name', 'bingbot', 'noindex, nofollow');
    } else {
      setMetaTag(
        'meta[name="robots"]',
        'name',
        'robots',
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      );
      setMetaTag(
        'meta[name="googlebot"]',
        'name',
        'googlebot',
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      );
      setMetaTag('meta[name="bingbot"]', 'name', 'bingbot', 'index, follow');
    }

    // 4. Meta Description & Keywords
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    if (keywords) {
      setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);
    }

    // 5. Open Graph Meta Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', absoluteCanonical);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`);

    // 6. Twitter Card Meta Tags
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`);

    // 7. Dynamic JSON-LD Schema Injection
    const schemaScriptId = 'mta-dynamic-page-schema';
    let existingScript = document.getElementById(schemaScriptId);
    if (existingScript) {
      existingScript.remove();
    }

    if (!noindex) {
      const schemasToInject = [];

      // BreadcrumbList Schema
      if (breadcrumbs && Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
        schemasToInject.push({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((crumb, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: crumb.name,
            item: crumb.item.startsWith('http') ? crumb.item : `${SITE_URL}${crumb.item}`,
          })),
        });
      }

      // Custom Page Schema (e.g. FAQPage, WebPage)
      if (schema) {
        if (Array.isArray(schema)) {
          schemasToInject.push(...schema);
        } else {
          schemasToInject.push(schema);
        }
      }

      if (schemasToInject.length > 0) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = schemaScriptId;
        script.textContent = JSON.stringify(
          schemasToInject.length === 1 ? schemasToInject[0] : { '@context': 'https://schema.org', '@graph': schemasToInject }
        );
        document.head.appendChild(script);
      }
    }

    return () => {
      const scriptToRemove = document.getElementById(schemaScriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, keywords, canonical, ogType, ogImage, schema, breadcrumbs, noindex, location.pathname]);

  return null;
}
