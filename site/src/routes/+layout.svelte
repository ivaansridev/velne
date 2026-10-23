<script lang="ts">
    import 'velne-lib/tokens.css';
    import type { LayoutProps } from './$types';

    let { children }: LayoutProps = $props();
</script>

<svelte:head>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
</svelte:head>

{@render children()}

<style>
    :global(html),
    :global(body) {
        margin: 0;
        min-height: 100%;
        background: var(--vn-bg);
        color: var(--vn-font-color);
        color-scheme: dark;
        font-family: var(--vn-font);
        -webkit-font-smoothing: antialiased;
    }

    :global(html) {
        scroll-behavior: smooth;
    }

    :global(::selection) {
        background: var(--vn-accent);
        color: var(--vn-bg);
    }

    @media (prefers-reduced-motion: reduce) {
        :global(html) {
            scroll-behavior: auto;
        }
    }
</style>
