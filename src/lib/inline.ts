/**
 * Tiny inline markup for data strings. Exactly two forms, nothing else:
 *   *emphasis*            -> <em>emphasis</em>
 *   [text](https://url)   -> <a href="https://url">text</a>
 * Markdown outputs keep the source as-is (it is valid Markdown). JSON gets plain text.
 */
const LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
const EM = /\*([^*\n]+)\*/g;
const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

export function inlineHtml(text: string): string {
  return text
    .replace(/[&<>"]/g, (c) => ESC[c])
    .replace(LINK, '<a href="$2" rel="noopener">$1</a>')
    .replace(EM, "<em>$1</em>");
}

export function inlinePlain(text: string): string {
  return text.replace(LINK, "$1").replace(EM, "$1");
}
