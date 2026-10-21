<script lang="ts">
    import * as vn from '@velne/lib';

    let enabled = $state(false);
    let modalOpen = $state(false);
</script>

<vn.App
    style="--vn-app-padding: 1rem; background: var(--vn-bg); color: var(--vn-font-color); font-family: var(--vn-font)"
>
    <h1>Welcome to SvelteKit</h1>
    <p>
        Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
    </p>

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

    <div style="margin-top: 1rem">
        <vn.Button variant="solid" onclick={() => (modalOpen = true)}>Open modal</vn.Button>
    </div>

    <vn.Modal bind:open={modalOpen}>
        {#snippet heading()}
            Confirm action
        {/snippet}

        <p style="margin: 0">
            This is an example modal rendered by <code>@velne/lib</code>. Press <kbd>Esc</kbd>,
            click the backdrop, or use the buttons below to close it.
        </p>

        {#snippet footer()}
            <vn.Button variant="simple" onclick={() => (modalOpen = false)}>Cancel</vn.Button>
            <vn.Button variant="solid" onclick={() => (modalOpen = false)}>Confirm</vn.Button>
        {/snippet}
    </vn.Modal>
</vn.App>
