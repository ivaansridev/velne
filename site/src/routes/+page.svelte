<script lang="ts">
    import * as vn from 'velne-lib';

    let enabled = $state(false);
    let modalOpen = $state(false);
</script>

<vn.Navbar position="sticky" blur>
    <h1>velne-lib</h1>

    {#snippet right()}
        <vn.Button variant="simple">Docs</vn.Button>
        <vn.Button variant="solid">Sign in</vn.Button>
    {/snippet}
</vn.Navbar>

<main class="demo">
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
            This is an example modal rendered by <code>velne-lib</code>. Press <kbd>Esc</kbd>, click
            the backdrop, or use the buttons below to close it.
        </p>

        {#snippet footer()}
            <vn.Button variant="simple" onclick={() => (modalOpen = false)}>Cancel</vn.Button>
            <vn.Button variant="solid" onclick={() => (modalOpen = false)}>Confirm</vn.Button>
        {/snippet}
    </vn.Modal>
</main>

<style>
    .demo {
        box-sizing: border-box;
        min-height: 100vh;
        padding: 0 1rem 1rem;
    }

    .demo > :first-child {
        margin-top: 0;
    }
</style>
