# Technical Decisions Log - RM Industrial Mobile Responsiveness

This document records the architectural and design decisions made to optimize the mobile experience of the **RM Sobras e Reciclagem Industrial** project.

## [DEC-001] Compact Header and Switcher Hierarchy
* **Context**: Keeping the prototype switcher and main header fixed at the top on mobile took up to 180px of screen height. This was unacceptable as it left less than 70% of the screen space for actual content.
* **Decision**: We chose to hide secondary controls (title and agency badge) in the switcher on mobile, resulting in a single row of compact buttons (`height: 60px`). Combined with a smaller header (`height: 60px`), this keeps the fixed header block to a clean `120px` height on mobile.

## [DEC-002] Static Details Panel for Orbits
* **Context**: Tooltips placed directly on orbit items rotating along circular paths are unusable on touch devices. Absolute tooltips would rotate with the item, causing clipping off the screen edge and making it impossible to read.
* **Decision**: Instead of keeping the tooltips active on touch or hiding them entirely, we introduced a dedicated `#orbit-details-mobile` panel below the graphic. Tapping any item displays the content statically below and pauses the rotation, combining clean usability with the premium layout aesthetic.

## [DEC-003] Horizontal Menu Scrolling over wrapping
* **Context**: Stacking or wrapping the three branding tab navigation buttons vertically takes up unnecessary space.
* **Decision**: We opted for a horizontally scrollable container with a native touch swipe experience (`-webkit-overflow-scrolling: touch`), a layout pattern common in premium mobile apps like Instagram and YouTube.

## [DEC-004] Canvas Performance Optimization
* **Context**: Running particle physics calculations and drawing canvas links for 100 particles on mobile causes processor throttle, battery drain, and scroll lag.
* **Decision**: We checked for touch device properties (`(hover: none)`) and viewport size to reduce the particle count to 15, and completely disabled mouse attraction event listeners on mobile to keep page scrolling at 60 FPS.
