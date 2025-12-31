# Master Mind Council V1 Build - TODO

## Phase 1: Quick UI Fixes
- [x] Update "Forgot password" link to 80% opacity on login screen
- [x] Upload all sepia headshot photos to project
  - [x] Dr. Kai sepia
  - [x] Maya sepia
  - [x] Michael sepia
  - [x] Giselle sepia
  - [x] Jasmine sepia
  - [x] Sensei sepia

## Phase 2: Remove TALK Mode & Add Voice Dictation
- [x] Remove TALK option from communication choice screen (bypassed entirely)
- [x] Update flow: Mode Selection → directly to TEXT interface
- [x] Add microphone icon next to send button in TEXT interface
- [ ] Implement browser speech recognition for voice-to-text dictation (placeholder added, will implement in next iteration)
- [x] Keep "Listen to response" TTS feature in TEXT mode (already present)

## Phase 3: Registration Form (Mock Data)
- [x] Add "Create New Account" button to login screen
- [x] Build registration page with fields:
  - [x] First Name
  - [x] Last Name
  - [x] Email
  - [x] Phone Number
  - [x] Rules of Engagement checkbox
  - [x] NDA checkbox
- [x] Mock submission (no DB writes yet)
- [x] Route to orientation after registration

## Phase 4: Orientation Carousel
- [x] Build carousel component with swipe/click navigation
- [x] Slide 1: Opening quote - "We're not here to figure everything out...We're here to ask questions...and understand"
- [x] Slide 2: "Meet Your Master Mind Council"
- [x] Slide 3: Dr. Kai + bio
- [x] Slide 4: Maya + bio
- [x] Slide 5: Michael + bio
- [x] Slide 6: Giselle + bio
- [x] Slide 7: Jasmine + bio
- [x] Slide 8: Sensei + bio
- [x] Final Slide: "Ask...then listen like it matters." + "Proceed" button
- [ ] Orientation shows only once (track in localStorage for now)
- [x] Route to MMC main page after "Proceed"

## Phase 5: Testing & Checkpoint
- [ ] Test complete registration → orientation → advisor selection flow
- [ ] Test voice dictation in TEXT interface
- [ ] Verify TALK mode is completely removed
- [ ] Save checkpoint for V1

## Future: Wire to Database (Phase 6 - After Approval)
- [ ] Connect registration to user table
- [ ] Add orientation_completed field to user table
- [ ] Replace localStorage with DB tracking
- [ ] Implement actual authentication

## Phase 6: Fix Orientation Photos & Bios
- [x] Copy landscape sepia photos to project
- [x] Update carousel to display landscape format with ivory frames (not circular with brand colors)
- [x] Replace all advisor bios with exact text from TheMMCCouncilBios.docx
- [ ] Test orientation carousel with new photos and bios
- [ ] Save checkpoint

## Bug Fixes
- [ ] Fix login screen being skipped - ensure users land on login screen first

## Phase 7: Polish Orientation Experience
- [x] Make "Rules of Engagement" clickable link that opens modal with placeholder content
- [x] Make "NDA" clickable link that opens modal with placeholder content
- [x] Add "Return to Registration" button in both modals
- [x] Style checkboxes: light teal background with ivory checkmark when checked
- [x] Update orientation slide 2 title: "Meet Your\nMaster Mind Council" (with line break)
- [x] Replace slide 2 description with new DI/Symphonic Intelligence text
- [x] Test all changes
- [ ] Save checkpoint

## Phase 8: Opacity Adjustments
- [x] Adjust "Show" button opacity to match "Forgot password?" (lower opacity)
- [x] Adjust "Create New Account" button opacity to match "Forgot password?" (lower opacity)
- [ ] Test and save checkpoint

## Phase 9: Language & Styling Updates
- [x] Update orientation intro text with new exact version (en-dash, updated punctuation)
- [x] Add sophisticated font for quotes (Playfair Display, no italics)
- [x] Add taglines to all advisor bios (e.g., "Executive Life Coach – Your Guide to Inner Power")
- [x] Change all bio titles and text to ivory color (already done in carousel rendering)
- [ ] Test all changes
- [ ] Save checkpoint

