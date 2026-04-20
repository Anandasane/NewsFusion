# Design System Specification: The Illuminated Archive

## 1. Overview & Creative North Star
The design language for this platform is guided by the Creative North Star: **"The Illuminated Archive."** 

In an era of information overload and high-stakes testing, we do not simply display data; we curate focus. This system moves away from the "boxy" nature of traditional SaaS platforms, instead opting for a sophisticated, editorial atmosphere. We achieve this through **Intentional Asymmetry**—where large-scale serif typography meets clinical, precise sans-serif UI—and **Tonal Depth**, where the UI feels like layered sheets of obsidian and smoked glass rather than a flat digital screen.

The goal is to evoke the feeling of a high-end physical library at night: quiet, focused, and premium. We break the template by using overlapping elements and a "glow-state" philosophy, where the most important information literally illuminates the dark canvas.

---

## 2. Colors & Atmospheric Depth
Our palette is rooted in deep, cosmic blues and charcoals, punctuated by high-chroma accents that signify action and achievement.

### The Color Tokens
*   **Background / Surface:** `#0b1326` (The foundational void)
*   **Primary (Action):** `#c0c1ff` (Indigo-glow for focus)
*   **Tertiary (Success/Growth):** `#4edea3` (Emerald for progress)
*   **On-Surface (Text):** `#dae2fd` (High-readability soft white)

### The "No-Line" Rule
To maintain a premium editorial feel, **1px solid borders are prohibited for sectioning.** We do not "box" our content. Boundaries must be defined solely through:
1.  **Background Color Shifts:** Use `surface-container-low` for secondary sections and `surface-container-high` for interactive elements.
2.  **Tonal Transitions:** A card should be distinguishable from the background because its surface is a different tier, not because it has a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Base:** `surface` (#0b1326)
*   **Recessed (Feed/Content):** `surface-container-low` (#131b2e)
*   **Raised (Interactive Cards):** `surface-container-high` (#222a3d)
*   **Floating (Popovers/Modals):** `surface-container-highest` (#2d3449)

### The "Glass & Gradient" Rule
Standard flat colors are too "default." For main Call-to-Actions (CTAs) and primary indicators, use **Signature Textures**. Transition from `primary` (#c0c1ff) to `primary-container` (#8083ff) in a subtle 45-degree linear gradient. For floating elements, apply a 12px `backdrop-blur` to semi-transparent surface colors to create a "frosted glass" effect, allowing the deep background tones to bleed through.

---

## 3. Typography
We employ a dual-typeface system to balance functional utility with editorial authority.

*   **UI & Utility (Inter):** Used for labels, buttons, navigation, and dense data. It is clinical and precise.
*   **Editorial & Narrative (Newsreader):** Used for Display, Headlines, and Article body text. This serif font provides the "human" element, reducing eye strain during long-form reading and exam preparation.

### Scale Strategy
*   **Display-LG (Newsreader, 3.5rem):** Use for hero moments and major section headers.
*   **Headline-MD (Newsreader, 1.75rem):** The standard for article titles.
*   **Body-LG (Inter, 1rem):** The primary reading weight for UI-focused content.
*   **Label-MD (Inter, 0.75rem):** Used for metadata, breadcrumbs, and micro-copy.

---

## 4. Elevation & Depth
In this system, light is the architect of space. We use **Tonal Layering** instead of structural lines.

*   **The Layering Principle:** Depth is achieved by "stacking." A card on the `surface-container-low` section should use the `surface-container-highest` token. This creates a soft, natural lift.
*   **Ambient Shadows:** Floating elements (like active exam questions or tooltips) use extra-diffused shadows. 
    *   *Shadow Specs:* Blur: 24px, Spread: -4px, Opacity: 6% of the `on-surface` color. This mimics natural light rather than a harsh digital drop shadow.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at **20% opacity**. Never use 100% opaque borders.
*   **Glow States:** Primary cards may feature a subtle `primary` outer glow (4px blur, 10% opacity) to indicate a "Current Focus" or "Active State."

---

## 5. Components

### Cards & Lists
*   **Design:** Forbid divider lines. Separate list items using `0.5rem` vertical spacing or alternating `surface-container` shifts.
*   **Interaction:** On hover, a card should shift from `surface-container-high` to `surface-container-highest` rather than scaling.

### Buttons
*   **Primary:** Linear gradient (`primary` to `primary_container`). Border radius: `md` (0.375rem). Text color: `on_primary`.
*   **Secondary:** Ghost style. No background, `outline-variant` ghost border (20% opacity), text in `primary`.
*   **Tertiary:** Text-only with an underline that appears only on hover.

### Progress Indicators
*   **Visual Style:** For exam progress, use high-precision thin bars (4px height). 
*   **Color:** Use a transition from `secondary_container` (unfilled) to `tertiary` (filled/success).

### Input Fields
*   **State:** Use `surface-container-lowest` for the field background to create an "etched" look into the surface. 
*   **Focus:** Transition the "Ghost Border" from 20% to 100% opacity of the `primary` color. No heavy glow.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts (e.g., a wide left column for reading and a narrow right column for exam metadata).
*   **Do** prioritize white space (negative space) as a separator over lines or boxes.
*   **Do** use `Newsreader` for any text longer than three sentences to enhance the editorial "premium" feel.
*   **Do** ensure all interactive elements have a clear `surface` shift on hover.

### Don'ts
*   **Don't** use pure black (#000000). Always use the `surface` token (#0b1326) to maintain depth and prevent OLED smearing.
*   **Don't** use high-contrast white text. Use `on-surface` (#dae2fd) to reduce eye fatigue.
*   **Don't** use standard Material Design "Floating Action Buttons." All actions must feel integrated into the editorial grid.
*   **Don't** use sharp corners. Stick strictly to the Roundedness Scale, primarily `md` (0.375rem) and `lg` (0.5rem).