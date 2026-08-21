import { Platform } from 'react-native';

/**
 * The wireframe's nav links ("Why Us", "Success Stories", "Contact") are
 * plain `<a href="#why-us">` anchors — the browser handles the scroll for
 * free. React Native has no `<a>`/hash-anchor concept at all (native has no
 * URL bar to put a hash in), so a Pressable's `onPress` calls this instead.
 *
 * On web, it reaches past react-native-web into the real DOM
 * (`document.getElementById`) to scroll smoothly to the section — the same
 * outcome as the wireframe's anchor links, just triggered imperatively. On
 * native, section ids don't exist as real views to scroll to, so this is a
 * no-op; the header simply doesn't render these links on native (see
 * `SiteHeader`).
 */
export function scrollToSection(id: string) {
  if (Platform.OS !== 'web') return;

  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
