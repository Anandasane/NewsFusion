# Design System Documentation: High-End Editorial Strategy

## 1. Overview & Creative North Star: "The Nocturnal Editorial"
This design system moves beyond the utility of a standard news aggregator to become a high-end digital broadsheet. Our Creative North Star is **The Nocturnal Editorial**. We are crafting an experience that feels like a premium, physical publication reimagined for a digital dark mode environment. 

To achieve this, we reject "template-based" layouts. We prioritize **intentional asymmetry**, where content isn't just placed on a grid but curated with purpose. We use extreme typographic scales and "breathing room" (white space) to guide the eye, ensuring the content is the hero. By layering deep tones instead of drawing lines, we create a tactile sense of depth that feels sophisticated, expensive, and authoritative.

---

## 2. Colors & Surface Architecture
Our palette is rooted in the deep obsidian of the night, using tonal shifts rather than structural lines to define space.

### The "No-Line" Rule
**Borders are strictly prohibited for sectioning.** To define a new area or separate content, you must use background color shifts. 
*   **Surface:** `#101319` (The canvas)
*   **Surface-Container-Low:** `#191c22` (Secondary sections)
*   **Surface-Container:** `#1d2026` (Standard cards/content containers)

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
1.  **Level 0 (The Floor):** `surface_dim` (#101319).
2.  **Level 1 (The Section):** `surface_container_low` (#191c22).
3.  **Level 2 (The Component):** `surface_container` (#1d2026) for primary news cards.
4.  **Level 3 (The Interaction):** `surface_container_high` (#272a31) for hover states or active elements.

### The "Glass & Gradient" Rule
To add "soul" to the minimalist aesthetic:
*   **Floating Elements:** Use `surface_bright` at 60% opacity with a `20px` backdrop-blur for navigation bars or overlays.
*   **Signature Textures:** Use a subtle linear gradient for hero backgrounds or primary CTAs, transitioning from `primary` (#c0c1ff) to `primary_container` (#8083ff) at a 135-degree angle.

---

## 3. Typography: Editorial Authority
We utilize a dual-font strategy to balance character with readability.

*   **Display & Headlines (Manrope):** This is our "voice." Manrope’s geometric yet warm structure conveys modern authority. Use `display-lg` (3.5rem) for breaking news and `headline-md` (1.75rem) for standard article headers. These should always be **bold** to create high-contrast entry points for the reader.
*   **Body & Labels (Inter):** The workhorse. Inter is chosen for its exceptional legibility at small sizes. 
    *   `body-lg` (1rem) for long-form article text.
    *   `label-md` (0.75rem) for metadata (timestamps, categories) to keep the UI clean.

---

## 4. Elevation & Depth
In this design system, shadows and borders are the "last resort," not the default.

### The Layering Principle
Depth is achieved through **Tonal Layering**. If a card needs to stand out, do not add a shadow immediately; instead, place a `surface_container` card on a `surface_container_low` background. This creates a "soft lift" that feels integrated into the environment.

### Ambient Shadows
When a floating effect is required (e.g., a dropdown or modal):
*   **Color:** Use a 10% opacity version of `on_surface` (#e1e2eb).
*   **Blur:** Extra-diffused (e.g., `0px 20px 40px`). This mimics soft, ambient light rather than a harsh artificial shadow.

### The "Ghost Border" Fallback
If a border is required for accessibility:
*   **Constraint:** Use the `outline_variant` (#464554) at **15% opacity**. It should be felt, not seen. Never use 100% opaque borders.

---

## 5. Components

### Buttons
*   **Primary:** A gradient fill (`primary` to `primary_container`). Roundedness: `md` (0.375rem). Text: `label-md` (Bold).
*   **Secondary:** No fill. A "Ghost Border" using `outline`. 
*   **Tertiary:** No border, no fill. Use `primary` text color. Use only for low-emphasis actions like "Read More."

### Chips (Categories)
*   **Style:** `surface_container_highest` (#32353c) with `label-sm` text.
*   **Shape:** `full` (9999px) for a soft, pill-shaped editorial feel.

### Input Fields
*   **Style:** `surface_container_lowest` (#0b0e14) background. No border.
*   **Focus State:** A 1px "Ghost Border" of `primary` at 40% opacity. 

### Cards & News Lists
*   **Rule:** **Forbid the use of divider lines.** 
*   **Spacing:** Use the spacing scale (e.g., 2rem vertical margin) to separate articles.
*   **Editorial Layout:** For featured news, overlap the headline slightly over the image container to break the standard grid and create a "magazine" feel.

### Interactive Tooltips
*   **Surface:** `surface_container_highest` (#32353c).
*   **Animation:** 200ms ease-out fade with a subtle 4px vertical slide.

---

## 6. Do's and Don'ts

### Do
*   **Do** embrace negative space. If a layout feels "crowded," increase the padding rather than adding a border.
*   **Do** use `secondary` (#4ae176) sparingly for "Success" or "Live" indicators to provide a pop of high-contrast color.
*   **Do** use `tertiary` (#ffb783) for opinion pieces or featured editorial content to distinguish them from standard news.

### Don't
*   **Don't** use pure black (#000000). Always use the `surface` palette for a premium, inked-paper feel.
*   **Don't** use standard "drop shadows" with 20%+ opacity. They look "cheap" and break the editorial immersion.
*   **Don't** align everything perfectly to the left. Experiment with offset headlines or right-aligned metadata to create visual interest.