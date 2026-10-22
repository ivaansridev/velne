<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';

    type Props = HTMLButtonAttributes & {
        variant?: 'solid' | 'simple' | 'tonal' | 'outlined';
        children?: Snippet;
    };

    let { variant = 'simple', children, class: className, ...rest }: Props = $props();
</script>

<button {...rest} class="vn-button vn-button--{variant} {className ?? ''}">
    {@render children?.()}
</button>

<style>
    .vn-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--vn-button-width, fit-content);
        max-width: var(--vn-button-max-width, 100%);
        gap: var(--vn-button-gap, 0.5em);
        padding: var(--vn-button-padding, 0.25em 0.5em);
        border: var(--vn-button-border, 1px solid transparent);
        border-radius: var(--vn-radius);
        background: var(--vn-button-bg, transparent);
        color: inherit;
        font: inherit;
        font-family: var(--vn-button-font-family, var(--vn-font));
        line-height: var(--vn-button-line-height, 1.2);
        cursor: pointer;
        transition:
            background-color var(--vn-button-duration, 120ms) ease,
            border-color var(--vn-button-duration, 120ms) ease;
    }

    .vn-button:focus-visible {
        outline: var(--vn-button-focus-outline, 2px solid currentColor);
        outline-offset: var(--vn-button-focus-outline-offset, 2px);
    }

    .vn-button:disabled {
        cursor: not-allowed;
        opacity: var(--vn-button-disabled-opacity, 0.5);
    }

    .vn-button--simple:hover:not(:disabled) {
        background: var(
            --vn-button-simple-hover-bg,
            color-mix(in srgb, currentColor 8%, transparent)
        );
    }

    .vn-button--simple:active:not(:disabled) {
        background: var(
            --vn-button-simple-active-bg,
            color-mix(in srgb, currentColor 14%, transparent)
        );
    }

    .vn-button--solid {
        background: var(--vn-accent);
        color: var(--vn-accent-font-color);
    }

    .vn-button--solid:hover:not(:disabled) {
        background: var(
            --vn-button-solid-hover-bg,
            color-mix(in srgb, var(--vn-accent) 90%, var(--vn-accent-font-color))
        );
    }

    .vn-button--solid:active:not(:disabled) {
        background: var(
            --vn-button-solid-active-bg,
            color-mix(in srgb, var(--vn-accent) 80%, var(--vn-accent-font-color))
        );
    }

    .vn-button--tonal {
        background: var(
            --vn-button-tonal-bg,
            color-mix(in srgb, var(--vn-accent) 15%, transparent)
        );
        color: var(--vn-accent);
    }

    .vn-button--tonal:hover:not(:disabled) {
        background: var(
            --vn-button-tonal-hover-bg,
            color-mix(in srgb, var(--vn-accent) 22%, transparent)
        );
    }

    .vn-button--tonal:active:not(:disabled) {
        background: var(
            --vn-button-tonal-active-bg,
            color-mix(in srgb, var(--vn-accent) 30%, transparent)
        );
    }

    .vn-button--outlined {
        border-color: var(
            --vn-button-outlined-border-color,
            color-mix(in srgb, var(--vn-accent) 50%, transparent)
        );
        color: var(--vn-accent);
    }

    .vn-button--outlined:hover:not(:disabled) {
        background: var(
            --vn-button-outlined-hover-bg,
            color-mix(in srgb, var(--vn-accent) 8%, transparent)
        );
        border-color: var(--vn-accent);
    }

    .vn-button--outlined:active:not(:disabled) {
        background: var(
            --vn-button-outlined-active-bg,
            color-mix(in srgb, var(--vn-accent) 14%, transparent)
        );
    }
</style>