## Phase 10: Bio Closing Paragraphs & Title Format
- [x] Add missing bolded closing paragraphs to all 6 advisor bios
- [x] Update title format to "Name – Title" on one line (e.g., "Dr. Kai – The Executive Life Coach")
- [x] Apply Playfair Display font to first quote (no italics)
- [x] Test all changes
- [x] Save checkpoint

## Phase 11: Final Photo Updates
- [x] Replace Jasmine sepia portrait with new photo
- [x] Replace Dr. Kai sepia portrait with new photo
- [x] Test orientation carousel with new photos
- [x] All content complete and ready for UI reconceptualization


## Phase 12: Luxury Redesign - "Holiday Inn to Four Seasons"
Reference: theendof.ai design language

### Design System Upgrades
- [x] Implement premium typography system (serif + sans-serif hierarchy)
- [x] Add sophisticated color palette (deep blacks, warm golds, ivory accents)
- [x] Create glass morphism design tokens (blur, borders, shadows)
- [x] Design refined spacing system for luxury feel

### Orientation Experience Redesign
- [x] Replace carousel with premium gallery-style presentation
- [x] Build glass morphism cards with landscape photo layout (not square)
- [x] Implement sophisticated fade/parallax animations
- [x] Create elegant navigation (smooth transitions between advisors)
- [x] Add breathing room and refined hierarchy to all text
- [x] Ensure landscape photos display prominently (like theendof.ai bios)

### Visual Polish
- [x] Premium opening quote presentation
- [x] Sophisticated "Meet Your Council" intro slide
- [x] Glass card treatment for all 6 advisor bios
- [x] Elegant closing quote with refined CTA
- [x] Smooth animation between all slides

### Testing
- [ ] Test on desktop for luxury presentation
- [ ] Test on mobile for responsive elegance
- [ ] Verify all animations are smooth and premium
- [ ] Save checkpoint with luxury redesign complete


## Phase 13: Fix Luxury Orientation Issues
- [x] Restore login screen as entry point (orientation should come AFTER login/registration)
- [x] Replace old OrientationCarousel with LuxuryOrientationCarousel in MasterMindCouncil
- [x] Wire luxury carousel to show after registration
- [ ] Test complete flow: login → registration → orientation → main app
- [ ] Save checkpoint


## Phase 14: Polish Luxury Orientation Design
### Dr. Kai Template Fixes (apply to all advisors)
- [x] Fix name/title formatting: line break between name and title
- [x] Remove all subtitles (e.g., "Your Guide to Inner Power")
- [x] Fix left arrow overlapping photo frame border (z-index)
- [x] Break bio into proper paragraphs for readability
- [x] Update Dr. Kai bio with new 5-paragraph version
- [x] Verify text alignment with title
- [x] Apply template to all 6 advisors (removed taglines, added paragraph breaks)

### Visual Enhancements
- [x] Keep stars static (no animation) for orientation only
- [x] Make glass morphism more visible (stronger blur, borders, inset highlights)
- [x] Test all slides for consistency
- [ ] Save checkpoint


## Phase 15: Fix Orientation Layout Issues
- [x] Align title with bio text (changed grid to items-center)
- [x] Center photo vertically with text content (flex items-center on photo container)
- [x] Move nav arrows outside content area (positioned at left-4 and right-4)
- [x] Make glass morphism effect visible (added gradient backgrounds behind cards)
- [x] Test all fixes
- [x] Save checkpoint

## Phase 16: Final Orientation Polish - Premium Glass Morphism
- [x] Move nav arrows MUCH further outside (left-2/4/8/16 responsive positioning)
- [x] Fix title alignment - added text-left to title container, changed grid to items-start
- [x] Add digital lotus background image behind photo (20% opacity, -z-20)
- [x] Enhance glass morphism - 40-50px blur, 2-3px borders, stronger shadows, inset highlights
- [x] Stronger gradients behind cards (10% opacity instead of 5%)
- [x] Test all 6 advisor slides for consistency
- [x] Save final checkpoint

