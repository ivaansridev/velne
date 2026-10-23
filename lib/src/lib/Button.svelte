<script lang="ts">
    import './button.css';
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
