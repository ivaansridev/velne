<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    type Props = HTMLAttributes<HTMLElement> & {
        blur?: boolean;
        /** `fixed` overlays content; `sticky` keeps it in flow and pins it on scroll. */
        position?: 'fixed' | 'sticky' | 'static';
        children?: Snippet;
        right?: Snippet;
    };

    let {
        blur = false,
        position = 'fixed',
        children,
        right,
        class: className,
        ...rest
    }: Props = $props();
</script>

<nav {...rest} class="vn-nav vn-nav-{position} {className ?? ''}" class:vn-nav-blur={blur}>
    <div class="vn-nav-left">
        {@render children?.()}
    </div>
    {#if right}
        <div class="vn-nav-right">
            {@render right()}
        </div>
    {/if}
</nav>

<style>
    .vn-nav {
        box-sizing: border-box;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--vn-navbar-gap, 16px);
        height: var(--vn-navbar-height, 40px);
        padding: var(--vn-navbar-padding, 0 20px);
        background: var(--vn-navbar-bg, var(--vn-bg-tint));
        border-bottom: var(--vn-navbar-border-width, 1px) solid
            color-mix(in srgb, var(--vn-font-color) 10%, transparent);
        color: var(--vn-font-color);
        font-family: var(--vn-navbar-font-family, var(--vn-font));
    }

    .vn-nav-sticky {
        position: sticky;
        margin-bottom: var(--vn-navbar-sticky-bottom-margin, 16px);
    }

    .vn-nav-static {
        position: static;
    }

    .vn-nav-blur {
        background: var(--vn-navbar-blur-bg, transparent);
        border-bottom: var(--vn-navbar-blur-border-width, 1px) solid
            color-mix(in srgb, var(--vn-font-color) 8%, transparent);
    }

    /* The blur lives on a pseudo-element: putting backdrop-filter on the nav
     itself would make it a containing block for position:fixed descendants,
     which would trap the Tooltip and the StackMenu's Modal inside the navbar. */
    .vn-nav-blur::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        background: color-mix(in srgb, var(--vn-navbar-bg, var(--vn-bg-tint)) 70%, transparent);
        backdrop-filter: blur(14px) saturate(140%);
        -webkit-backdrop-filter: blur(14px) saturate(140%);
    }

    .vn-nav-left,
    .vn-nav-right {
        display: flex;
        align-items: center;
    }

    /* let the brand area shrink so the right side is never pushed out */
    .vn-nav-left {
        flex: 1 1 auto;
        gap: var(--vn-navbar-left-gap, 16px);
        min-width: var(--vn-navbar-left-min-width, 0);
    }

    .vn-nav-right {
        flex: 0 0 auto;
        gap: var(--vn-navbar-right-gap, 16px);
    }

    /* headings keep the bar's height: sized down, single line, ellipsis on overflow */
    .vn-nav :global(h1),
    .vn-nav :global(h2),
    .vn-nav :global(h3),
    .vn-nav :global(h4),
    .vn-nav :global(h5),
    .vn-nav :global(h6) {
        margin: var(--vn-navbar-title-margin, 0);
        min-width: var(--vn-navbar-title-min-width, 0);
        max-width: var(--vn-navbar-title-max-width, 100%);
        font-size: var(--vn-navbar-title-size, clamp(15px, 1.1rem + 0.35vw, 19px));
        font-weight: var(--vn-navbar-title-weight, 700);
        line-height: var(--vn-navbar-title-line-height, 1.2);
        letter-spacing: var(--vn-navbar-title-letter-spacing, -0.01em);
        white-space: var(--vn-navbar-title-white-space, nowrap);
        overflow: var(--vn-navbar-title-overflow, hidden);
        text-overflow: var(--vn-navbar-title-text-overflow, ellipsis);
    }
</style>