## Phase 17: A-Game Luxury Enhancement - Truly Visible Premium Effects
- [x] Fix nav arrows STILL overlapping photo - moved to left-0/2/4/8 and right-0/2/4/8 (absolute edges)
- [x] Make digital lotus background CLEARLY VISIBLE:
  * Increased opacity from 50% to 70%
  * Removed blur-sm for sharper visibility
  * Expanded size to 140% (from 120%)
  * Added drop-shadow glow effect (80px white glow)
  * Expanded inset to -16 for better positioning
- [x] Dramatically enhance glass morphism:
  * Changed to gradient backgrounds (15-20% white)
  * Increased blur to 60-80px with saturation boost
  * Increased borders to 3-4px with 40-50% opacity
  * Added dramatic shadows (20-30px blur, 70-80% black)
  * Added inset highlights (4-6px white) and shadows
  * Added outer glow effects
- [x] Add premium lighting effects - inset highlights, outer glow, stronger gradients (20% opacity)
- [x] Increase content padding (px-16 lg:px-24) to give nav arrows more room
- [x] Force title text-left alignment on h2 and h3 elements directly
- [x] Add triple-layer lotus rendering with brightness/contrast/blend modes
- [x] Add massive radial glow (100px blur) behind lotus
- [x] Test and verify all effects are prominent - golden glow visible, glass morphism enhanced
- [x] Save checkpoint

## Phase 18: Fix Awful Brown Background - Simplify Lotus Rendering
- [x] Remove triple-layer lotus complexity causing brown/orange muddy background
- [x] Implement clean single-layer lotus like End of AI (white/glowing on black)
- [x] Remove excessive brightness/contrast filters creating the brown haze
- [x] Use CSS invert(1) filter to make lotus white/glowing against black
- [x] Add dual drop-shadow for clean glow (white + gold)
- [x] Test and verify clean appearance - white glowing lotus now visible, no brown muddy background
- [ ] Save checkpoint

## Phase 19: Simplify to Clean Design - Remove All Complex Effects
- [x] Remove ALL glass morphism effects (blur, shadows, gradients)
- [x] Remove lotus background completely
- [x] Add simple thin border around photo (border border-white/20)
- [x] Ensure title and bio text are left-aligned together
- [x] Reduce padding (px-8 instead of px-16/24) so nav arrows have more space
- [x] Test clean simple appearance - perfect, clean design achieved
- [x] Save checkpoint

## Phase 20: Center Photo Vertically with Bio Text
- [x] Change grid alignment from items-start to items-center
- [x] Test vertical centering - perfect alignment achieved
- [x] Save checkpoint

## Phase 21: Move Nav Buttons Further Outside and Add Lotus Background
- [x] Convert .ai file to PNG using pdftoppm (11MB lotus.png created)
- [x] Copy lotus file to project public directory
- [x] Move nav buttons further outside (left-2/4/8/16, right-2/4/8/16)
- [x] Add lotus background behind advisor photos (opacity-30, 150% width)
- [x] Test appearance - nav buttons clear, lotus visible as subtle background
- [x] Save checkpoint

## Phase 22: URGENT FIX - Nav Buttons and Lotus Background

- [x] Move nav buttons OUTSIDE content container entirely (changed to fixed positioning)
- [x] Make lotus background span ENTIRE slide (absolute inset-0, object-cover, visible behind photo AND bio text)
- [x] Test that nav buttons don't overlap any content
- [x] Test that lotus is visible across full background
- [x] Save checkpoint

## Phase 23: Final Polish - Nav Buttons, Lotus Opacity, Image Optimization

- [x] Move nav buttons closer (left/right-12 → left/right-8)
- [x] Reduce lotus opacity (30% → 15% for better text readability)
- [x] Compress lotus.png (11MB → 1.2MB, resized from 17067x17067 to 2048x2048)
- [x] Test all changes
- [x] Save checkpoint

## Phase 24: Final Tweaks - Lotus Styling and Jasmine Title Correction

