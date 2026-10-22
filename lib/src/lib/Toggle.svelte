<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    interface Props extends Omit<HTMLInputAttributes, 'type'> {
        checked?: boolean;
    }

    let { checked = $bindable(false), ...rest }: Props = $props();
</script>

<input type="checkbox" class="vn-toggle" bind:checked {...rest} />

<style>
    .vn-toggle {
        appearance: none;
        -webkit-appearance: none;
        position: relative;
        display: inline-block;
        width: var(--vn-toggle-width, 52px);
        height: var(--vn-toggle-height, 32px);
        border-radius: var(--vn-radius);
        background: var(--vn-toggle-bg, color-mix(in srgb, var(--vn-font-color) 30%, transparent));
        border: var(
            --vn-toggle-border,
            2px solid color-mix(in srgb, var(--vn-font-color) 40%, transparent)
        );
        cursor: pointer;
        vertical-align: middle;
        transition:
            background-color var(--vn-toggle-duration, 120ms) ease,
            border-color var(--vn-toggle-duration, 120ms) ease;
    }

    .vn-toggle::before {
        content: '';
        position: absolute;
        top: var(--vn-toggle-knob-top, 50%);
        left: var(--vn-toggle-knob-left, 5px);
        transform: var(--vn-toggle-knob-transform, translateY(-50%));
        width: var(--vn-toggle-knob-width, 16px);
        height: var(--vn-toggle-knob-height, 16px);
        border-radius: var(--vn-radius);
        background: var(--vn-font-color);
        transition:
            left var(--vn-toggle-duration, 120ms) cubic-bezier(0.35, 0, 0.25, 1),
            width var(--vn-toggle-duration, 120ms) ease,
            height var(--vn-toggle-duration, 120ms) ease;
    }

    .vn-toggle:checked {
        background: var(--vn-accent);
        border-color: var(--vn-accent);
    }

    .vn-toggle:checked::before {
        left: var(--vn-toggle-checked-knob-left, 25px);
        width: var(--vn-toggle-checked-knob-width, 20px);
        height: var(--vn-toggle-checked-knob-height, 20px);
        /* colour of the knob when it sits on the accent fill */
        background: var(--vn-accent-font-color, white);
    }

    /* both states squash to the same 25px so the effect is consistent */
    .vn-toggle:active::before {
        width: var(--vn-toggle-active-knob-width, 25px);
    }

    .vn-toggle:checked:active::before {
        left: var(--vn-toggle-checked-active-knob-left, 20px);
        width: var(--vn-toggle-checked-active-knob-width, 25px);
    }

    .vn-toggle:disabled {
        opacity: var(--vn-toggle-disabled-opacity, 0.35);
        cursor: not-allowed;
    }

    .vn-toggle:focus-visible {
        outline: var(
            --vn-toggle-focus-outline,
            3px solid color-mix(in srgb, var(--vn-accent) 40%, transparent)
        );
        outline-offset: var(--vn-toggle-focus-outline-offset, 2px);
    }
</style>
