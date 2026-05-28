# Move Holographic CAD Scanner HUD Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move the interactive Holographic CAD Scanner HUD from the Hero section to the Commercial CTA section.

**Architecture:** We will modify `index.html` to relocate the `#hero-scanner-hud` element. We will update `styles.css` to define a grid split class (`.cta-grid-split`) matching `.hero-grid-split`. No JS changes are required as elements are referenced by ID.

**Tech Stack:** HTML5, CSS3, Vanilla JS

---

### Task 1: Update styles.css

**Files:**
- Modify: `c:/Users/alexya/rm-sobras-reciclagem-industrial/styles.css:3213-3221`

**Step 1: Write minimal implementation**
We will add `.cta-grid-split` to the desktop grid rules.

```css
@media (min-width: 992px) {
    .hero-grid-split,
    .cta-grid-split {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 50px;
        align-items: center;
    }
}
```

**Step 2: Save and verify**
Verify that the CSS file compiles/loads without syntax errors.

---

### Task 2: Relocate HTML markup in index.html

**Files:**
- Modify: `c:/Users/alexya/rm-sobras-reciclagem-industrial/index.html`

**Step 1: Remove scanner from hero and disable grid-split**
In `#inicio`, replace:
```html
                <div class="container hero-content hero-grid-split">
```
with:
```html
                <div class="container hero-content">
```
and remove the `<div class="hero-scanner-hud" id="hero-scanner-hud">` block.

**Step 2: Add scanner to cta-commercial and enable grid-split**
In `.cta-commercial`, replace:
```html
                <div class="container">
```
with:
```html
                <div class="container cta-grid-split">
```
and insert the `<div class="hero-scanner-hud" id="hero-scanner-hud">` block right after the `.cta-comm-box` block.

**Step 3: Save and verify**
Open the page and verify that the layout displays correctly on both desktop and mobile viewports.
