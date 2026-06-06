const data = window.SAX_CONTENT;
const app = document.querySelector("#app");
const cartCount = document.querySelector("#cartCount");
const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector("#navToggle");
const mobileNav = document.querySelector("#mobileNav");
const searchPanel = document.querySelector("#searchPanel");
const searchToggle = document.querySelector("#searchToggle");
const searchClose = document.querySelector("#searchClose");
const searchInput = document.querySelector("#searchInput");
const searchResults = document.querySelector("#searchResults");

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const state = {
  cart: JSON.parse(localStorage.getItem("saxCart") || "[]")
};

function saveCart() {
  localStorage.setItem("saxCart", JSON.stringify(state.cart));
  renderCartCount();
}

function renderCartCount() {
  const count = state.cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = count;
}

function routePath() {
  const raw = location.hash.replace(/^#/, "") || "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function link(path) {
  return `#${path}`;
}

function slugify(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function collectionBySlug(slug) {
  return data.collections.find((collection) => collection.slug === slug);
}

function productBySlug(slug) {
  return data.products.find((product) => product.slug === slug);
}

function productsForCollection(slug) {
  return data.products.filter((product) => product.collection === slug);
}

function shopifyProductUrl(product) {
  if (product.shopifyUrl) return product.shopifyUrl;
  const query = encodeURIComponent(product.name);
  return `${data.brand.shopifySearchUrl}?q=${query}`;
}

function shopifyCollectionUrl(collection) {
  if (collection?.shopifyUrl) return collection.shopifyUrl;
  const query = encodeURIComponent(collection?.name || "S.A.X collection");
  return `${data.brand.shopifySearchUrl}?q=${query}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function titleWithItalic(title, italic) {
  if (!italic || !title.includes(italic)) return escapeHtml(title);
  return escapeHtml(title).replace(escapeHtml(italic), `<em>${escapeHtml(italic)}</em>`);
}

function art(initial, label, className = "art", image = "", alt = "") {
  const fallback = `<span class="art-label">${escapeHtml(label)}</span>`;
  const imageTag = image
    ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(alt || label)}" loading="lazy">`
    : "";
  return `<div class="${className}${image ? " has-image" : ""}" data-initial="${escapeHtml(initial)}">${imageTag}${fallback}</div>`;
}

function pageHero(eyebrow, title, copy) {
  return `
    <section class="page-hero">
      <div class="page-hero-inner">
        <p class="eyebrow">${escapeHtml(eyebrow)}</p>
        <h1 class="page-title">${escapeHtml(title)}</h1>
        <p class="lead">${escapeHtml(copy)}</p>
      </div>
    </section>
  `;
}

function setMeta(title, description) {
  document.title = `${title} | S.A.X`;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "description");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", description);
}

function sectionHead(eyebrow, title, copy = "", action = "") {
  return `
    <div class="section-head">
      <div>
        <p class="eyebrow">${escapeHtml(eyebrow)}</p>
        <h2 class="section-title">${title}</h2>
      </div>
      ${copy ? `<p class="lead">${escapeHtml(copy)}</p>` : action}
    </div>
  `;
}

function renderMarquee() {
  const items = [...data.marquee, ...data.marquee]
    .map((item) => `<span class="mq-item">${escapeHtml(item)}</span>`)
    .join("");
  return `<div class="marquee-bar"><div class="marquee-inner">${items}</div></div>`;
}

function renderPillars() {
  return `
    <section class="section soft">
      <div class="section-inner">
        ${sectionHead("The S.A.X pillars", "Serenity. Affirmation. <em>Xenial.</em>")}
        <div class="pillars-grid">
          ${data.pillars
            .map(
              (pillar) => `
                <article class="pillar-card">
                  <div class="pillar-letter">${escapeHtml(pillar.letter)}</div>
                  <h3>${escapeHtml(pillar.title)}</h3>
                  <p class="small-caps">${escapeHtml(pillar.subtitle)}</p>
                  <p class="body-copy">${escapeHtml(pillar.text)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function renderTrustStrip() {
  return `
    <section class="trust-strip" aria-label="Store confidence">
      ${data.trust.map((item) => `<div><span></span>${escapeHtml(item)}</div>`).join("")}
    </section>
  `;
}

function collectionCard(collection) {
  return `
    <a class="collection-card" href="${link(`/collections/${collection.slug}`)}">
      ${art(collection.initial, "Collection", "art", collection.image, collection.name)}
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(collection.name)}</h3>
        <p>${escapeHtml(collection.short)}</p>
        <span class="pill-link">Shop now</span>
      </div>
    </a>
  `;
}

function productCard(product) {
  return `
    <a class="product-card" href="${link(`/products/${product.slug}`)}">
      ${art(product.initial, product.badge, "art", product.image, product.name)}
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description)}</p>
        <div class="price">${money.format(product.price)}</div>
        <span class="pill-link">View details</span>
      </div>
    </a>
  `;
}

function renderHome() {
  setMeta("Christian-Centered Wellness & Lifestyle", data.hero.tagline);
  const featured = data.products.filter((product) => product.badge === "Best seller").slice(0, 4);
  app.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <div class="hero-copy-inner">
          <p class="eyebrow">${escapeHtml(data.hero.eyebrow)}</p>
          <h1>${titleWithItalic(data.hero.title, data.hero.italic)}</h1>
          <p class="lead">${escapeHtml(data.hero.tagline)}</p>
          <p class="scripture">${escapeHtml(data.hero.scripture)}</p>
          <p class="lead" style="margin-top:18px">${escapeHtml(data.hero.copy)}</p>
          <div class="hero-actions">
            <a class="button primary" href="${link("/renewal-experience")}">Begin the renewal</a>
            <a class="button secondary" href="${link("/shop")}">Shop essentials</a>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        ${art("S", data.hero.artLabel, "hero-photo", data.hero.image, data.hero.artLabel)}
      </div>
    </section>
    ${renderMarquee()}
    ${renderPillars()}
    <section class="section soft">
      <div class="section-inner">
        ${sectionHead("Featured collections", "Shop the <em>S.A.X way</em>", "", `<a class="button secondary" href="${link("/shop")}">View all</a>`)}
        <div class="collections-grid">${data.collections.slice(0, 6).map(collectionCard).join("")}</div>
      </div>
    </section>
    ${renderRenewalSplit()}
    <section class="section">
      <div class="section-inner">
        ${sectionHead("Best sellers", "Faith-led <em>favorites</em>")}
        <div class="products-grid">${featured.map(productCard).join("")}</div>
      </div>
    </section>
    ${renderTestimonial()}
    ${renderCommunityBand()}
  `;
}

function renderRenewalSplit() {
  return `
    <section class="split dark-left">
      <div class="split-pane">
        <div class="split-pane-inner">
          <p class="eyebrow">Intentional care</p>
          <h2 class="section-title">The S.A.X <em>Renewal Experience</em></h2>
          <p class="lead" style="color:#cbbdac;margin-top:16px">${escapeHtml(data.pages.renewal.copy)}</p>
          <div class="actions"><a class="button gold" href="${link("/renewal-experience")}">Explore renewal</a></div>
        </div>
      </div>
      <div class="split-pane">
        <div class="split-pane-inner">
          <div class="experience-grid" style="grid-template-columns:1fr">
            ${data.experiences
              .map(
                (item) => `
                  <article class="content-card">
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.text)}</p>
                    <a class="subtle-link" href="${link("/renewal-experience")}">Learn more</a>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderTestimonial() {
  return `
    <section class="section sand">
      <div class="testimonial">
        <div class="stars">★★★★★</div>
        <blockquote class="quote">${escapeHtml(data.testimonial.quote)}</blockquote>
        <p class="eyebrow">${escapeHtml(data.testimonial.name)}</p>
      </div>
    </section>
  `;
}

function renderCommunityBand() {
  return `
    <section class="section dark">
      <div class="section-inner">
        ${sectionHead("Fellowship Circle", "A community for faith, wellness, and <em>belonging.</em>", "Join the circle for reflections, encouragement, care rituals, and updates on the future S.A.X sanctuary.")}
        <div class="actions">
          <a class="button gold" href="${link("/community")}">Join the circle</a>
          <a class="button secondary" href="${link("/contact")}" style="color:var(--cream);border-color:var(--muted-gold)">Contact S.A.X</a>
        </div>
      </div>
    </section>
  `;
}

function renderShop() {
  setMeta("Shop Faith-Led Wellness Products", "Browse S.A.X apparel, wellness kits, facial care, and faith-led products for renewal.");
  app.innerHTML = `
    ${pageHero("Shop S.A.X", "Faith-led products for renewal.", "Browse apparel, wellness kits, facial care, and products designed around Serenity, Affirmation, and Xenial living.")}
    ${renderTrustStrip()}
    <section class="section">
      <div class="section-inner">
        ${sectionHead("Collections", "Shop by <em>collection</em>")}
        <div class="collections-grid">${data.collections.map(collectionCard).join("")}</div>
      </div>
    </section>
    <section class="section soft">
      <div class="section-inner">
        <div class="products-toolbar">
          <div>
            <p class="eyebrow">All products</p>
            <h2 class="section-title">Product display</h2>
          </div>
          <div class="filter-row" id="productFilters">
            <button class="filter-chip is-active" data-filter="all">All</button>
            ${data.collections.map((collection) => `<button class="filter-chip" data-filter="${collection.slug}">${escapeHtml(collection.name.replace(" Collection", ""))}</button>`).join("")}
          </div>
        </div>
        <div class="products-grid" id="productGrid">${data.products.map(productCard).join("")}</div>
      </div>
    </section>
  `;
  bindProductFilters();
}

function bindProductFilters() {
  const filters = document.querySelector("#productFilters");
  const grid = document.querySelector("#productGrid");
  if (!filters || !grid) return;
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    filters.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("is-active"));
    button.classList.add("is-active");
    const filter = button.dataset.filter;
    const products = filter === "all" ? data.products : productsForCollection(filter);
    const collection = collectionBySlug(filter);
    grid.innerHTML = products.length
      ? products.map(productCard).join("")
      : `<div class="empty-state">
          <p>This collection is connected to the live S.A.X Shopify store for current inventory and availability.</p>
          <a class="button primary" href="${shopifyCollectionUrl(collection)}" target="_blank" rel="noopener">Shop this collection on Shopify</a>
        </div>`;
  });
}

function renderCollection(slug) {
  const collection = collectionBySlug(slug);
  if (!collection) return renderNotFound();
  setMeta(collection.name, collection.description);
  const products = productsForCollection(slug);
  app.innerHTML = `
    ${pageHero("Collection", collection.name, collection.description)}
    ${renderTrustStrip()}
    <section class="section soft">
      <div class="section-inner">
        ${sectionHead(
          "Products",
          `${escapeHtml(collection.name)} <em>favorites</em>`,
          "",
          `<a class="button secondary" href="${shopifyCollectionUrl(collection)}" target="_blank" rel="noopener">Shop on Shopify</a>`
        )}
        <div class="products-grid">
          ${
            products.length
              ? products.map(productCard).join("")
              : `<div class="empty-state">
                  <p>This collection is connected to the live S.A.X Shopify store for current inventory and availability.</p>
                  <a class="button primary" href="${shopifyCollectionUrl(collection)}" target="_blank" rel="noopener">Shop this collection on Shopify</a>
                </div>`
          }
        </div>
      </div>
    </section>
  `;
}

function renderProduct(slug) {
  const product = productBySlug(slug);
  if (!product) return renderNotFound();
  setMeta(product.name, product.description);
  const collection = collectionBySlug(product.collection);
  app.innerHTML = `
    <section class="section soft">
      <div class="section-inner product-detail">
        ${art(product.initial, product.badge, "art", product.image, product.name)}
        <div>
          <p class="eyebrow">${escapeHtml(collection ? collection.name : "S.A.X product")}</p>
          <h1 class="product-title">${escapeHtml(product.name)}</h1>
          <div class="price" style="font-size:18px">${money.format(product.price)}</div>
          <p class="lead" style="margin-top:18px">${escapeHtml(product.description)}</p>
          <span class="badge">${escapeHtml(product.badge)}</span>
          <div class="option-row">
            ${renderOption("Color", product.options.color)}
            ${renderOption("Size", product.options.size)}
          </div>
          <div class="actions" style="align-items:center">
            <div class="quantity-row">
              <button type="button" data-qty-minus>-</button>
              <span id="qtyValue">1</span>
              <button type="button" data-qty-plus>+</button>
            </div>
            <a class="button primary" href="${shopifyProductUrl(product)}" target="_blank" rel="noopener">Buy on Shopify</a>
            <button class="button secondary" id="addToCart">Save to cart</button>
          </div>
          <div class="content-card" style="margin-top:28px">
            <h3>Product details</h3>
            <ul class="body-copy">
              ${product.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
            </ul>
          </div>
          <div style="margin-top:18px">${renderTrustStrip()}</div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-inner">
        ${sectionHead("You may also like", `More from <em>${escapeHtml(collection ? collection.name : "S.A.X")}</em>`)}
        <div class="products-grid">${productsForCollection(product.collection).filter((item) => item.slug !== product.slug).slice(0, 4).map(productCard).join("")}</div>
      </div>
    </section>
  `;
  bindProduct(product);
}

function renderOption(label, options) {
  return `
    <label class="field">
      <span>${escapeHtml(label)}</span>
      <select data-option="${escapeHtml(label.toLowerCase())}">
        ${options.map((option) => `<option>${escapeHtml(option)}</option>`).join("")}
      </select>
    </label>
  `;
}

function bindProduct(product) {
  let qty = 1;
  const qtyValue = document.querySelector("#qtyValue");
  document.querySelector("[data-qty-minus]").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyValue.textContent = qty;
  });
  document.querySelector("[data-qty-plus]").addEventListener("click", () => {
    qty += 1;
    qtyValue.textContent = qty;
  });
  document.querySelector("#addToCart").addEventListener("click", () => {
    const color = document.querySelector('[data-option="color"]')?.value || "";
    const size = document.querySelector('[data-option="size"]')?.value || "";
    addToCart(product, qty, color, size);
  });
}

function addToCart(product, quantity, color, size) {
  const key = `${product.slug}:${color}:${size}`;
  const existing = state.cart.find((item) => item.key === key);
  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.push({ key, slug: product.slug, quantity, color, size });
  }
  saveCart();
  location.hash = "#/cart";
}

function renderGenericPage(pageKey) {
  const page = data.pages[pageKey];
  if (!page) return renderNotFound();
  setMeta(page.title, page.copy);
  app.innerHTML = `
    ${pageHero(page.eyebrow, page.title, page.copy)}
    <section class="section soft">
      <div class="section-inner">
        <div class="feature-grid">
          ${page.cards.map((card) => `<article class="content-card"><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(card.text)}</p></article>`).join("")}
        </div>
      </div>
    </section>
    ${pageKey === "community" ? renderCommunityForm() : ""}
    ${pageKey === "renewal" ? renderRenewalDetail() : ""}
  `;
  bindForms();
}

function renderRenewalDetail() {
  return `
    <section class="section sand">
      <div class="section-inner">
        ${sectionHead("Renewal paths", "Choose your <em>experience</em>")}
        <div class="experience-grid">
          ${data.experiences.map((item) => `<article class="content-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p><a class="button secondary" href="${link("/contact")}">Request access</a></article>`).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderCommunityForm() {
  return `
    <section class="section sand">
      <div class="section-inner page-grid">
        <div>
          <p class="eyebrow">Join the Circle</p>
          <h2 class="section-title">Receive reflection notes and renewal updates.</h2>
        </div>
        <form class="form-card sax-form">
          <div class="form-grid">
            <label class="field"><span>Name</span><input required name="name"></label>
            <label class="field"><span>Email</span><input required type="email" name="email"></label>
            <button class="button primary" type="submit">Continue to contact form</button>
          </div>
          <p class="form-note">Your details were copied. Paste them into the Shopify contact form that just opened.</p>
        </form>
      </div>
    </section>
  `;
}

function renderContact() {
  const page = data.pages.contact;
  setMeta("Contact S.A.X", page.copy);
  app.innerHTML = `
    ${pageHero(page.eyebrow, page.title, page.copy)}
    <section class="section soft">
      <div class="section-inner page-grid">
        <div class="content-card">
          <h3>Customer care</h3>
          <p>Use this form for order questions, collaborations, community, spa sanctuary updates, or product questions.</p>
          <p class="small-caps">Response focus</p>
          <p>Orders · Partnerships · Community · Wellness experiences</p>
        </div>
        <form class="form-card sax-form">
          <div class="form-grid">
            <label class="field"><span>Name</span><input required name="name"></label>
            <label class="field"><span>Email</span><input required type="email" name="email"></label>
            <label class="field"><span>Topic</span><select name="topic"><option>Order question</option><option>Partnership</option><option>Community</option><option>Renewal Experience</option></select></label>
            <label class="field"><span>Message</span><textarea required name="message"></textarea></label>
            <button class="button primary" type="submit">Continue to Shopify contact</button>
          </div>
          <p class="form-note">Your message was copied. Paste it into the Shopify contact form that just opened.</p>
        </form>
      </div>
    </section>
  `;
  bindForms();
}

function bindForms() {
  document.querySelectorAll(".sax-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const summary = Array.from(formData.entries())
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
      const message = `S.A.X website inquiry\n\n${summary}`;
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(message).catch(() => {});
      }
      window.open(data.brand.shopifyContactUrl, "_blank", "noopener");
      form.querySelector(".form-note")?.classList.add("is-visible");
      form.reset();
    });
  });
}

function renderBlog() {
  setMeta("S.A.X Journal", "Faith-led reflections on serenity, affirmation, xenial care, and renewal.");
  app.innerHTML = `
    ${pageHero("Journal", "Reflections for the S.A.X way.", "Short faith-led reflections on peace, identity, hospitality, care, and renewal.")}
    <section class="section soft">
      <div class="section-inner">
        <div class="blog-grid">
          ${data.blog.map((post) => `<a class="blog-card" href="${link(`/journal/${post.slug}`)}"><div class="card-body"><p class="small-caps">${escapeHtml(post.category)}</p><h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.excerpt)}</p><span class="pill-link">Read more</span></div></a>`).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderPost(slug) {
  const post = data.blog.find((item) => item.slug === slug);
  if (!post) return renderNotFound();
  setMeta(post.title, post.excerpt);
  app.innerHTML = `
    ${pageHero(post.category, post.title, post.excerpt)}
    <section class="section soft">
      <div class="section-inner" style="max-width:760px">
        <article class="policy-card">
          ${(post.body || [post.excerpt]).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          <div class="actions"><a class="button secondary" href="${link("/journal")}">Back to journal</a></div>
        </article>
      </div>
    </section>
  `;
}

function renderCart() {
  setMeta("Saved Cart", "Review saved S.A.X items and continue purchasing through the live Shopify store.");
  const rows = state.cart
    .map((item) => {
      const product = productBySlug(item.slug);
      if (!product) return "";
      return `
        <div class="cart-row" data-key="${escapeHtml(item.key)}">
          ${art(product.initial, product.badge, "art", product.image, product.name)}
          <div>
            <h3 class="card-title">${escapeHtml(product.name)}</h3>
            <p class="body-copy">${escapeHtml([item.color, item.size].filter(Boolean).join(" · "))}</p>
            <p class="price">${money.format(product.price)} × ${item.quantity}</p>
            <a class="subtle-link" href="${shopifyProductUrl(product)}" target="_blank" rel="noopener">Buy this item on Shopify</a>
            <button type="button" data-remove="${escapeHtml(item.key)}">Remove</button>
          </div>
          <strong>${money.format(product.price * item.quantity)}</strong>
        </div>
      `;
    })
    .join("");
  const subtotal = state.cart.reduce((sum, item) => {
    const product = productBySlug(item.slug);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
  app.innerHTML = `
    ${pageHero("Cart", "Your S.A.X saved cart.", "Review your saved items, then open each product on Shopify to complete purchase with live inventory and checkout.")}
    <section class="section soft">
      <div class="section-inner cart-layout">
        <div class="cart-list">${rows || `<div class="empty-state"><p>Your cart is empty.</p><a class="button primary" href="${link("/shop")}">Shop now</a></div>`}</div>
        <aside class="content-card">
          <h3>Order summary</h3>
          <p class="body-copy">Subtotal</p>
          <div class="price" style="font-size:24px">${money.format(subtotal)}</div>
          <p class="body-copy">This GitHub preview saves items locally. Purchases are completed on the live Shopify store so inventory, variants, taxes, and shipping stay accurate.</p>
          <a class="button primary full" href="${data.brand.shopifyCartUrl}">Open Shopify cart</a>
          <a class="button secondary full" href="${link("/shop")}" style="margin-top:10px">Continue shopping</a>
          <button class="button secondary full" id="clearCart" type="button" style="margin-top:10px">Clear cart</button>
        </aside>
      </div>
    </section>
  `;
  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      state.cart = state.cart.filter((item) => item.key !== button.dataset.remove);
      saveCart();
      renderCart();
    });
  });
  document.querySelector("#clearCart")?.addEventListener("click", () => {
    state.cart = [];
    saveCart();
    renderCart();
  });
}

function renderPolicies() {
  setMeta("Policies", "S.A.X shipping, returns, privacy, and terms links for customer care.");
  app.innerHTML = `
    ${pageHero("Policies", "Clear care for customers.", "Use this section for shipping, returns, privacy, terms, and customer care policies.")}
    <section class="section soft">
      <div class="section-inner page-grid">
        ${data.policies.map((policy) => `<article class="policy-card"><h3>${escapeHtml(policy.title)}</h3><p>${escapeHtml(policy.text)}</p><a class="button secondary" href="${escapeHtml(policy.url)}" target="_blank" rel="noopener">Read ${escapeHtml(policy.title)} policy</a></article>`).join("")}
      </div>
    </section>
  `;
}

function renderNotFound() {
  setMeta("Page Not Found", "Return to the S.A.X homepage.");
  app.innerHTML = `
    ${pageHero("Not found", "This page needs renewal.", "The page you opened does not exist yet.")}
    <section class="section soft"><div class="section-inner"><a class="button primary" href="${link("/")}">Return home</a></div></section>
  `;
}

function renderSearchResults(query = "") {
  const q = query.trim().toLowerCase();
  const entries = [
    ...data.products.map((product) => ({ type: "Product", title: product.name, text: product.description, path: `/products/${product.slug}`, initial: product.initial, image: product.image })),
    ...data.collections.map((collection) => ({ type: "Collection", title: collection.name, text: collection.description, path: `/collections/${collection.slug}`, initial: collection.initial, image: collection.image })),
    { type: "Page", title: "Renewal Experience", text: data.pages.renewal.copy, path: "/renewal-experience", initial: "R" },
    { type: "Page", title: "Community", text: data.pages.community.copy, path: "/community", initial: "C" },
    { type: "Page", title: "About", text: data.pages.about.copy, path: "/about", initial: "A" }
  ];
  const results = q
    ? entries.filter((item) => `${item.title} ${item.text} ${item.type}`.toLowerCase().includes(q))
    : entries.slice(0, 6);
  searchResults.innerHTML = results.length
    ? results
        .map(
          (item) => `
            <a class="search-result" href="${link(item.path)}">
              ${art(item.initial, item.type, "art", item.image, item.title)}
              <div>
                <p class="small-caps">${escapeHtml(item.type)}</p>
                <h3 class="card-title">${escapeHtml(item.title)}</h3>
              </div>
            </a>
          `
        )
        .join("")
    : `<p class="body-copy">No results yet. Try a different S.A.X keyword.</p>`;
}

function openSearch() {
  searchPanel.classList.add("is-open");
  searchPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("search-open");
  renderSearchResults(searchInput.value);
  setTimeout(() => searchInput.focus(), 50);
}

function closeSearch() {
  searchPanel.classList.remove("is-open");
  searchPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("search-open");
}

function renderRoute() {
  const path = routePath();
  siteHeader.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");

  if (path === "/") renderHome();
  else if (path === "/shop") renderShop();
  else if (path.startsWith("/collections/")) renderCollection(path.split("/")[2]);
  else if (path.startsWith("/products/")) renderProduct(path.split("/")[2]);
  else if (path === "/renewal-experience") renderGenericPage("renewal");
  else if (path === "/community") renderGenericPage("community");
  else if (path === "/about") renderGenericPage("about");
  else if (path === "/contact") renderContact();
  else if (path === "/journal") renderBlog();
  else if (path.startsWith("/journal/")) renderPost(path.split("/")[2]);
  else if (path === "/cart") renderCart();
  else if (path === "/policies") renderPolicies();
  else renderNotFound();

  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "auto" });
}

navToggle.addEventListener("click", () => {
  const isOpen = siteHeader.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    siteHeader.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

searchToggle.addEventListener("click", openSearch);
searchClose.addEventListener("click", closeSearch);
searchPanel.addEventListener("click", (event) => {
  if (event.target === searchPanel || event.target.closest(".search-result")) closeSearch();
});
searchInput.addEventListener("input", () => renderSearchResults(searchInput.value));

window.addEventListener("hashchange", renderRoute);
document.querySelector("#year").textContent = new Date().getFullYear();
renderCartCount();
renderRoute();
