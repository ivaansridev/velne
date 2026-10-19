<script lang="ts">
	import * as vn from '@velne/lib';

	let enabled = $state(false);
</script>

<vn.App
	style="--vn-app-padding: 1rem; background: var(--vn-bg); color: var(--vn-font-color); font-family: var(--vn-font)"
>
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

	<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
		<vn.Tooltip content="Solid button">
			<vn.Button variant="solid">Solid</vn.Button>
		</vn.Tooltip>
		<vn.Tooltip content="Simple button">
			<vn.Button variant="simple">Simple</vn.Button>
		</vn.Tooltip>
		<vn.Tooltip content="Tonal button">
			<vn.Button variant="tonal">Tonal</vn.Button>
		</vn.Tooltip>
		<vn.Tooltip content="Outlined button">
			<vn.Button variant="outlined">Outlined</vn.Button>
		</vn.Tooltip>
	</div>

	<label style="display: flex; align-items: center; gap: 0.5rem; width: fit-content">
		<vn.Toggle bind:checked={enabled} />
		Notifications: {enabled ? 'on' : 'off'}
	</label>
</vn.App>
