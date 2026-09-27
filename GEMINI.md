# Agent Guidelines & UI/UX Standards

## Mandatory UI/UX Guideline
Whenever designing, building, modifying, styling, or reviewing UI or working on any frontend task in this project:
- **ALWAYS activate and follow the `ui-ux-pro-max` skill** located at [`.agents/skills/ui-ux-pro-max/SKILL.md`](.agents/skills/ui-ux-pro-max/SKILL.md).
- Adhere to the design intelligence workflows, design systems, and UI reasoning contracts provided by the skill.

### Tech Stack
- **Framework**: Next.js 14 (App Router) + React 18
- **Styling**: Tailwind CSS (`clsx`, `tailwind-merge`)
- **Icons**: `lucide-react` (SVG icons only; never use raw emojis as UI icons)
- **Backend / Auth**: Supabase

### Execution & Verification Workflow
1. **Query UI Guidance**: Use the local search tool to guide component structure, typography, colors, and layout:
   ```bash
   python .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <ux|style|color|typography|icons|chart|landing>
   # Or for stack-specific guidance:
   python .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack nextjs
   python .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack html-tailwind
   ```
2. **Design System & New Pages**:
   - Use `--design-system` when designing new pages or components needing coherent aesthetic direction.
3. **Key Quality & Usability Rules**:
   - **Accessibility (CRITICAL)**: Contrast ratio >= 4.5:1, keyboard focusable, distinct focus states, aria-labels on icon buttons, real `<label>` tags for form inputs.
   - **Touch & Interaction (CRITICAL)**: Minimum target size 44x44px for click/tap targets, instant feedback on click, disabled/loading states during submissions.
   - **Layout & Responsiveness (HIGH)**: Mobile-first layout, viewport safety, avoid unintended horizontal scroll, avoid fixed-width breaking mobile containers.
   - **Typography & Color Hierarchy (MEDIUM)**: Clear scale, semantic tokens, avoid raw unmapped hex values where theme classes exist.
   - **Forms & Feedback (MEDIUM)**: Inline error messages placed near the offending input, clear submission indicators.
