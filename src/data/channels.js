// Full spec: 5 output formats.
// Orientations drive how each template lays out.
export const CHANNELS = [
  { id: 'ig_feed',  label: 'Instagram Feed',  width: 1080, height: 1080, kind: 'png', orientation: 'square'     },
  { id: 'ig_story', label: 'Instagram Story', width: 1080, height: 1920, kind: 'png', orientation: 'vertical'   },
  { id: 'whatsapp', label: 'WhatsApp',        width: 1080, height: 1920, kind: 'png', orientation: 'vertical'   },
  { id: 'facebook', label: 'Facebook',        width: 1200, height: 630,  kind: 'png', orientation: 'horizontal' },
  { id: 'pdf',      label: 'PDF (Letter)',    width: 816,  height: 1056, kind: 'pdf', orientation: 'vertical'   },
];

export const channelById = (id) => CHANNELS.find(c => c.id === id);
