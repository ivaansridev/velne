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
		width: fit-content;
		max-width: 100%;
		gap: 0.5em;
		padding: 0.25em 0.5em;
		border: 1px solid transparent;
		border-radius: var(--vn-radius);
		background: transparent;
		color: inherit;
		font: inherit;
		line-height: 1.2;
		cursor: pointer;
		transition:
			background-color 120ms ease,
			border-color 120ms ease;
	}

	.vn-button:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	.vn-button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.vn-button--simple:hover:not(:disabled) {
		background: color-mix(in srgb, currentColor 8%, transparent);
	}

	.vn-button--simple:active:not(:disabled) {
		background: color-mix(in srgb, currentColor 14%, transparent);
	}

	.vn-button--solid {
		background: var(--vn-accent);
		color: var(--vn-accent-font-color);
	}

	.vn-button--solid:hover:not(:disabled) {
		background: color-mix(in srgb, var(--vn-accent) 90%, var(--vn-accent-font-color));
	}

	.vn-button--solid:active:not(:disabled) {
		background: color-mix(in srgb, var(--vn-accent) 80%, var(--vn-accent-font-color));
	}

	.vn-button--tonal {
		background: color-mix(in srgb, var(--vn-accent) 15%, transparent);
		color: var(--vn-accent);
	}

	.vn-button--tonal:hover:not(:disabled) {
		background: color-mix(in srgb, var(--vn-accent) 22%, transparent);
	}

	.vn-button--tonal:active:not(:disabled) {
		background: color-mix(in srgb, var(--vn-accent) 30%, transparent);
	}

	.vn-button--outlined {
		border-color: color-mix(in srgb, var(--vn-accent) 50%, transparent);
		color: var(--vn-accent);
	}

	.vn-button--outlined:hover:not(:disabled) {
		background: color-mix(in srgb, var(--vn-accent) 8%, transparent);
		border-color: var(--vn-accent);
	}

	.vn-button--outlined:active:not(:disabled) {
		background: color-mix(in srgb, var(--vn-accent) 14%, transparent);
	}
</style>
