const gallery = document.querySelector("#gallery");
const empty = document.querySelector("#empty");
const searchInput = document.querySelector("#search");
const tagFilter = document.querySelector("#tagFilter");
const template = document.querySelector("#wallpaperCardTemplate");

let wallpapers = [];
let activeTag = "all";

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function getTags(items) {
  const tags = new Set();

  for (const item of items) {
    for (const tag of item.tags || []) {
      tags.add(tag);
    }
  }

  return ["all", ...Array.from(tags).sort((a, b) => a.localeCompare(b))];
}

function renderTags() {
  tagFilter.replaceChildren();

  for (const tag of getTags(wallpapers)) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = tag === "all" ? "全部" : tag;
    button.setAttribute("aria-pressed", String(activeTag === tag));
    button.addEventListener("click", () => {
      activeTag = tag;
      renderTags();
      renderGallery();
    });
    tagFilter.append(button);
  }
}

function matchesSearch(item, query) {
  if (!query) {
    return true;
  }

  const content = [item.title, item.description, item.ratio, ...(item.tags || [])]
    .map(normalize)
    .join(" ");

  return content.includes(query);
}

function getFilteredWallpapers() {
  const query = normalize(searchInput.value);

  return wallpapers.filter((item) => {
    const tagMatch = activeTag === "all" || (item.tags || []).includes(activeTag);
    return tagMatch && matchesSearch(item, query);
  });
}

function renderGallery() {
  const items = getFilteredWallpapers();
  gallery.replaceChildren();
  empty.hidden = items.length > 0;

  for (const item of items) {
    const card = template.content.firstElementChild.cloneNode(true);
    const previewLink = card.querySelector(".preview-link");
    const image = card.querySelector("img");
    const title = card.querySelector("h2");
    const meta = card.querySelector("p");
    const download = card.querySelector(".download-link");

    previewLink.href = item.src;
    image.src = item.thumbnail || item.src;
    image.alt = item.alt || item.title;
    title.textContent = item.title;
    meta.textContent = [item.ratio, ...(item.tags || []).slice(0, 2)].filter(Boolean).join(" · ");
    download.href = item.src;
    download.download = item.filename || "wallpaper";

    gallery.append(card);
  }
}

async function loadWallpapers() {
  try {
    const response = await fetch("data/wallpapers.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to load wallpaper index: ${response.status}`);
    }

    wallpapers = await response.json();
  } catch (error) {
    console.error(error);
    wallpapers = [];
  }

  renderTags();
  renderGallery();
}

searchInput.addEventListener("input", renderGallery);

loadWallpapers();
