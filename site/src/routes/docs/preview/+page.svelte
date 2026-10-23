<script lang="ts">
    import * as vn from 'velne-lib';
    import { page } from '$app/state';

    let enabled = $state(false);
    let modalOpen = $state(false);

    let component = $derived(page.url.searchParams.get('c') ?? 'Button');
</script>

<main class="preview">
    {#if component === 'Button'}
        <vn.Button variant="solid">Save changes</vn.Button>
    {:else if component === 'A'}
        <vn.A href="https://svelte.dev" variant="btn-solid">Open Svelte</vn.A>
    {:else if component === 'Navbar'}
        <vn.Navbar position="sticky" blur>
            <h1>My app</h1>
        </vn.Navbar>
    {:else if component === 'Toggle'}
        <label class="toggle-example">
            <vn.Toggle bind:checked={enabled} />
            Notifications: {enabled ? 'on' : 'off'}
        </label>
    {:else if component === 'Tooltip'}
        <vn.Tooltip content="Open settings">
            <vn.Button>Settings</vn.Button>
        </vn.Tooltip>
    {:else if component === 'Modal'}
        <vn.Button variant="solid" onclick={() => (modalOpen = true)}>Open modal</vn.Button>
        <vn.Modal bind:open={modalOpen}>
            {#snippet heading()}
                Settings
            {/snippet}

            <p style="margin: 0">Update your notification preferences.</p>

            {#snippet footer()}
                <vn.Button variant="simple" onclick={() => (modalOpen = false)}>Cancel</vn.Button>
                <vn.Button variant="solid" onclick={() => (modalOpen = false)}>
                    Save changes
                </vn.Button>
            {/snippet}
        </vn.Modal>
    {:else}
        <p>Unknown component: <code>{component}</code></p>
    {/if}
</main>

<style>
    .preview {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        min-height: 100vh;
        padding: 24px;
    }

    .toggle-example {
        display: flex;
        align-items: center;
        gap: 8px;
    }
</style>