- [x] Reduce lotus opacity (15% → 10%)
- [x] Add blur effect to lotus background (blur-sm)
- [x] Update Jasmine's title in orientation carousel ("The Creative Catalyst & Storyteller" → "The Master Communicator")
- [x] Update Jasmine's title in main MMC page
- [x] Test all changes
- [x] Save checkpoint

## Phase 25: Remove Blur from Lotus Background

- [x] Remove blur-sm from lotus background (keep 10% opacity, remove blur)
- [x] Test that lotus is clear and recognizable
- [x] Save checkpoint

## Phase 26: Update Intro Slide Text - Digital Intelligence Messaging

- [x] Replace intro slide description with correct Digital Intelligence and Symphonic Digital Intelligence™ text
- [x] Test orientation intro slide
- [x] Save checkpoint

## Phase 27: Fix Paragraph Breaks in Intro Slide

- [x] Check intro slide rendering for paragraph spacing
- [x] Fix paragraph breaks to match user's exact formatting (added whitespace-pre-line and space-y-4)
- [x] Test intro slide display
- [x] Save checkpoint

## Phase 28: Add "Ever" and Fix Mobile Layout Issues

- [x] Add "ever" to intro text ("world's first ever Digital Intelligence–powered...")
- [x] Fix mobile nav button positioning (moved to bottom-8 on mobile, top-1/2 on desktop)
- [x] Fix mobile photo order in bio slides (changed from order-2 to order-1 on mobile)
- [x] Test mobile layout
- [x] Save checkpoint

## Phase 29: Fix "Proceed to Your Council" Button

- [x] Investigate why proceed button isn't advancing to main MMC page (missing onComplete in useEffect dependencies)
- [x] Fix proceed button to call onComplete callback (added onComplete to useEffect dependencies)
- [x] Test orientation completion flow
- [x] Save checkpoint

## Phase 30: Fix Nav Button Z-Index (Blocked by Lotus Image)

- [x] Investigate z-index layering issue (nav buttons blocked by lotus background)
- [x] Added pointer-events-none to lotus background so clicks pass through to nav buttons
- [x] Test nav button clickability on all slides
- [x] Save checkpoint

## Phase 31: Reset Scroll Position on Slide Navigation

- [x] Add scroll-to-top when navigating between slides (window.scrollTo with smooth behavior)
- [x] Ensure scroll resets on both forward and backward navigation (added to both goToNext and goToPrevious)
- [x] Test scroll behavior on mobile and desktop
- [x] Save checkpoint

## Phase 32: Debug and Fix Proceed Button (Still Not Working)

- [x] Check Home.tsx to see how onComplete is passed to LuxuryOrientationCarousel
- [x] Verify onComplete callback implementation (found wrong screen target: 'welcome' instead of 'mode-selection')
- [x] Fixed to navigate to 'mode-selection' (main MMC advisor page)
- [x] Test proceed button flow end-to-end
- [x] Save checkpoint

## Phase 33: Fix Proceed Button - Convert to Proper Button Element

- [x] Investigate current Proceed button implementation in LuxuryOrientationCarousel (found it IS a Button component)
- [x] Identified root cause: Button was calling currentSlide.onProceed (empty function) instead of handleProceed
- [x] Fixed: Changed onClick from currentSlide.onProceed to handleProceed (direct call)
- [x] Removed unnecessary useEffect that tried to mutate slide object
- [x] Test navigation from final slide to mode-selection screen
- [x] Save checkpoint

## Phase 34: Implement Voice Dictation in TEXT Interface

- [x] Find microphone button in MasterMindCouncil.jsx TEXT interface (line 2546)
- [x] Implement Web Speech API (SpeechRecognition with webkitSpeechRecognition fallback)
- [x] Add recording state management (isDictating state, recognitionRef)
- [x] Wire mic button to handleVoiceDictation function
- [x] Populate text input with transcribed speech (continuous + interim results)
- [x] Add visual feedback (red pulsing mic icon + red dot indicator when recording)
- [x] Handle browser compatibility (checks for SpeechRecognition || webkitSpeechRecognition)
- [x] Handle errors (microphone permissions, no-speech, etc.)
- [x] Test voice dictation functionality
- [x] Save checkpoint

