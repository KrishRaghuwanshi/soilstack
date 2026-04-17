/**
 * SoilStack Design Tokens — "TerraForge Industrial"
 * Generated via Google Stitch with Gemini 3.1 Pro
 * Earthy-industrial dark theme with tonal depth layering
 */

export const Colors = {
  // Surface Hierarchy (Tonal Depth — no-line rule)
  bg: '#0B160E',              // Level 0: Foundation (base earth)
  surface: '#131E16',         // Level 1: Sections (broad content areas)
  card: '#212D24',            // Level 2: Interaction (cards & modals)
  cardHover: '#2C382E',       // Level 3: Focus (active states)
  recessed: '#061009',        // Recessed inputs (carved into the UI)

  // Borders — Ghost borders only (15% opacity)
  border: 'rgba(61,74,62,0.5)',     // outline_variant based
  borderFocus: '#6BFB9A',
  borderSubtle: 'rgba(61,74,62,0.25)',

  // Accents
  primary: '#4ADE80',         // Living Green — primary actions
  primaryBright: '#6BFB9A',   // Bright green for highlights
  primaryMuted: '#4ADE8066',
  primaryBg: 'rgba(74,222,128,0.15)',
  secondary: '#FFC640',       // Harvest Gold — warnings/pending
  secondaryBg: 'rgba(255,198,64,0.15)',
  tertiary: '#9FC6FF',        // Sky Mist — info/links
  tertiaryBg: 'rgba(159,198,255,0.15)',
  destructive: '#FFB4AB',
  destructiveBg: 'rgba(255,180,171,0.15)',

  // Text
  text: '#D9E6D9',            // on_background
  textSecondary: '#BCCABB',   // on_surface_variant
  textTertiary: '#869486',    // outline (sage)
  textOnPrimary: '#003919',   // on_primary (dark green)
  textMuted: 'rgba(217,230,217,0.5)',

  // Status
  statusDraft: '#869486',
  statusSubmitted: '#9FC6FF',
  statusAiChecked: '#9FC6FF',
  statusSatellitePending: '#FFC640',
  statusValidatorPending: '#FFC640',
  statusVerified: '#4ADE80',
  statusMinted: '#6BFB9A',
  statusPaid: '#4DE082',
  statusRejected: '#FFB4AB',

  // Chart
  chartLine: '#4DE082',
  chartFill: 'rgba(77,224,130,0.2)',
  chartGrid: 'rgba(255,255,255,0.05)',

  // Tab bar
  tabActive: '#6BFB9A',
  tabInactive: 'rgba(188,202,187,0.4)',
} as const;

export const Fonts = {
  display: 'SpaceGrotesk_700Bold',
  heading: 'SpaceGrotesk_700Bold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemiBold: 'DMSans_600SemiBold',
  bodyBold: 'DMSans_700Bold',
  mono: 'JetBrainsMono_400Regular',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 10,    // Buttons, inputs
  lg: 12,    // Cards, containers
  xl: 16,
  pill: 9999, // Status badges only
} as const;

export const Sizes = {
  buttonHeight: 52,
  inputHeight: 52,
  tabBarHeight: 80,
  iconSm: 18,
  iconMd: 22,
  iconLg: 28,
} as const;

export const StatusConfig: Record<string, { color: string; bg: string; label: string }> = {
  draft: { color: Colors.statusDraft, bg: 'rgba(134,148,134,0.15)', label: 'Draft' },
  submitted: { color: Colors.statusSubmitted, bg: Colors.tertiaryBg, label: 'Submitted' },
  ai_checked: { color: Colors.statusAiChecked, bg: Colors.tertiaryBg, label: 'AI Checked' },
  satellite_pending: { color: Colors.statusSatellitePending, bg: Colors.secondaryBg, label: 'Satellite' },
  validator_pending: { color: Colors.statusValidatorPending, bg: Colors.secondaryBg, label: 'Pending' },
  verified: { color: Colors.statusVerified, bg: Colors.primaryBg, label: 'Verified' },
  minted: { color: Colors.statusMinted, bg: Colors.primaryBg, label: 'Minted' },
  paid: { color: Colors.statusPaid, bg: 'rgba(77,224,130,0.15)', label: 'Paid' },
  rejected: { color: Colors.statusRejected, bg: Colors.destructiveBg, label: 'Rejected' },
};
