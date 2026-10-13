// Interactive headphone showcase — editable content.
// Coordinates are pixels of the original 1254×1254 reference artwork (the plate is cropped from y=62, 1254×898, plus the side padding).
//  anchor : the exact component the callout line points to
//  focus  : where the camera frames while the feature is shown
//  size   : approx. height (px) of the region to keep in frame — drives the zoom level
//  side   : which side of the screen the description card sits on (the product is framed on the opposite side)
// Only features that are visible on the product are listed; no specifications are claimed.
// the plate image adds `padX` px of plain backdrop either side so it can fill any stage width
export const PLATE = { w: 1254, h: 898, top: 62, padX: 380 }

export const FEATURES = [
  { id: 'cushions', title: 'Soft-touch ear cushions',
    body: 'Soft, padded cushions with a soft-touch finish, shaped for comfortable, all-day listening.',
    anchor: [402, 545], focus: [440, 640], size: 340, side: 'R', marker: [402, 545] },
  { id: 'headband', title: 'Adjustable headband',
    body: 'A height-adjustable band with a metal slider, so the fit can be set to suit your head.',
    anchor: [900, 398], focus: [850, 365], size: 200, side: 'L', marker: [900, 398] },
  { id: 'controls', title: 'Physical controls',
    body: 'Tactile buttons on the ear cup for volume and playback, without reaching for your phone.',
    anchor: [660, 690], focus: [690, 720], size: 230, side: 'R', marker: [660, 690] },
  { id: 'wireless', title: 'Wireless connectivity',
    body: 'Wireless listening, so there is no cable between you and the music.',
    anchor: [840, 610], focus: [790, 570], size: 330, side: 'L', marker: [840, 610] },
  { id: 'microphone', title: 'Built-in microphone',
    body: 'Microphone openings beside the controls, for taking calls.',
    anchor: [689, 748], focus: [676, 770], size: 150, side: 'R', marker: [689, 748] },
  { id: 'charging', title: 'Charging port',
    body: 'A charging port on the ear cup keeps the headphones ready to go.',
    anchor: [662, 812], focus: [672, 800], size: 150, side: 'L', marker: [662, 812] },
  { id: 'materials', title: 'Premium materials',
    body: 'A clean white finish, soft-touch surfaces and polished metal accents.',
    anchor: [855, 650], focus: [830, 600], size: 330, side: 'R', marker: [855, 650] },
]
