# Bug Fixes Log - RM Industrial Mobile Responsiveness

This document logs all corrections applied to the mobile responsiveness of the **RM Sobras e Reciclagem Industrial** project.

## [FIX-001] Prototype Switcher & Header Overlap
* **Type**: Layout / Alignment
* **Symptoms**: On mobile screens (under 768px), the prototype switcher wrapped into multiple lines, exceeding its hardcoded height. The fixed main header at `top: 86px` overlapped with the switcher and covered the top portion of the page content.
* **Resolution**:
  - Hided the switcher title and badge on viewports under 768px.
  - Set the switcher height to a fixed `60px` with centered flex row buttons.
  - Adjusted the `.main-header` top offset to a clean `60px`.
  - Scaled body padding-top dynamically: `130px` under 768px, and `120px` under 480px.
  - Bounded branding-active view padding to `60px` on mobile since the main header is hidden.

## [FIX-002] Circular Orbits Detail Info Loss
* **Type**: UX / Interactivity
* **Symptoms**: The hover tooltip cards (`.orbit-hud-card`) were hidden on mobile using `display: none !important`. This resulted in complete loss of information about copper, aluminium, inox, motors, and transformers for mobile users.
* **Resolution**:
  - Created a static details container `#orbit-details-mobile` positioned underneath the orbit system.
  - Added click listeners to `.orbit-item` icons that extract the title and list properties from the hidden HTML and render them inside the details panel on mobile.
  - Pauses the rotation animation (`.paused`) of the orbits when an item is selected to allow comfortable reading. Clicking on any other area resumes the rotation and resets the details.

## [FIX-003] Branding Tabs Wrapping
* **Type**: Layout
* **Symptoms**: The three branding buttons in `.branding-tabs-nav` wrapped onto separate lines, cluttering the mobile view and taking up 120px of vertical space.
* **Resolution**:
  - Made the navigation bar horizontally scrollable on mobile using `overflow-x: auto`, `white-space: nowrap`, and `flex: 0 0 auto`.
  - Added native swipe physics (`-webkit-overflow-scrolling: touch`) and hid the default scrollbar for a premium mobile-native feel.

## [FIX-004] Overcrowded Card Paddings on Mobile
* **Type**: Spacing
* **Symptoms**: Both `.details-box` and `.card-branding-info` maintained a `40px` padding on screens under 768px, narrowing the content column to less than 240px and causing awkward text wrapping.
* **Resolution**:
  - Reduced padding to `20px` inside media queries under 768px.

## [FIX-005] Instagram Text Card Overflows
* **Type**: Layout / Overflow
* **Symptoms**: The text card inside the 2-column Instagram feed on mobile overflowed its bounds due to a large font size and large padding inside a small square box.
* **Resolution**:
  - Reduced padding to `12px` and font-size of headings to `10px` on viewports under 480px.
