<script lang="ts" module>
  // Open dialogs are tracked per document so only the topmost one reacts to
  // Escape and pulls escaped focus back inside. Without this, stacked dialogs
  // would all close at once and fight over focus.
  const dialogStacks = new WeakMap<Document, symbol[]>();

  function pushDialog(doc: Document, token: symbol) {
    const stack = dialogStacks.get(doc);
    if (stack) stack.push(token);
    else dialogStacks.set(doc, [token]);
  }

  function popDialog(doc: Document, token: symbol): boolean {
    const stack = dialogStacks.get(doc);
    if (!stack) return false;
    const index = stack.lastIndexOf(token);
    const wasTop = index === stack.length - 1;
    if (index !== -1) stack.splice(index, 1);
    if (!stack.length) dialogStacks.delete(doc);
    return wasTop;
  }

  function isTopDialog(doc: Document, token: symbol): boolean {
    const stack = dialogStacks.get(doc);
    return stack?.[stack.length - 1] === token;
  }

  // Scroll locking is reference-counted, so closing an inner dialog doesn't
  // unlock the page while an outer dialog is still open.
  const scrollLocks = new WeakMap<Document, { count: number; overflow: string }>();

  function lockScroll(doc: Document): () => void {
    const body = doc.body;
    let lock = scrollLocks.get(doc);
    if (!lock) {
      lock = { count: 0, overflow: body.style.overflow };
      scrollLocks.set(doc, lock);
    }
    lock.count += 1;
    body.style.overflow = 'hidden';

    return () => {
      const current = scrollLocks.get(doc);
      if (!current) return;
      current.count -= 1;
      if (current.count > 0) return;
      body.style.overflow = current.overflow;
      scrollLocks.delete(doc);
    };
  }
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';

  type Side = 'center' | 'left' | 'right' | 'top' | 'bottom';

  interface Props {
    open?: boolean;
    variant?: 'default' | 'fullscreen';
    /** `center` (default) dialog, or a sheet that slides in from an edge. */
    side?: Side;
    /** Stable id for the dialog panel, so a trigger can point `aria-controls` at it. */
    id?: string;
    /** Accessible name for dialogs that don't render a `heading` snippet. */
    label?: string;
    heading?: Snippet;
    children?: Snippet;
    footer?: Snippet;
    onclose?: () => void;
  }

  let {
    open = $bindable(false),
    variant = 'default',
    side = 'center',
    id,
    label,
    heading,
    children,
    footer,
    onclose
  }: Props = $props();

  const uid = $props.id();
  const panelId = $derived(id ?? `${uid}-panel`);
  const headingId = `${uid}-heading`;

  let overlayEl: HTMLDivElement | undefined = $state();
  let panelEl: HTMLDivElement | undefined = $state();

  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function close() {
    if (!open) return;
    open = false;
    onclose?.();
  }

  /** Focusable descendants that are actually visible. */
  function focusable(): HTMLElement[] {
    if (!panelEl) return [];
    const active = panelEl.ownerDocument.activeElement;
    return Array.from(panelEl.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === active
    );
  }

  /** Parse a CSS time token (`120ms`, `0.12s`, `120`) into milliseconds. */
  function cssTime(value: string): number | null {
    const match = /^(-?(?:\d+|\d*\.\d+))(ms|s)?$/i.exec(value.trim());
    if (!match) return null;
    const amount = Number.parseFloat(match[1]);
    if (!Number.isFinite(amount)) return null;
    return match[2]?.toLowerCase() === 's' ? amount * 1000 : amount;
  }

  /**
   * Motion length from --vn-dur, so the JS transitions honour the same token.
   * Returns 0 when the user prefers reduced motion.
   */
  function motionDuration(node: Element, fallback: number): number {
    const view = node.ownerDocument?.defaultView;
    if (!view) return fallback;
    if (view.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 0;
    const value = cssTime(view.getComputedStyle(node).getPropertyValue('--vn-dur'));
    return value !== null && value >= 0 ? value : fallback;
  }

  function overlayTransition(node: Element) {
    return fade(node, { duration: motionDuration(node, 200) });
  }

  // Edge sheets slide in from their edge; the centered dialog keeps the subtle scale.
  function panelTransition(node: Element, params: { side: Side }) {
    const duration = motionDuration(node, 220);
    switch (params.side) {
      case 'left':
        return fly(node, { x: '-100%', duration });
      case 'right':
        return fly(node, { x: '100%', duration });
      case 'top':
        return fly(node, { y: '-100%', duration });
      case 'bottom':
        return fly(node, { y: '100%', duration });
      default:
        return scale(node, { duration, start: 0.97 });
    }
  }

  // Only close when the press itself started on the backdrop: a drag that begins
  // in the panel and releases over the backdrop must not dismiss the dialog.
  let pressedOnBackdrop = false;

  // Background content is made inert while the dialog is open so the focus trap
  // matches what assistive tech can reach.
  let inerted: HTMLElement[] = [];
  function inertBackground(overlay: HTMLElement, active: boolean) {
    if (!active) {
      for (const el of inerted) el.removeAttribute('inert');
      inerted = [];
      return;
    }
    const body = overlay.ownerDocument.body;
    const marked: HTMLElement[] = [];
    let node: HTMLElement | null = overlay;
    while (node && node !== body) {
      const parent: HTMLElement | null = node.parentElement;
      if (!parent) break;
      for (const child of Array.from(parent.children)) {
        const el = child as HTMLElement;
        if (el === node || el.hasAttribute('inert')) continue;
        el.setAttribute('inert', '');
        marked.push(el);
      }
      node = parent;
    }
    inerted = marked;
  }

  // The open "session": focus trap, Escape handling, scroll lock, background
  // inert, and focus restore. The effect below owns its lifetime, so a close
  // (or unmount) always tears the session down exactly once.
  function startSession(overlay: HTMLElement): () => void {
    return untrack(() => {
      const doc = overlay.ownerDocument;
      const win = doc.defaultView;
      if (!win) return () => {};

      const token = Symbol('vn-modal');
      pushDialog(doc, token);

      const previouslyFocused = doc.activeElement instanceof HTMLElement ? doc.activeElement : null;
      const unlockScroll = lockScroll(doc);

      const items = focusable();
      const target = items.find((el) => !el.matches('input, select, textarea')) ?? panelEl;
      target?.focus();

      inertBackground(overlay, true);

      const onKeydown = (event: KeyboardEvent) => {
        if (!isTopDialog(doc, token)) return;
        if (event.defaultPrevented || event.isComposing) return;

        if (event.key === 'Escape') {
          event.preventDefault();
          close();
          return;
        }
        if (event.key !== 'Tab' || !panelEl) return;

        const focusableEls = focusable();
        if (!focusableEls.length) {
          event.preventDefault();
          panelEl.focus();
          return;
        }
        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];
        const active = doc.activeElement;
        if (event.shiftKey && (active === first || active === panelEl)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (active === last || active === panelEl)) {
          event.preventDefault();
          first.focus();
        }
      };

      // Focus can still leave the panel through a mouse press on the backdrop
      // (or an element outside the dialog). Pull it back while this dialog is
      // the topmost one.
      const onFocusIn = (event: FocusEvent) => {
        if (!panelEl || !isTopDialog(doc, token)) return;
        const target = event.target as Node | null;
        if (target && panelEl.contains(target)) return;
        panelEl.focus();
      };

      win.addEventListener('keydown', onKeydown);
      doc.addEventListener('focusin', onFocusIn);

      return () => {
        win.removeEventListener('keydown', onKeydown);
        doc.removeEventListener('focusin', onFocusIn);
        const wasTop = popDialog(doc, token);
        unlockScroll();
        inertBackground(overlay, false);
        // Don't steal focus if an outer dialog is now the top layer: it owns
        // where focus should go.
        if (wasTop && previouslyFocused?.isConnected) previouslyFocused.focus();
      };
    });
  }

  $effect(() => {
    const overlay = overlayEl;
    if (!open || !overlay) return;
    return startSession(overlay);
  });
