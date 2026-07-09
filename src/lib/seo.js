function setMetaTag(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLinkTag(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(id, data) {
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

// Sets document title, meta description/OG tags, canonical link, and an
// optional JSON-LD block. Called imperatively (no react-helmet dependency)
// since only one "page" is ever mounted at a time in this CSR app.
export function setPageMeta({ title, description, image, url, jsonLd }) {
  if (title) document.title = title
  if (description) setMetaTag('name', 'description', description)
  if (title) setMetaTag('property', 'og:title', title)
  if (description) setMetaTag('property', 'og:description', description)
  if (image) setMetaTag('property', 'og:image', image)
  if (url) {
    setMetaTag('property', 'og:url', url)
    setLinkTag('canonical', url)
  }
  setMetaTag('property', 'og:type', 'product')

  if (jsonLd) {
    setJsonLd('page-jsonld', jsonLd)
  }
}

export function buildProductJsonLd(product, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.tagline,
    image: product.image,
    url,
    brand: { '@type': 'Brand', name: 'Kenwell' },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'INR',
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
  }
}