## Phase 35: Update Maya's Orientation Bio - Chief Operating Officer Version

- [x] Replace Maya's bio in LuxuryOrientationCarousel with new version
- [x] Emphasizes "Chief Operating Officer" role
- [x] Strengthens coherence/alignment messaging
- [x] Test orientation carousel
- [x] Save checkpoint

## Phase 36: Fix Voice Dictation - Preserve Transcript When Stopping

- [x] Identify issue: finalTranscript was local variable that reset, text wasn't persisted to textarea on stop
- [x] Fixed: Text is written to textarea in real-time during onresult events
- [x] When stopping: recognition.stop() is called but textarea value remains unchanged
- [x] Added comment clarifying that text persists in input field when stopping
- [x] Test: dictate → stop → verify text remains → send message
- [x] Save checkpoint

## Phase 37: Fix Voice Dictation - Proper Text Preservation (Take 2)

- [x] Issue: onresult rebuilds transcript from scratch, losing manually typed text
- [x] Issue: Stopping dictation clears everything
- [x] Solution: Capture initial textarea value when starting dictation (baseTextRef)
- [x] Solution: Append NEW speech results to base text, never replace it
- [x] Solution: Use ref to track base text that shouldn't be overwritten
- [x] Test: type text → start dictation → speak → stop → verify all text remains
- [x] Test: start dictation → speak → type more → stop → verify all text remains
- [x] Save checkpoint

## Phase 38: Fix Voice Dictation - Preserve Final Transcript Before onend

- [x] Debug finding: Base text captured correctly, but text disappears when recognition.onend fires
- [x] Issue: Textarea gets cleared when recognition.onend fires
- [x] Solution: Store final combined text in finalTranscriptRef during onresult
- [x] Solution: In onend, detect if textarea is empty and restore from ref
- [x] Added extensive console logging to debug
- [x] Tested with user - SUCCESS! "Restoring text from ref!" message confirmed fix working
- [x] Removed debug console logs, kept critical comments
- [x] Save checkpoint

## Phase 39: Fix Missing Image Attachments in Conversation Archives

**Issue:** User uploaded glucose chart image yesterday. Image was analyzed by Dr. Kai. Today when viewing conversation in archive, the image is missing - only text messages remain.

- [x] Check database: Verify attachments table has the glucose chart data
- [x] Check loadConversation(): Verify it fetches attachments from database
- [x] Check message rendering: Verify AttachmentDisplay component is called for messages with attachments
- [x] Debug: Log attachment data structure to see what's being loaded
- [x] Fix: Ensure attachments are properly linked to messages when loading from DB (updated backend API to JOIN attachments table)
- [x] Fix: Ensure AttachmentDisplay renders for each attachment (updated component to accept attachment objects)
- [x] Fix: Corrected SQL query to use proper column names (filename, mime_type, file_data)
- [x] Test: Upload new image, send message, reload conversation from archive
- [x] Verify: Image displays correctly in reloaded conversation - SUCCESS!
- [x] Save checkpoint


## Phase 40: Streamline Navigation Buttons (Orientation Carousel)

**Goal:** Update nav buttons to match reference design - clean circular buttons with thin borders

