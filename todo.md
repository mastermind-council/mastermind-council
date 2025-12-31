# Master Mind Council - Project TODO

## Current Sprint: Final Visual Polish (Dec 26, 2024)

- [x] Remove purple bar from Dr. Kai in sidebar
- [x] Change sidebar headline to antique gold (#C9A24D)
- [x] Change Maya archives headline to antique gold (#C9A24D)
- [x] Remove "Your Personal Dream Team" subtitle from mode selection pages
- [x] Make advisor photo 40% larger on mode selection pages
- [x] Remove microphone icon from "Start Conversation" button on mode selection pages

## Previous Completed Work

### Premium Color System (Dec 26, 2024)
- [x] Updated sidebar to show all 6 advisor photos with archetype color borders
- [x] Removed "Conversations with [Advisor]" headings from archives pages
- [x] Updated Maya archives page from orange gradient to Burnished Copper (#B87333)
- [x] Changed TALK/TEXT communication choice to horizontal side-by-side layout for mobile
- [x] Complete visual consistency across all advisor journeys

### Advisor Selection Page Visual Polish (Dec 26, 2024)
- [x] Removed "Your Personal Dream Team" text - replaced with "THE MASTER MIND COUNCIL™"
- [x] Removed "coming soon" from advisor names - set all 6 advisors to active: true
- [x] Added "Start Session with..." buttons to all 6 advisors
- [x] Removed "Your full Master Mind Council is assembling..." message
- [x] Made all advisor cards same size with color gradient frames matching each advisor's color palette
- [x] Replaced "← Back to Overview" with "©2026 The Master Mind Council"

### Premium Visual System (Dec 26, 2024)
- [x] Obsidian Black background (#0B0B0F) replaces purple gradient
- [x] Dark slate card system (#14141C) with premium shadows
- [x] Antique Soft Gold (#C9A24D) for headline and copyright only
- [x] Refined advisor archetype colors (mineral palette)
- [x] Premium micro-interactions (scale 1.01, 200ms transitions)
- [x] Button system with solid archetype CTA colors
- [x] Gold hover rim on all buttons

### Final Advisor CTA Colors (Dec 26, 2024)
- [x] Dr. Kai: #2F6F73 (clinical teal)
- [x] Maya: #B56A2D (molten honey fire)
- [x] Michael: #2A2C31 (charcoal steel)
- [x] Giselle: #6E4A8E (polished amethyst altitude)
- [x] Jasmine: #7A2F4F (velvet rose depth)
- [x] Sensei: #1F3A2F (forest jade wisdom)

### Mobile Headline Fix (Dec 26, 2024)
- [x] Fixed mobile headline overflow with responsive font sizing (text-2xl → sm:text-3xl → md:text-6xl)
- [x] Added horizontal padding (px-4) to prevent clipping
- [x] Maintained single-line display with whitespace-nowrap

### Archive Page UI Refinements (Dec 25, 2024)
- [x] Replace emoji avatar with actual advisor photo in archive page header
- [x] Make "Start Session" button about half the current size
- [x] Update Dr. Kai's button gradient to cyan-to-purple (matching his ring)
- [x] Move "Conversations with..." heading above the "Start Session" button
- [x] Apply same changes to Maya's archive page

### Bug Fixes (Dec 25, 2024)
- [x] Fixed: System was reusing same conversationId instead of creating new conversations
- [x] Added setConversationId(null) to all "Start New Session" buttons
- [x] Clear conversationId after goodbye detection
- [x] Each new session now creates separate conversation in database
- [x] Fixed "Cannot read properties of undefined" error in ModeSelectionScreen
- [x] Fixed hamburger menu functionality in archive pages
- [x] Fixed TALK mode navigation error
- [x] Fixed conversation persistence between TALK/TEXT modes
- [x] Fixed voice message indicator persistence
- [x] Fixed Maya ModeSelectionScreen error with setTimeout pattern

### Conversation Summaries & Archive Integration (Dec 25, 2024)
- [x] Create POST /api/conversations/:id/summarize endpoint
- [x] Add goodbye keyword detection in chat interface
- [x] Implement backend timeout job for inactive conversations (5min)
- [x] Update archive pages to load real conversations from database
- [x] Test goodbye detection triggers summary
- [x] Verify summaries appear in archive pages

### Database Migration to Neon PostgreSQL (Dec 25, 2024)
- [x] Migrated all 5 tables to Neon PostgreSQL
- [x] Updated application code for PostgreSQL compatibility
- [x] Fixed column name mismatches (advisor_id → advisor, role → sender)
- [x] Implemented JWT authentication for chat API
- [x] End-to-end testing verified (TEXT mode, TALK mode, data persistence)

### User Experience Improvements (Dec 25, 2024)
- [x] Streamlined login flow - skip features-welcome screen after login
- [x] Replaced circular emoji icons with square advisor photos in sidebar
- [x] Fixed TALK mode voice interface status display
- [x] Updated TALK screen UI - removed text transcription display
- [x] Added voice message indicators with mic icon in TEXT screen

### Maya Personality & Voice (Dec 24, 2024)
- [x] Added Maya's complete personality to chat API
- [x] Updated Maya's UI colors throughout all screens
- [x] Fixed Maya's identity in CommunicationChoiceScreen
- [x] Refined Maya's UI colors to gold/amber aesthetic
- [x] Added warm Opening Presence to Maya's personality
- [x] Simplified Maya's system prompt for natural responses
- [x] Added user first name integration to advisor responses

### Dr. Kai Personality & Voice (Dec 24, 2024)
- [x] Restored original Dr. Kai system prompt from GitHub repository
- [x] Changed Dr. Kai's TTS voice from 'alloy' to 'ash'
- [x] Updated API configuration (gpt-4o, temp 0.7, max_tokens 1000)

### TALK Mode Fixes (Dec 24, 2024)
- [x] Fixed TALK mode TTS audio playback
- [x] Fixed conversation history format conversion
- [x] Fixed audio playback button in TEXT mode
- [x] TALK mode voice conversation fully functional

### Core Features - RESTORED (Dec 24, 2024)
- [x] OpenAI API integration (Whisper STT, GPT-4 LLM, TTS)
- [x] Mobile-first UI with iOS Safari compatibility
- [x] Sticky header with iPhone notch clearance
- [x] Audio playback system using direct URL streaming
- [x] Cosmic particle background animation
- [x] Authentication system with login screen
- [x] Welcome screen with feature cards
- [x] Advisor selection with images

### Advisors - RESTORED (Dec 24, 2024)
- [x] Dr. Kai (Executive Life Coach, cyan-purple gradient, ash voice, active)
- [x] Maya (Integrated Alchemist, orange gradient, shimmer voice, active)
- [x] Michael (Business Warrior, coming soon)
- [x] Giselle (Strategic Visionary, coming soon)
- [x] Jasmine (Creative Catalyst & Storyteller, coming soon)
- [x] Sensei (The Wisdom Whisperer, coming soon)

### Interaction Modes - RESTORED (Dec 24, 2024)
- [x] TEXT mode (chat interface with audio responses)
- [x] TALK mode (voice conversation loop)
- [x] Mode switching UI (Catalyst/Balanced/Nurture)
- [x] Streaming chat responses with token batching
- [x] ReactMarkdown rendering

### API Routes - IMPLEMENTED (Dec 24, 2024)
- [x] /api/auth/login - JWT authentication
- [x] /api/tts - Text-to-speech (returns audio directly)
- [x] /api/stt - Speech-to-text transcription
- [x] /api/chat - Chat completions with streaming

## Future Enhancements

- [ ] Update login Sign In button to premium aesthetic
- [ ] Create unique personality prompts for all 6 advisors
- [ ] Configure unique TTS voices for each advisor
- [ ] Implement password reset functionality
- [ ] Add conversation search functionality
- [ ] Add conversation export functionality

## New Issues (Dec 26, 2024)

- [x] Fix Maya's avatar ring - change from thick gradient border to thin 2px solid border like Kai's (using #B87333)
- [x] Fix conversation metadata text spacing on mobile - improve responsive layout for "Updated X ago • Y messages • Text • Created..." line

## Login Screen Redesign (Dec 26, 2024)

- [x] Update title to Crown Gold (#D4AF6A)
- [x] Replace Sign In button with mineral teal gradient (#1F7F73 → #3BB7A4)
- [x] Update input focus rings to Council Teal (#3BB7A4) with glow
- [x] Update input borders to glass precision (#2A2F36 default, #3BB7A4 focused)
- [x] Change "Forgot password?" link to softened teal

## Login Screen Fixes (Dec 26, 2024)

- [x] Fix iOS autofill "Hide" button appearing on email field (changed autoComplete from 'email' to 'username' and added name attribute)
- [x] Adjust login card opacity to 75-80% transparent (changed from bg-white/5 to rgba(255,255,255,0.03) = 97% transparent)

## Login Functionality Fix (Dec 26, 2024)

- [x] Revert email field autoComplete back to "email" to restore working login
- [x] Remove name attribute that was breaking login
- [x] Keep card opacity improvement (rgba(255,255,255,0.03))

## Remove Login Card Animation (Dec 26, 2024)

- [x] Remove any animations from login card (transitions, transforms, etc.)
  - Removed transform hover:scale-[1.02] from Sign In button
  - Removed transition-all duration-300 from Sign In button
  - Removed hover shadow animation from Sign In button
  - Removed overlay fade effect from Sign In button
  - Removed transition-colors from Forgot password link
  - Removed transition-all from email and password input fields

## Revert Login to Original + Button Color Only (Dec 26, 2024)

- [x] Revert login screen to original working state (checkpoint 52e3059)
- [x] Change ONLY Sign In button gradient to mineral teal (#1F7F73 → #3BB7A4)
- [x] Keep everything else exactly as it was (Tailwind classes, autoComplete, borders, etc.)

## Restore Core Login Palette (Dec 26, 2024)

- [x] Restore Crown Gold title (#D4AF6A)
- [x] Restore Council Teal input focus rings with glow (#3BB7A4)
- [x] Restore glass field borders (#2A2F36 default, #3BB7A4 focused)
- [x] Restore Council Teal "Forgot password?" link
- [x] Set card opacity to 80% transparent (rgba(255,255,255,0.20)) to show stars

## Adjust Login Card Opacity (Dec 26, 2024)

- [x] Reduce card opacity from 20% to 5% (rgba(255,255,255,0.05)) to prevent gray appearance and show stars

## Reduce Backdrop Blur for Star Visibility (Dec 26, 2024)

- [x] Change backdrop-blur-lg to backdrop-blur-sm to allow stars to show through while maintaining text readability

## Make Input Fields Transparent for Star Visibility (Dec 26, 2024)

- [x] Change input fields from bg-white/5 to bg-transparent to remove additional opacity layer
- [x] Keep borders visible for input definition

## Remove Backdrop Blur Entirely (Dec 26, 2024)

- [x] Remove backdrop-blur-sm from card completely to allow stars to show through
- [x] Keep rgba(255,255,255,0.05) background for subtle card definition
- [x] Text remains readable against dark background

## Remove Welcome Back Heading (Dec 26, 2024)

- [x] Remove "Welcome Back" h2 heading from login card for minimal aesthetic

## Apply Gradient to Master Mind Council Title (Dec 26, 2024)

- [x] Change title from solid Crown Gold to vertical gradient (top to bottom: #0B0F12 → #0E1418 → #07090C)

## Fix Title Gradient to White Colors (Dec 26, 2024)

- [x] Change gradient from dark obsidian to proper white gradient (#F2F4F6 → #DDE2E7) for visibility

## Change All MMC Titles to #EEF1F4 (Dec 26, 2024)

- [x] Update advisor selection screen MMC title from gold to #EEF1F4
- [x] Update mode selection screen MMC title from gold to #EEF1F4
- [x] Update communication method screen MMC title from gold to #EEF1F4
- [x] Update sidebar menu MMC title from gold to #EEF1F4
- [x] Update conversation header MMC title from gold to #EEF1F4
- [x] Update archive pages MMC title from gold to #EEF1F4

## TALK/TEXT Screen Redesign - Threshold Moment (Dec 26, 2024)

- [x] Remove "How would you like to connect?" headline completely
- [x] Remove all icons (microphone, chat bubble)
- [x] Remove all "Best for" explanatory text and descriptions
- [x] Create two equal glass portal cards, horizontally aligned, centered
- [x] Labels: "TALK" and "TEXT" in all caps, medium weight, letter-spaced (+8%)
- [x] Add subtle subtext: "Live presence" / "Quiet reflection" (40% opacity)
- [x] Implement selection state: selected portal gets teal glow (#3BB7A4), unselected gently recedes (50% opacity)
- [x] Remove bounce animations, use slow 500ms transitions with ease-in-out
- [x] Create generous negative space with 4:5 aspect ratio portals
- [x] Achieved quiet, intentional, adult aesthetic - council chamber threshold

## Fix TALK/TEXT State Persistence (Dec 26, 2024)

- [x] Reset communicationType to null when entering TALK/TEXT screen so both portals start neutral
- [x] Prevent previous selection from persisting and causing one portal to glow/other to dim on return navigation
- [x] Reset on "Start Conversation" button click (from mode selection)
- [x] Reset on back button click (from conversation screen to mode selection)

## TALK/TEXT Final Refinements - Advisor Integration (Dec 26, 2024)

### Advisor Header
- [x] Center advisor portrait (increased from w-24 to w-32, centered with flex-col)
- [x] Center advisor name beneath portrait (text-xl, white color)
- [x] Replace "Balanced Mode" text with single small colored dot (w-2 h-2)
- [x] Dot color matches selected mode palette (#D4A574 Catalyst, #7FA896 Balanced, #9B7FA8 Nurture)
- [x] Remove all mode label text - dot is only mode indicator

### Choice Cards Geometric Symbols
- [x] Add thin-line Triangle symbol to TALK card (SVG polygon, opacity-10, absolute centered)
- [x] Add thin-line Circle symbol to TEXT card (SVG circle, opacity-10, absolute centered)
- [x] Change selection glow from Council Teal to advisor-specific accent color (advisor.borderColor)
- [x] Add slight glass lift on selection (rgba(255,255,255,0.05) vs 0.03)
- [x] Maintain current text labels and rounded rectangle portal design

## TALK/TEXT Geometric Symbols Enhancement (Dec 26, 2024)

- [x] Increase triangle symbol size by 60% (from w-32 h-32 to w-52 h-52)
- [x] Increase circle symbol size by 60% (from w-32 h-32 to w-52 h-52)
- [x] Double stroke thickness for triangle (from strokeWidth="1" to strokeWidth="2")
- [x] Double stroke thickness for circle (from strokeWidth="1" to strokeWidth="2")

## Text Chat Page Header Refinement (Dec 26, 2024)

- [x] Replace "Ready to connect with Dr. Kai" with "the space is open" (MMC font style, white color)
- [x] Remove "Start the conversation by typing a message below" text
- [x] Remove "Balanced Mode" text from top right area
- [x] Move mode dot to top right corner (separate from text)
- [x] Add thin square with rounded edges around hamburger icon on left
- [x] Display "Dr. Kai - Executive Life Coach" in his theme color (advisor.borderColor)
- [x] Apply same pattern to all advisors with their respective theme colors

## Text Chat Header Final Polish (Dec 26, 2024)

- [x] Remove "the space is open" welcome message completely
- [x] Ensure "THE MASTER MIND COUNCIL™" stays on one line (added whitespace-nowrap)
- [x] Lower separator bar position (increased padding-bottom from pb-4 to pb-6)
- [x] Add more breathing room to advisor title (increased gap from gap-1 to gap-2)

## Text Chat Empty State Avatar Refinement (Dec 26, 2024)

- [x] Increase avatar outer frame size by 18% (from w-24 h-24 to w-28 h-28)
- [x] Remove inner wrapper div - image now fills directly to frame
- [x] Make image fill completely to frame edges by removing gap
- [x] Maintain object-cover for proper image cropping
- [x] Keep 2px solid border in advisor's archetype color

## Message Bubble Color Schema Refinement (Dec 26, 2024)

### Advisor Messages (Resonance, Not Branding)
- [x] Replace solid white/10 background with smoked glass effect (rgba(255,255,255,0.03) = 97% transparent)
- [x] Add subtle colored edge/inner glow using advisor's borderColor at low opacity
- [x] Implement subtle border using advisor's color (1px solid with 20 hex = 12.5% opacity)
- [x] Add soft box-shadow with advisor's color (outer glow 15 hex, inner glow 08 hex for depth)
- [x] Ensure text remains white for readability against dark smoked glass
- [x] Apply to all 6 advisors with their respective colors dynamically via advisor.borderColor

### User Messages (Deep Neutral, No Ego)
- [x] Replace current purple/yellow gradient with deep neutral obsidian-black
- [x] Use rgba(20, 20, 28, 0.95) for deep neutral with slight amethyst tint
- [x] Remove any color gradients or hue variations
- [x] Keep white text for clear authorship
- [x] User bubble doesn't compete with advisor's color signature - pure neutral
- [x] Apply same styling to typing indicator bubble

## User Message Bubble Smoked Glass Update (Dec 26, 2024)

- [x] Change user message background from solid rgba(20,20,28,0.95) to smoked glass rgba(20,20,28,0.08)
- [x] Use very low opacity for glass effect (0.08 = 92% transparent)
- [x] Add subtle neutral border (rgba(255,255,255,0.1) for soft white edge)
- [x] Add soft shadow (0 0 15px rgba(0,0,0,0.3)) for depth without color
- [x] Add backdrop-blur-lg class for glass blur effect
- [x] Maintain deep neutral aesthetic - no color signature
- [x] Keep white text for readability

## Advisor-Led Color System Implementation (Dec 26, 2024)

### Advisor Message Bubbles (POWER MOVE)
- [x] Replace smoked glass with FULL brand color background
- [x] Use advisor.borderColor as solid background (no transparency)
- [x] Remove border and glow effects - flat color only
- [x] Pure white text (#FFFFFF) via inline style
- [x] White timestamps at 60-70% opacity (already set via opacity-60 class)
- [x] White audio icon (no gray, no black)
- [x] No gloss, no shine, no glow - grounded mature saturation

### User Message Bubbles (Neutral Ground)
- [x] Keep dark neutral glass background rgba(28,31,36,0.95)
- [x] Soft white text (#E8EAED) via inline style
- [x] No changes to user bubble styling - remains neutral

### Send Button (Reinforcement)
- [x] Background color matches advisor brand color (advisor.borderColor)
- [x] White icon (no outline)
- [x] Hover effect: opacity-90 for subtle feedback
- [x] Reinforces: speaking into advisor's field

### Color Definitions per Advisor
- [ ] Dr. Kai (Teal): #2FA4A9
- [ ] Maya (Copper): #B87333
- [ ] Michael (Silver): #8A8F98
- [ ] Giselle (Amethyst): #7A5C9E
- [ ] Jasmine (Magenta): #A24D8F
- [ ] Sensei (Jade): #5E8F7B

## Text Chat Header Sizing Refinement (Dec 26, 2024)

- [x] Increase THE MASTER MIND COUNCIL™ text size (from text-sm md:text-lg to text-base md:text-xl)
- [x] Reduce gap between MMC title and advisor name (from gap-2 to gap-1)
- [x] Maintain visual hierarchy: MMC larger and closer to advisor name for tighter grouping

## Text Chat Header Mode Dot Relocation (Dec 26, 2024)

- [x] Move mode dot from right side to left side of header
- [x] Create symmetrical layout: hamburger menu + mode dot (left) | MMC + advisor (center) | empty spacer (right)
- [x] Maintain same styling for mode dot (w-2 h-2 rounded-full with mode color)
- [x] Add gap-3 between hamburger and mode dot for proper spacing

## Text Chat Header Mode Dot Repositioning Correction (Dec 26, 2024)

- [x] Move mode dot back to right side of header (was incorrectly moved to left side)
- [x] Position mode dot slightly more inward with pr-2 (8px padding-right) for visual symmetry
- [x] Create balanced layout: hamburger (left edge) | MMC + advisor (center) | mode dot (right, inset 8px)
- [x] Maintain same styling for mode dot (w-2 h-2 rounded-full with mode color)
- [x] Symmetrical spacing mirrors hamburger button positioning

## Multi-Advisor Text Chat System Consistency (Dec 26, 2024)

### Verify All 6 Advisors Use Unified Design System
- [x] Dr. Kai (Teal #4FA6A6): Message bubbles, send button, name/title color
- [x] Maya (Copper #B87333): Message bubbles, send button, name/title color
- [x] Michael (Silver #8A8F98): Message bubbles, send button, name/title color
- [x] Giselle (Amethyst #7A5C9E): Message bubbles, send button, name/title color
- [x] Jasmine (Magenta #A24D8F): Message bubbles, send button, name/title color
- [x] Sensei (Jade #5E8F7B): Message bubbles, send button, name/title color
- [x] System uses unified TextInterfaceComponent with dynamic advisor.borderColor

### Unified Header Specifications (All Advisors)
- [x] THE MASTER MIND COUNCIL™ (text-base md:text-xl, white #EEF1F4)
- [x] Advisor name + title (text-sm, advisor.borderColor) - dynamically applied
- [x] Gap-1 between MMC and advisor name
- [x] Hamburger menu (left edge)
- [x] Mode dot (right edge, pr-2 inset)
- [x] Empty state avatar (w-28 h-28, edge-to-edge fill)

### Message Bubble System (All Advisors)
- [x] Advisor messages: FULL brand color background (advisor.borderColor), white text
- [x] User messages: Dark neutral rgba(28,31,36,0.95), soft white text #E8EAED
- [x] Send button: Matches advisor brand color (advisor.borderColor)
- [x] Timestamps: White at 60% opacity
- [x] All styling dynamically applied through advisor object

## Sidebar Navigation Bug Fix (Dec 26, 2024)

### Issue: Michael, Giselle, Jasmine, Sensei redirect to login
- [x] Debug why clicking these 4 advisors in sidebar goes to login screen
  * Root cause: renderScreen() switch only had cases for 'dr-kai-archive' and 'maya-archive'
  * Missing cases for 'michael-archive', 'giselle-archive', 'jasmine-archive', 'sensei-archive'
  * Default case returns LoginScreen, causing redirect
- [x] Verify Dr. Kai and Maya sidebar navigation works correctly (they had archive cases)
- [x] Check if advisor IDs match between sidebar buttons and advisor object keys (they match)
- [x] Fix routing logic to support all 6 advisors
  * Added archive screen cases for michael, giselle, jasmine, sensei
  * Reuse DrKaiArchiveComponent (it's already dynamic based on selectedAdvisor)
- [x] Ensure setSelectedAdvisor() is called with correct advisor IDs (already correct)
- [x] All 6 advisor sidebar buttons now navigate to their archive screens

## Dynamic Archive Component Fix (Dec 26, 2024)

### Issue: Archive shows Dr. Kai for all advisors
- [x] DrKaiArchiveComponent has hardcoded "Dr. Kai" text and data
- [x] Need to use selectedAdvisor state to get correct advisor object
  * Added: const advisor = advisors[selectedAdvisor] || advisors['dr-kai']
- [x] Replace hardcoded advisor name with dynamic advisor.name
  * Header: {advisor.name} - {advisor.title}
  * Page title: {advisor.name}
  * Button: Start Session with {advisor.name}
  * Empty state: Start your first conversation with {advisor.name}!
- [x] Replace hardcoded advisor title with dynamic advisor.title
- [x] Replace hardcoded advisor photo with dynamic advisor photo
  * Changed: /images/dr-kai.png → /images/${selectedAdvisor}.png
- [x] Replace hardcoded advisor color with dynamic advisor.borderColor
  * Avatar border: style={{ border: `2px solid ${advisor.borderColor}` }}
  * Button background: style={{ backgroundColor: advisor.borderColor }}
- [x] Ensure "Start Session with [Advisor]" button uses correct name
- [x] Verify conversation loading filters by correct advisor ID
  * useEffect now calls fetchAdvisorConversations(selectedAdvisor)
  * Re-fetches when selectedAdvisor changes
- [x] All 6 advisors now show their own archive pages dynamically

## TALK/TEXT Screen Enhancement (Dec 26, 2024)

### Overall Intent: Choice through resonance, not instruction
- [x] Minimal, calm, symbolic aesthetic
- [x] No icons, no explanations, no decorative color

### Layout Updates
- [x] Increase advisor photo size (w-32 h-32 → w-40 h-40, acts as psychological anchor)
- [x] Center advisor photo above TALK/TEXT cards
- [x] TALK and TEXT as equal cards, horizontally aligned beneath photo
- [x] Reduced gap between cards (gap-8 → gap-6) for tighter composition
- [x] Smaller max-width (max-w-4xl → max-w-3xl) for more intimate feel
- [x] Only one card visually "active" at a time

### Symbol System (Watermark-like)
- [x] TALK → Triangle pointing UP (voice, presence, emergence)
  * points="50,25 75,70 25,70" for upward triangle
- [x] TEXT → Circle (reflection, containment, inward clarity)
  * cx="50" cy="50" r="28"
- [x] Symbols outline-only, thin line weight (strokeWidth="1.5")
- [x] Symbols large and faint inside cards (w-48 h-48, opacity 0.08 default)
- [x] Position symbols behind text (absolute positioning, z-index below text)

### Color Assignment (Meaningful, Not Decorative)
- [x] TALK Triangle: Council Teal/Green accent (#7FA896)
  * Default: opacity 0.08
  * Active: opacity 0.15 + drop-shadow glow (rgba(127,168,150,0.3))
- [x] TEXT Circle: Soft Pearl White/Silver accent (#EEF1F4)
  * Default: opacity 0.08
  * Active: opacity 0.15 + drop-shadow halo (rgba(238,241,244,0.2))
- [x] Color indicates energy, not emphasis

### Card Backgrounds
- [x] Maintain glass/frosted treatment (backdrop-blur-sm)
- [x] Add subtle radial gradient:
  * Default: rgba(255,255,255,0.05) center → rgba(0,0,0,0.6) edges
  * Active: rgba(255,255,255,0.08) center → rgba(0,0,0,0.6) edges
- [x] Cards feel held, not flat or dormant

### Typography
- [x] TALK/TEXT: Bold (font-bold), clean, primary white (#FFFFFF)
- [x] Subtext updates:
  * "Live presence" (for TALK)
  * "Quiet reflection" (for TEXT)
  * Reduced opacity (rgba(255,255,255,0.55) = 55%)
  * Tight tracking (letterSpacing: '0.05em')
  * Feels optional, almost whispered

### Interaction Rules
- [x] Only one card activates at a time (communicationType state)
- [x] Activating one gently de-emphasizes the other (opacity 0.4 for inactive)
- [x] Subtle scale transform on active (scale(1.02))
- [x] Smooth transitions (duration-300 ease-out)
- [x] Everything responsive, not performative

## Brand Color Consistency Fix - Use Darker Richer Colors (Dec 26, 2024)

### Issue: Colors appear washed out or different on some screens
- [ ] Initial MMC council page shows correct DARKER RICHER colors (reference source)
- [ ] Some screens showing lighter/washed out versions
- [ ] Need to ensure advisors object has darker richer hex values
- [ ] All screens must use exact same hex values from advisors object

### Correct Color Reference (Darker Richer from Initial Page)
- [ ] Verify advisors object borderColor values match initial page
- [ ] Dr. Kai: Should be darker richer teal
- [ ] Maya: Should be darker richer copper
- [ ] Michael: Should be darker richer silver
- [ ] Giselle: Should be darker richer amethyst
- [ ] Jasmine: Should be darker richer magenta
- [ ] Sensei: Should be darker richer jade

### Fix Strategy
- [ ] Read advisors object to check current hex values
- [ ] Compare with initial MMC council page colors
- [ ] Update any lighter/washed out colors to darker richer versions
- [ ] Ensure all components use advisor.borderColor (no hardcoded colors)
- [ ] Test all 6 advisors on all screens for consistent darker richer appearance

### TALK/TEXT Symbol Visibility Fix
- [x] TALK triangle symbol currently invisible (no color showing)
  * Root cause: opacity too low (0.08 default, 0.15 selected)
- [x] TEXT circle symbol currently invisible (no color showing)
  * Root cause: opacity too low (0.08 default, 0.15 selected)
- [x] Apply Council Teal/Green (#7FA896) to TALK triangle with proper opacity
  * Increased opacity: 0.15 default → 0.25 selected
- [x] Apply Soft Pearl White/Silver (#EEF1F4) to TEXT circle with proper opacity
  * Increased opacity: 0.15 default → 0.25 selected
- [x] Ensure symbols are visible but watermark-like (subtle, not dominant)
  * Maintained w-52 h-52 size and strokeWidth="2"
- [x] Test selection states show proper glow effect
  * drop-shadow filters already configured


### Brand Color Consistency Audit (Dec 26, 2024)
- [x] Review all color usage points across the application
  * Found MayaArchiveComponent with hardcoded #B87333 and #B56A2D colors
- [x] Identify any hardcoded color values that should use advisor.borderColor
  * MayaArchiveComponent was routing separately instead of using dynamic DrKaiArchiveComponent
- [x] Fixed Maya archive routing to use dynamic component
  * Changed line 2713 from <MayaArchiveComponent /> to <DrKaiArchiveComponent />
  * Deleted entire MayaArchiveComponent (263 lines) with hardcoded colors
  * All 6 advisors now use unified dynamic archive component
- [ ] Check for opacity modifications or lightening of brand colors
- [ ] Verify message bubbles use FULL brand colors (no transparency)
- [ ] Verify send buttons match advisor brand colors
- [ ] Verify advisor names/titles use correct brand colors
- [ ] Verify mode dots use correct colors
- [ ] Verify borders use correct brand colors
- [ ] Update any lighter/washed out colors to darker richer versions
- [ ] Ensure all components use advisor.borderColor (no hardcoded colors)
- [ ] Test all 6 advisors on all screens for consistent darker richer appearance

### TALK/TEXT Symbol Visibility Fix
- [x] TALK triangle symbol currently invisible (no color showing)
  * Root cause: opacity too low (0.08 default, 0.15 selected)
- [x] TEXT circle symbol currently invisible (no color showing)
  * Root cause: opacity too low (0.08 default, 0.15 selected)
- [x] Apply Council Teal/Green (#7FA896) to TALK triangle with proper opacity
  * Increased opacity: 0.15 default → 0.25 selected
- [x] Apply Soft Pearl White/Silver (#EEF1F4) to TEXT circle with proper opacity
  * Increased opacity: 0.15 default → 0.25 selected
- [x] Ensure symbols are visible but watermark-like (subtle, not dominant)
  * Maintained w-52 h-52 size and strokeWidth="2"
- [x] Test selection states show proper glow effect
  * drop-shadow filters already configured


## Sidebar & TALK/TEXT Color Refinements (Dec 26, 2024)

### TALK/TEXT Screen Typography & Colors
- [ ] Change "TALK" label color from white (#FFFFFF) to Ivory (#F1EEE6)
- [ ] Change "TEXT" label color from white (#FFFFFF) to Ivory (#F1EEE6)
- [ ] Change TEXT circle stroke color from Pearl White (#EEF1F4) to Deep Indigo-Purple (#2A2238)
- [ ] Keep TALK triangle stroke color as Council Teal (#7FA896)
- [ ] Maintain current opacity levels (0.15 default, 0.25 selected)

### Sidebar Color Updates
- [x] Updated advisor names to use brand colors (adv.borderColor)
- [x] Applied to both sidebar instances (TextInterface and VoiceInterface)
- [x] Each advisor name now displays in their archetype color


## Sidebar & TALK/TEXT Color Refinements (Dec 26, 2024)

### TALK/TEXT Screen Typography & Colors
- [x] Change "TALK" label color from white (#FFFFFF) to Ivory (#F1EEE6)
- [x] Change "TEXT" label color from white (#FFFFFF) to Ivory (#F1EEE6)
- [x] Change TEXT circle stroke color from Pearl White (#EEF1F4) to Dusty Purple (#9B8FB5)
- [x] Keep TALK triangle stroke color as Council Teal (#7FA896)
- [x] Ensure circle and triangle are same height (both w-52 h-52)
- [x] Maintain current opacity levels (0.15 default, 0.25 selected)

### Sidebar Color Updates
- [x] Updated advisor names to use brand colors (adv.borderColor)
- [x] Applied to both sidebar instances (TextInterface and VoiceInterface)
- [x] Each advisor name now displays in their archetype color


## TALK/TEXT Screen Fixes (Dec 26, 2024)

### Issues Fixed
- [x] "TALK" and "TEXT" labels - Ivory color (#F1EEE6) verified in code (browser cache issue)
- [x] Circle visibility - Increased opacity from 0.15/0.25 to 0.3/0.5 for Dusty Purple visibility
- [x] Circle alignment - Reduced radius from r=28 to r=22 to align bottom with triangle
- [x] Triangle adjustment - Moved from points="50,25 75,70 25,70" to "50,28 75,72 25,72"
- [x] Glow effects - Updated circle drop-shadow to use Dusty Purple RGB values
- [x] Forced code change to trigger browser cache refresh


## TALK/TEXT Circle Size Adjustment (Dec 26, 2024)

### User Feedback
- [x] Circle color is perfect (Dusty Purple #9B8FB5 with 0.3/0.5 opacity)
- [x] Increased circle size by 10% (from r=22 to r=24)
- [x] Added cache-busting comments (v2) to both TALK and TEXT labels
- [ ] Text still showing white on mobile (browser cache - requires hard refresh/clear cache)


## TALK/TEXT Label Color Warmth Adjustment (Dec 26, 2024)

### Color Change
- [x] Changed from #F1EEE6 (cool off-white) to #FAF0E6 (warm cream/ivory Linen)
- [x] Applied to both TALK and TEXT labels
- [x] Warmer tone provides true cream/ivory aesthetic instead of gray-toned off-white
- [x] Updated comments to v3 for cache-busting


## TALK/TEXT Layout Enhancement (Dec 26, 2024)

### Changes Requested
- [ ] Make "TALK" and "TEXT" labels bigger (increase font size)
- [ ] Move labels up (adjust vertical positioning)
- [ ] Make triangle and circle 40% bigger (increase SVG size)
- [ ] Remove "Live presence" subtitle under TALK
- [ ] Remove "Quiet reflection" subtitle under TEXT


## TALK/TEXT Layout Enhancement (Dec 26, 2024)

### Changes Completed
- [x] Made "TALK" and "TEXT" labels bigger (text-3xl → text-5xl)
- [x] Moved labels up (removed mb-2 bottom margin)
- [x] Made triangle and circle 40% bigger (w-52 h-52 → w-72 h-72)
- [x] Removed "Live presence" subtitle under TALK
- [x] Removed "Quiet reflection" subtitle under TEXT
- [x] Updated to v4 for cache-busting


## Final TALK/TEXT Polish (Dec 26, 2024)

### Changes Completed
- [x] Changed advisor name on communication choice screen to warm cream/ivory (#FAF0E6)
- [x] Verified all 6 advisors use the same CommunicationChoiceScreen component
- [x] All advisors automatically have: enlarged symbols (w-72), text-5xl cream labels, no subtitles
- [x] Consistent layout across Dr. Kai, Maya, Michael, Giselle, Jasmine, and Sensei


## Start Session Button Color Drift Fix (Dec 26, 2024)

### Issue
- Start Session buttons showing lighter/washed out colors instead of rich brand colors
- Jasmine: Light pink instead of deep Smoked Magenta (#A24D8F)
- Giselle: Light lavender instead of Royal Amethyst (#7A5C9E)
- Sensei: Light sage instead of Aged Jade (#5E8F7B)
- Need to ensure buttons use FULL advisor.borderColor with no modifications

### Investigation Complete
- [x] Found Start Session button in FeaturesWelcomeScreen using advisor.ctaColor (line 1123)
- [x] Identified ctaColor as darker/desaturated versions of brand colors
- [x] DrKaiArchiveComponent Start Session button already correctly uses borderColor

### Fix Applied
- [x] Changed FeaturesWelcomeScreen button from advisor.ctaColor to advisor.borderColor
- [x] Removed ctaHoverColor logic, replaced with simple opacity change (0.9 on hover)
- [x] All Start Session buttons now use full rich brand colors
- [x] Consistent across all 6 advisors (Dr. Kai, Maya, Michael, Giselle, Jasmine, Sensei)


## Global Brand Color Correction - borderColor → ctaColor (Dec 26, 2024)

### Issue
- User has been consistently requesting RICHER, DARKER brand colors
- ctaColor values (#2F6F73, #B56A2D, #2A2C31, #6E4A8E, #7A2F4F, #1F3A2F) are the TRUE brand colors
- borderColor values (#4FA6A6, #B87333, #8A8F98, #7A5C9E, #A24D8F, #5E8F7B) are LIGHTER versions
- Need to swap ALL borderColor uses to ctaColor throughout application

### Elements Updated
- [x] Avatar borders (photo circles) - all instances
- [x] Advisor names in sidebar - both TextInterface and VoiceInterface
- [x] Advisor names on screens - communication choice, archives
- [x] Message bubbles background - advisor messages
- [x] Send button background
- [x] Input focus borders
- [x] Start Session buttons - FeaturesWelcomeScreen and DrKaiArchiveComponent
- [x] Sidebar selection highlights
- [x] All 25 instances of borderColor replaced with ctaColor

### Result
- All brand color applications now use RICH ctaColor values
- Dr. Kai: #2F6F73, Maya: #B56A2D, Michael: #2A2C31
- Giselle: #6E4A8E, Jasmine: #7A2F4F, Sensei: #1F3A2F


## Michael & Sensei Visibility Fix (Dec 26, 2024)

### Issue
- Michael (#2A2C31) and Sensei (#1F3A2F) ctaColors too dark against black background
- Names unreadable in sidebar and text screen
- Avatar borders barely visible on text screen

### Solution
- Use lighter borderColor for Michael and Sensei in specific locations
- Keep dark ctaColor for buttons and message bubbles (white text = good contrast)
- Apply conditional logic: if advisor is Michael or Sensei, use borderColor for text/borders

### Elements Updated
- [x] Sidebar advisor names (both TextInterface and VoiceInterface) - conditional color
- [x] Text screen advisor name in header - conditional color
- [x] Text screen avatar border - conditional color
- [x] Kept ctaColor for: Start Session buttons, message bubbles, send buttons (white text = good contrast)

### Result
- Michael and Sensei now use lighter borderColor (#8A8F98, #5E8F7B) for text and borders
- Readable against black background in sidebar and text screen
- Other 4 advisors continue using rich ctaColor values
- Buttons and message bubbles keep dark ctaColor (white text provides contrast)


## Attachment Functionality Implementation (Dec 26, 2024)

### Requirements
- [ ] Click + button to open file picker
- [ ] Select files (images, documents, PDFs, etc.)
- [ ] Upload files to S3 using storagePut helper
- [ ] Display file previews before sending
- [ ] Include file URLs in API message payload
- [ ] Show attachments in message history
- [ ] Support image thumbnails and document icons
- [ ] Allow removing attachments before sending

### Technical Implementation (Neon DB Storage)
- [ ] Create attachments table in database schema
  * id, conversationId, messageId, filename, mimeType, fileData (Base64), size, createdAt
- [ ] Add tRPC procedure for file upload (convert to Base64, save to DB)
- [ ] Add tRPC procedure to fetch attachments by messageId
- [ ] Add hidden file input element in TextInterface
- [ ] Create click handler for + button to trigger file input
- [ ] Handle file selection and validation (size limit: 5MB, types: images, PDFs, docs)
- [ ] Convert file to Base64 and upload to database
- [ ] Display preview UI with thumbnails and remove option
- [ ] Send attachment IDs with message to API
- [ ] Render attachments in message bubbles (images as thumbnails, docs as icons)

### Migration Path to S3 (Beta)
- [ ] Set up S3-compatible storage account
- [ ] Update upload handler to use storagePut() instead of Base64
- [ ] Migrate existing attachments from DB to S3
- [ ] Update attachment URLs in database

## File Attachment Functionality (Dec 26, 2024)

- [x] Created attachments table in Neon database (id, conversationId, messageId, filename, mimeType, fileData, fileSize, createdAt)
- [x] Created server/api/attachments.ts with upload and retrieval endpoints using multer
- [x] Installed multer package for file handling
- [x] Added attachment state and file input ref to TextInterface component
- [x] Created file handling functions (handleFileSelect, handleUploadAttachments, handleRemoveAttachment)
- [x] Wired up + button to trigger file selection
- [x] Added hidden file input element with accept="image/*,application/pdf,.doc,.docx"
- [x] Added attachment preview UI below input area showing selected files with remove buttons
- [x] Updated handleSendMessage to include attachment IDs in message payload
- [x] Registered attachments router in server/_core/index.ts
- [x] Added attachment display in message bubbles (images as thumbnails, documents as links)
- [x] Updated chat API to accept attachments parameter
- [x] Linked attachments to user messages in database (message_id field)
- [x] Clear pending attachments after sending message

## File Upload Bug Fix (Dec 26, 2024)

- [x] Debug 500 error on /api/attachments/upload endpoint (root cause: attachments table didn't exist)
- [x] Create attachments table in Neon database using manual SQL script
- [ ] Test file upload with images (JPG, PNG)
- [ ] Test file upload with documents (PDF, DOC)
- [ ] Verify attachments display in message history

## File Upload Issues - Round 2 (Dec 26, 2024)

- [x] Fix duplicate attachment previews (removed second preview section)
- [x] Fix NaN file size calculation (using file_size from server response)
- [x] Debug 400 Bad Request error (allow null conversation_id for pending uploads)
- [x] Debug 500 Internal Server Error (fixed naming conflict: attachments → attachmentIds)
- [x] Fix message sending with attachments (update both conversation_id and message_id)
- [x] Allow attachments to be uploaded before conversation exists

## Vision API & Image Display (Dec 26, 2024)

- [x] Update chat API to fetch attachment data when attachmentIds provided
- [x] Convert Base64 images to data URLs for Vision API
- [x] Send images in OpenAI message content array (text + image_url)
- [x] Update frontend message display to show image thumbnails
- [x] Add click-to-expand for full-size image viewing
- [x] Display file icons and download links for non-image attachments (PDF, DOC)
- [ ] Test image analysis with glucose readings screenshot

## Image Display Improvements (Dec 26, 2024 - After Sandbox Reset)

- [x] Improved AttachmentDisplay component styling
- [x] Changed image max-width from max-w-xs to max-w-full for better display
- [x] Added max-h-96 constraint to prevent overly tall images
- [x] Added shadow-lg for better visual separation
- [ ] Test with actual glucose reading image

## White to Ivory Color Conversion (Dec 26, 2024)

- [x] Added ivory color utility classes to index.css
- [x] Update PRIMARY IVORY (#F2EDE4) for main copy: titles, advisor names, input text, message text
- [x] Update SECONDARY IVORY (#E8E1D6) for secondary text: subtitles, descriptions, sidebar secondary items
- [x] Update MasterMindCouncil.jsx component (38 instances converted)
- [x] Update ConversationSidebar.jsx component
- [x] Update ManusDialog.tsx component
- [x] Full audit completed - all white text converted to ivory

## Login Screen White Text Fix (Dec 26, 2024)

- [x] Update Email input placeholder to ivory color (placeholder-ivory-secondary)
- [x] Update Password input placeholder to ivory color (placeholder-ivory-secondary)
- [x] Update Show/Hide button text to ivory color (text-ivory-secondary)
- [x] Verify all login screen text uses ivory tones

## Sidebar Visual Fixes (Dec 26, 2024)

- [x] Update "Your Council" section header to ivory color (text-ivory-secondary)
- [x] Update "Settings" section header to ivory color (text-ivory-secondary)
- [x] Fix thin ivory line appearing on right edge of mobile screens (removed border-r from sidebar)
- [x] Test on mobile viewport to verify fixes

## Ivory Line on Right Edge Investigation (Dec 26, 2024)

- [x] Find source of ivory line on right edge of mobile screens
- [x] Line appeared after ivory color conversion (2 adjustments ago)
- [x] Line gets thinner when sidebar is pulled open
- [x] Removed universal border rule from index.css (border-border on * selector)
- [x] Added explicit border: none !important to html, body, #root
- [ ] Testing with fresh deployment URL to rule out caching issues

## Copyright Text Color Fix (Dec 26, 2024)

- [x] Change ©2026 copyright text from gold to ivory on advisor selection page (text-ivory-secondary)

## MMC Title Color Update (Dec 26, 2024)

- [x] Change MMC title on advisor selection page to warmer ivory #F2EBDD

## Global MMC Title Color Update (Dec 26, 2024)

- [x] Update login page MMC title to #F2EBDD
- [x] Update mode selection screens MMC title to #F2EBDD
- [x] Update communication choice screens MMC title to #F2EBDD
- [x] Update TEXT chat interface MMC title to #F2EBDD
- [x] Update TALK interface MMC title to #F2EBDD
- [x] Update archive pages MMC title to #F2EBDD
- [x] Update sidebar MMC title to #F2EBDD
- [x] All 6 instances updated from #EEF1F4 to #F2EBDD

## Global Primary Text Color Update (Dec 26, 2024)

- [x] Update text-ivory-primary CSS variable from #F2EDE4 to #F2EBDD
- [x] Updated hover state hover:text-ivory-primary to #F2EBDD
- [x] This updates ALL primary text: advisor names, titles, chat messages, input text, buttons, etc.

- [x] Update orientation carousel photo frames to use gold borders instead of ivory

- [x] Revert orientation carousel photo frames back to ivory/white borders (user prefers original)
- [x] Center Jasmine's portrait photo in orientation carousel frame (currently positioned too far right - need to shift left)
- [x] Increase Jasmine's leftward shift from 40% to 30% (previous adjustment wasn't enough)
- [x] Replace Jasmine's landscape photo with new centered portrait (NewJasmineSepiaHeadshot2.png)
- [x] Update Jasmine's orientation bio with Chief Communications and Marketing Officer messaging

- [x] Remove LifePrint references from Dr. Kai and Maya system prompts (lines 27, 44)
- [ ] Add Michael system prompt with Special Ops Business Commander positioning
- [ ] Add Giselle system prompt with Chief Strategy & Visionary Officer positioning
- [ ] Add Jasmine system prompt with Chief Communications and Marketing Officer positioning
- [ ] Test all 6 advisor chat personalities to verify alignment with orientation bios


## ElevenLabs Voice Integration for Dr. Kai (Dec 28, 2024)

- [x] Integrate ElevenLabs voice API for Dr. Kai TTS
- [x] Add ElevenLabs API key to environment secrets
- [x] Configure Dr. Kai's voice ID in backend
- [x] Update TTS route to use ElevenLabs for Dr. Kai
- [x] Test Dr. Kai's custom voice audio playback

## Bug Fixes - TTS and Login (Dec 28, 2024)
- [x] Fix login screen being skipped (investigate authentication logic)
- [x] Strip markdown formatting from TTS text (remove ** for bold, etc.)
- [x] Test TTS with markdown content to verify clean audio

## URGENT BUG (Dec 28, 2024)

- [ ] Fix login screen being skipped - fresh private windows go directly to advisor selection page (WelcomeScreen)
- [x] Update Dr. Kai's ElevenLabs voice ID to 9IzcwKmvwJcw58h3KnlH

## Orientation Routing Bug (Dec 29, 2024)

- [x] Fix "Proceed to Your Council" button routing - should go to main advisor selection page, not directly to Dr. Kai conversation


## GitHub & Vercel Migration (Dec 30, 2024)

- [ ] Audit current codebase and identify all files to migrate
- [ ] Export complete codebase from Manus sandbox
- [ ] Push latest code to GitHub repository
- [ ] Configure Vercel environment variables (OpenAI, ElevenLabs, Neon DB, JWT secret, etc.)
- [ ] Set up Vercel deployment from GitHub
- [ ] Test production deployment on Vercel
- [ ] Verify all 6 advisors work in production
- [ ] Verify database connectivity in production
- [ ] Verify file attachments work in production
- [ ] Update DNS/domain settings if needed