</script>

{#if open}
  <div
    class="vn-modal-overlay vn-modal-overlay-{side}"
    bind:this={overlayEl}
    transition:overlayTransition
  >
    <!-- A real button, behind the panel, rather than a click handler on the
         overlay wrapper: clicking outside closes, without nesting the dialog in
         an interactive element. -->
    <button
      type="button"
      class="vn-modal-backdrop"
      aria-label="Close"
      tabindex="-1"
      onmousedown={(e) => e.preventDefault()}
      onpointerdown={(e) => {
        if (e.target === e.currentTarget) pressedOnBackdrop = true;
      }}
      onclick={(e) => {
        if (pressedOnBackdrop && e.target === e.currentTarget) close();
        pressedOnBackdrop = false;
      }}
    ></button>

    <div
      class="vn-modal vn-modal-{side} {variant === 'fullscreen' ? 'vn-modal-full' : ''}"
      bind:this={panelEl}
      transition:panelTransition={{ side }}
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={heading ? headingId : undefined}
      aria-label={heading ? undefined : label}
      tabindex="-1"
    >
      {#if heading}
        <div class="vn-modal-heading" id={headingId}>{@render heading()}</div>
      {/if}
      <div class="vn-modal-body">{@render children?.()}</div>
      {#if footer}
        <div class="vn-modal-footer">{@render footer()}</div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .vn-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vn-modal-overlay, rgb(0 0 0 / 55%));
  }

  .vn-modal-overlay-left {
    align-items: stretch;
    justify-content: flex-start;
  }

  .vn-modal-overlay-right {
    align-items: stretch;
    justify-content: flex-end;
  }

  .vn-modal-overlay-top {
    align-items: flex-start;
    justify-content: center;
  }

  .vn-modal-overlay-bottom {
    align-items: flex-end;
    justify-content: center;
  }

  .vn-modal-backdrop {
    position: absolute;
    inset: 0;
    z-index: 0;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    cursor: default;
  }

  .vn-modal {
    position: relative;
    z-index: 1;
    width: min(480px, calc(100% - 32px));
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--vn-bg-tint);
    color: var(--vn-font-color);
    border-radius: var(--vn-radius-med);
    box-shadow: 0 16px 40px rgb(0 0 0 / 45%);
  }

  /* Side sheets: full height, anchored to their edge. */
  .vn-modal-left,
  .vn-modal-right {
    width: min(360px, 85vw);
    height: 100%;
    max-height: 100vh;
  }

  .vn-modal-left {
    border-radius: 0 var(--vn-radius-med) var(--vn-radius-med) 0;
  }

  .vn-modal-right {
    border-radius: var(--vn-radius-med) 0 0 var(--vn-radius-med);
  }

  /* Edge sheets: full width, anchored to the top/bottom edge, tall enough to
     scroll long menus before they grow off screen. */
  .vn-modal-bottom {
    width: 100%;
    max-width: 560px;
    max-height: 85vh;
    border-radius: var(--vn-radius-high) var(--vn-radius-high) 0 0;
  }

  .vn-modal-top {
    width: 100%;
    max-width: 560px;
    max-height: 85vh;
    border-radius: 0 0 var(--vn-radius-high) var(--vn-radius-high);
  }

  .vn-modal-heading {
    padding: 20px 24px 12px;
    font-size: 18px;
    font-weight: 700;
    border-bottom: 1px solid color-mix(in srgb, var(--vn-font-color) 12%, transparent);
  }

  .vn-modal-body {
    padding: 20px 24px;
    overflow-y: auto;
    overscroll-behavior: contain;
    font-size: 14px;
    line-height: 1.5;
  }

  /* With a heading, its divider is the midpoint: 12px above and below. */
  .vn-modal-heading + .vn-modal-body {
    padding-top: 12px;
  }

  .vn-modal-footer {
    display: flex;
    align-items: stretch;
    /* a hairline seam between adjacent buttons */
    gap: 1px;
    padding: 0;
    border-top: 1px solid color-mix(in srgb, var(--vn-font-color) 12%, transparent);
    flex-shrink: 0;
  }

  /*
   * Footer buttons fill the modal edge-to-edge, sharing the width equally.
   * Scoped to direct children so non-button controls are untouched. The
   * `.vn-modal-footer` prefix outranks Button's own border-radius; a consumer
   * can still opt an individual control out with an equally specific selector.
   */
  .vn-modal-footer > :global(.vn-button) {
    flex: 1 1 0;
    margin: 0;
    border-radius: 0;
  }

  /* Fullscreen wins over any edge sizing (declared last so it overrides). */
  .vn-modal-full {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    border-radius: 0;
    background: var(--vn-bg-tint);
  }
</style>