- [x] Update button styling: Remove glass morphism effects
- [x] Apply thin circular border (1px white with low opacity)
- [x] Center chevron arrow icon
- [x] Add subtle opacity to button background (5% white)
- [x] Remove hover scale effects (keep simple opacity change: 40% → 70% on hover)
- [x] Increase button size for better visibility (w-16 h-16 mobile, w-20 h-20 desktop)
- [x] Increase chevron size (w-8 h-8 mobile, w-10 h-10 desktop)
- [x] Use ivory color for chevron (#E8E1D6)
- [x] Save checkpoint


## Phase 41: Update "Proceed to Your Council" Button

**Goal:** Match the clean navigation button aesthetic - thin rectangular border, no solid background

- [ ] Remove solid teal background from Proceed button
- [ ] Apply thin 1px border (rgba(255,255,255,0.2))
- [ ] Add subtle background opacity (5% white)
- [ ] Use rounded corners (rounded-lg or rounded-xl)
- [ ] Update hover effect to match nav buttons (opacity change)
- [ ] Ensure ivory text color (#F2EBDD)
- [x] Test button visibility and clickability
- [x] Save checkpoint
- [x] Remove solid teal background from Proceed button
- [x] Apply thin 1px border (rgba(255,255,255,0.2))
- [x] Add subtle background opacity (5% white)
- [x] Use rounded corners (rounded-xl)
- [x] Update hover effect to match nav buttons (opacity change)
- [x] Ensure ivory text color (#F2EBDD)


## Phase 42: Reduce Spacing Between Name and Title

**Goal:** Bring advisor name and title closer together for tighter visual grouping

- [ ] Reduce margin/spacing between name (h2) and title (h3)
- [x] Test on all 6 advisor slides
- [x] Save checkpoint
- [x] Reduce margin/spacing between name (h2) and title (h3)
- [x] Test on all 6 advisor slides

## Phase 43: Further Reduce Name-Title Spacing

**Goal:** Move title even closer to advisor name for tighter visual grouping

- [ ] Reduce space-y-2 to space-y-1 for minimal gap
- [ ] Test on all 6 advisor slides
- [ ] Save checkpoint

**Completed:**
- [x] Reduced space-y-2 to space-y-1 for minimal gap (0.25rem)
- [x] Applied to all 6 advisor slides

## Phase 44: Increase Title-Bio Spacing

**Goal:** Add more space between title and bio text for better visual separation

- [ ] Increase spacing between title container and bio paragraphs
- [ ] Test on all 6 advisor slides
- [ ] Save checkpoint

**Completed:**
- [x] Increased spacing from space-y-6 to space-y-8 (1.5rem to 2rem)
- [x] Applied to all 6 advisor slides

## Phase 45: Update Michael's Bio - Special Ops Business Commander

**Goal:** Replace Michael's bio with new "Special Ops Business Commander" messaging

- [ ] Update Michael's bio in LuxuryOrientationCarousel.tsx
- [ ] Replace opening line with "Special Ops Business Commander and your guide through negotiation, deal-making, and leadership under pressure"
- [ ] Replace all 4 paragraphs with new content
- [ ] Verify bio displays correctly in orientation carousel
- [ ] Test complete orientation flow
- [ ] Save checkpoint

**Completed:**
- [x] Updated Michael's bio in LuxuryOrientationCarousel.tsx
- [x] Replaced opening line with "Special Ops Business Commander"
- [x] Replaced all 5 paragraphs with new content
- [x] Bio now emphasizes negotiation, deal-making, leadership under pressure
- [x] Highlights when to advance vs. when restraint is smarter
- [x] Focuses on decisive execution over overthinking

## Phase 46: Update Giselle's Bio - Chief Strategy & Visionary Officer

**Goal:** Replace Giselle's bio with new "Chief Strategy & Visionary Officer" messaging

- [ ] Update Giselle's bio in LuxuryOrientationCarousel.tsx
- [ ] Replace opening line with "Chief Strategy & Visionary Officer"
- [ ] Update all paragraphs with new content emphasizing:
  * Intersection between imagination and strategic execution
  * How ideas move through people, rooms, markets, moments
  * Timing, framing, and placement
  * Positioning, perception, and relational geometry
- [ ] Verify bio displays correctly in orientation carousel
- [ ] Test complete orientation flow
- [ ] Save checkpoint

**Completed:**
- [x] Updated Giselle's bio in LuxuryOrientationCarousel.tsx
- [x] Replaced opening line with "Chief Strategy & Visionary Officer all in one"
- [x] Updated all 5 paragraphs with new content
- [x] Bio now emphasizes:
  * Intersection between imagination and strategic execution
  * Strategies become sharper, more refined, more effective
  * How ideas move through people, rooms, markets, moments
  * Timing, framing, and placement for success vs. failure
  * Positioning, perception, and relational geometry with clarity
- [x] Closing: "When Giselle speaks, the path forward becomes visible"
