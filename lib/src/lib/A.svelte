<script lang="ts">
    import './button.css';
    import ExternalLink from '@lucide/svelte/icons/external-link';
    import type { HTMLAnchorAttributes } from 'svelte/elements';
    import type { Snippet } from 'svelte';

    interface Props extends HTMLAnchorAttributes {
        variant?:
            'link' | 'accent-link' | 'btn-solid' | 'btn-tonal' | 'btn-outlined' | 'btn-simple';
        children?: Snippet;
    }

    let { variant = 'link', class: className = '', children, ...rest }: Props = $props();

    let isButton = $derived(variant.startsWith('btn-'));
    let btnClass = $derived(
        isButton
            ? `vn-button vn-button--${variant.replace('btn-', '')}`
            : variant === 'accent-link'
              ? 'vn-hl vn-hl-accent'
              : 'vn-hl',
    );
</script>

<!-- Button variants share button.css with <vn.Button>. -->
<a class="{btnClass} {className}" {...rest}>
    {@render children?.()}
    {#if isButton}
        <span class="vn-a-icon" aria-hidden="true">
            <ExternalLink size="1em" strokeWidth={2} />
        </span>
    {/if}
</a>

<style>
    .vn-hl {
        color: inherit;
        font-family: var(--vn-a-font-family, var(--vn-font));
        border-bottom: var(--vn-a-border-bottom, 1.5px solid transparent);
        background-image: var(
            --vn-a-background-image,
            repeating-linear-gradient(
                to right,
                color-mix(in srgb, var(--vn-font-color) 40%, transparent) 0px,
                color-mix(in srgb, var(--vn-font-color) 40%, transparent) 4px,
                transparent 4px,
                transparent 8px
            )
        );
        background-size: var(--vn-a-background-size, 100% 1.5px);
        background-position: var(--vn-a-background-position, 0 100%);
        background-repeat: repeat-x;
        text-decoration: none;
        transition:
            color var(--vn-a-duration, 120ms) ease,
            background-image var(--vn-a-duration, 120ms) ease,
            border-bottom-color var(--vn-a-duration, 120ms) ease;
    }

    .vn-hl:hover {
        color: var(--vn-accent);
        background-image: none;
        border-bottom-color: var(--vn-accent);
    }

    .vn-hl-accent {
        color: var(--vn-accent);
    }

    .vn-hl-accent:hover {
        color: var(--vn-accent);
        filter: var(--vn-a-accent-hover-filter, brightness(1.15));
    }

    .vn-a-icon {
        display: inline-flex;
        flex: none;
    }
</style>
