<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    type Props = HTMLAttributes<HTMLDivElement> & {
        children?: Snippet;
    };

    let { children, class: className, ...rest }: Props = $props();
</script>

<div {...rest} class="vn-app {className ?? ''}">
    {@render children?.()}
</div>

<style>
    .vn-app {
        box-sizing: border-box;
        position: fixed;
        inset: 0;
        display: flex;
        flex-direction: column;
        min-height: var(--vn-app-min-height, 0);
        overflow: var(--vn-app-overflow, hidden);
        overscroll-behavior: var(--vn-app-overscroll-behavior, none);
        padding: var(--vn-app-padding, 0);
        background-color: var(--vn-bg);
        color: var(--vn-font-color);
        font-family: var(--vn-font);
    }
</style>
