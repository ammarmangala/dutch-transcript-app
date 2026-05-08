---
name: Silk Narrative System
colors:
  surface: '#fcf8ff'
  surface-dim: '#dbd8e4'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2fe'
  surface-container: '#efecf8'
  surface-container-high: '#e9e6f3'
  surface-container-highest: '#e4e1ed'
  on-surface: '#1b1b23'
  on-surface-variant: '#464554'
  inverse-surface: '#303038'
  inverse-on-surface: '#f2effb'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#595f65'
  on-secondary: '#ffffff'
  secondary-container: '#dee3ea'
  on-secondary-container: '#5f656b'
  tertiary: '#904900'
  on-tertiary: '#ffffff'
  tertiary-container: '#b55d00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#dee3ea'
  secondary-fixed-dim: '#c2c7ce'
  on-secondary-fixed: '#171c21'
  on-secondary-fixed-variant: '#42474d'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#fcf8ff'
  on-background: '#1b1b23'
  surface-variant: '#e4e1ed'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 8px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

This design system is built for a premium transcription and note-taking experience, emphasizing focus, tranquility, and physical intuition. The brand personality is "Quietly Sophisticated"—it does not shout for attention but rewards interaction through tactile feedback and visual depth.

The aesthetic follows a refined Neomorphic approach. Unlike early iterations of the trend which lacked accessibility, this system uses subtle contrast and purposeful extrusion to guide the eye. It evokes the feeling of high-end industrial design, where software feels like a physical object carved from a single block of material. It targets professionals who value a clean, distraction-free environment for deep thought and recording.

## Colors

The palette is monochromatic and low-contrast to maximize the "soft UI" effect. The base background color is a neutral grey-white that provides enough range for both pure white highlights and soft blue-grey shadows.

- **Muted Indigo (#6366f1):** Reserved strictly for primary actions, active recording states, and critical data points. It should be used sparingly to maintain the sophisticated, calm atmosphere.
- **Surface Foundations:** The system relies on a three-color stack for depth: a base surface (`#f0f2f5`), a top-left highlight (`#ffffff`), and a bottom-right shadow (`#d1d9e6`).
- **Text:** High-contrast black is avoided. Instead, deep charcoal and slate greys are used to maintain the soft aesthetic while ensuring legibility.

## Typography

Plus Jakarta Sans is the sole typeface, chosen for its modern geometric construction and friendly, open apertures. 

Typography in this design system often interacts with the depth of the UI. Headlines should feel "printed" onto the extruded surfaces, while secondary metadata uses a lower-contrast grey to recede. Large, bold headings are essential to provide hierarchy where color contrast is intentionally limited. For transcription text, line height is increased to 1.6 to allow for optimal readability during long-form playback.

## Layout & Spacing

The layout philosophy follows a generous, fluid model. Content should feel airy and uncrowded to reinforce the high-end aesthetic.

- **Grid:** A 12-column grid is used for desktop, but the "Silk" aesthetic benefits most from centered, single-column reading experiences for transcripts.
- **Rhythm:** Spacing follows a 4px baseline, with 24px (md) being the standard padding for cards and containers.
- **Depth Margin:** Elements require more breathing room (margin) than standard flat designs to accommodate the soft shadow "glow" or "spread," preventing visual overlap of depth effects.

## Elevation & Depth

This design system rejects traditional "Z-index" stacking in favor of a topographical approach. Surfaces are treated as a single continuous plane that is either pushed in or pulled out.

- **Extruded (Raised):** Created using two shadows. A light shadow (White, 100% opacity) on the top-left and a dark shadow (Soft Grey, 15% opacity) on the bottom-right. Used for buttons and cards.
- **Pressed (Inset):** Created by reversing the shadows and placing them *inside* the element. Used for input fields, progress bars, and active button states.
- **Softness:** Shadows should have a large blur radius (typically 2x the distance) to ensure they feel like light hitting a matte surface, not a sharp edge.

## Shapes

The geometry of the design system is consistently soft. A base radius of 12px (Level 2) is applied to almost all interactive components. 

- **Outer Containers:** Larger cards should use 24px corners to maintain a nested visual harmony with internal 12px elements.
- **Buttons:** Small buttons maintain the 12px radius, while circular icons use 50% (pill-shaped) to represent "knobs" in the tactile interface. 
- **Consistency:** Avoid sharp corners entirely; even the smallest tags or chips should carry a minimum of a 4px radius.

## Components

### Buttons
Primary buttons appear extruded. On click/hover, they should transition into a "pressed" (inset) state to provide tactile feedback. Text remains center-aligned.

### Cards
Cards should be the primary method for grouping transcript sessions. They feature a subtle "raised" effect. Do not use borders; let the dual-shadow technique define the boundary.

### Input Fields
Search bars and text inputs appear "carved" into the surface (inset depth). This visual cue signals that they are empty vessels waiting to be filled with content.

### Playback Controls
For the transcript app, the play/pause button is the centerpiece. It should be a larger, more pronounced extruded circle, utilizing the Muted Indigo color for the icon or the surface itself to denote importance.

### Chips & Tags
Tags for categorizing transcripts (e.g., "Work," "Interview") should be flat or very subtly inset to avoid competing with primary action buttons.

### Progress Bars
The transcription progress or audio seeker should be an inset "track" with a raised "thumb" (handle), mimicking a physical slider on a high-end audio console.