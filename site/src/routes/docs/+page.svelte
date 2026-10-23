<script lang="ts">
    import * as vn from 'velne-lib';
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import docsData from './docs-data.json';

    type ComponentDoc = (typeof docsData)[number];

    let search = $state('');
    let selected = $state<ComponentDoc>(
        docsData.find((doc) => doc.component === page.url.searchParams.get('c')) ?? docsData[0]!,
    );
    let unknown = $state<string | null>(null);

    // /docs?c=Button deep-links straight to a component. In-app navigation to
    // /docs?c=X must switch components too, not just the initial load.
    $effect(() => {
        const requested = page.url.searchParams.get('c');
        if (!requested) {
            unknown = null;
            return;
        }
        const match = docsData.find((doc) => doc.component === requested);
        unknown = match ? null : requested;
        if (match && match.component !== selected.component) selected = match;
    });

    let filtered = $derived(
        docsData.filter((doc) => {
            const query = search.toLowerCase();
            return (
                doc.name.toLowerCase().includes(query) ||
                doc.component.toLowerCase().includes(query) ||
                (doc.blurb ?? '').toLowerCase().includes(query)
            );
        }),
    );

    let entries = $derived(Object.entries(selected.attributes));
    let previewUrl = $derived(`/docs/preview?c=${encodeURIComponent(selected.component)}`);
</script>

<vn.Navbar blur>
    <h2>velne-lib</h2>

    {#snippet right()}
        <a class="nav-link" href={resolve('/')}>Home</a>
        <a class="nav-link" href={resolve('/docs')} aria-current="page">Docs</a>
    {/snippet}
</vn.Navbar>

<div class="docs-layout">
    <aside class="sidebar">
        <input
            class="search"
            type="search"
            placeholder="Search components..."
            aria-label="Search components"
            bind:value={search}
        />
        <ul class="component-list">
            {#each filtered as doc (doc.component)}
                <li>
                    <button
                        class="component-link"
                        class:active={selected.component === doc.component}
                        onclick={() => {
                            selected = doc;
                            unknown = null;
                        }}
                    >
                        {doc.name}
                    </button>
                </li>
            {/each}
        </ul>
    </aside>

    <main class="doc-panel">
        {#if unknown}
            <p class="notice" role="status">
                No component named <code>{unknown}</code> — showing
                <strong>{selected.name}</strong>.
            </p>
        {/if}

        <h1>{selected.name}</h1>
        <p class="tag">
            <vn.Tooltip content={`Import as <vn.${selected.component}>`}>
                <code>&lt;vn.{selected.component}&gt;</code>
            </vn.Tooltip>
        </p>

        {#if selected.blurb}
            <p class="blurb">{selected.blurb}</p>
        {/if}

        <p class="base">
            Renders as
            <vn.Tooltip content="Underlying HTML element">
                <code>{selected.base}</code>
            </vn.Tooltip>
        </p>

        <h2>Preview</h2>
        <iframe class="preview" title={`${selected.name} example`} src={previewUrl}></iframe>

        <h2>Example</h2>
        <pre><code>{selected.example}</code></pre>

        <h2>Attributes</h2>

        {#if entries.length}
            <table>
                <thead>
                    <tr>
                        <th><vn.Tooltip content="Component-specific prop">Attribute</vn.Tooltip></th
                        >
                        <th
                            ><vn.Tooltip content="Values or types it accepts">Accepts</vn.Tooltip
                            ></th
                        >
                    </tr>
                </thead>
                <tbody>
                    {#each entries as [attr, values] (attr)}
                        <tr>
                            <td><code>{attr}</code></td>
                            <td>
                                {#if Array.isArray(values)}
                                    {#each values as value (value)}
                                        {#if ['string', 'boolean', 'function', 'integer'].includes(value)}
                                            <code class="dynamic">Any {value}</code>
                                        {:else}
                                            <code>{value}</code>
                                        {/if}
                                    {/each}
                                {:else}
                                    <code class="dynamic">Default: {values}</code>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {:else}
            <p class="empty">No component-specific attributes.</p>
        {/if}
    </main>
</div>

<style>
    .docs-layout {
        display: flex;
        padding-top: 60px;
        min-height: 100vh;
    }

    .nav-link {
        color: inherit;
        font-size: 14px;
        text-decoration: none;
        opacity: 0.7;
    }

    .nav-link:hover,
    .nav-link[aria-current='page'] {
        opacity: 1;
    }

    .sidebar {
        width: 240px;
        flex-shrink: 0;
        padding: 24px 16px;
        border-right: 1px solid color-mix(in srgb, var(--vn-font-color) 10%, transparent);
    }

    .search {
        box-sizing: border-box;
        width: 100%;
        padding: 8px 10px;
        border: 1px solid color-mix(in srgb, var(--vn-font-color) 15%, transparent);
        border-radius: var(--vn-radius);
        background: var(--vn-bg-tint);
        color: inherit;
        font: inherit;
        font-size: 14px;
    }

    .search:focus-visible {
        outline: 2px solid var(--vn-accent);
        outline-offset: 2px;
    }

    .component-list {
        list-style: none;
        padding: 0;
        margin: 8px 0 0;
    }

    .component-link {
        display: block;
        width: 100%;
        text-align: left;
        padding: 8px 12px;
        background: transparent;
        border: none;
        border-radius: var(--vn-radius);
        color: color-mix(in srgb, var(--vn-font-color) 70%, transparent);
        cursor: pointer;
        font: inherit;
        font-size: 14px;
    }

    .component-link:hover {
        background: var(--vn-bg-tint);
        color: var(--vn-font-color);
    }

    .component-link.active {
        background: var(--vn-accent);
        color: var(--vn-accent-font-color);
    }

    .doc-panel {
        flex: 1;
        max-width: 800px;
        padding: 40px;
    }

    .tag code {
        color: var(--vn-accent);
    }

    .base {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
        margin: 0 0 4px;
        color: color-mix(in srgb, var(--vn-font-color) 60%, transparent);
        font-size: 14px;
    }

    .blurb {
        margin: 3px 0 0;
        max-width: 60ch;
        color: color-mix(in srgb, var(--vn-font-color) 65%, transparent);
        font-size: 15px;
        line-height: 1.6;
    }

    .preview {
        display: block;
        width: 100%;
        height: 320px;
        border: 1px solid color-mix(in srgb, var(--vn-font-color) 15%, transparent);
        border-radius: var(--vn-radius);
        background: var(--vn-bg);
    }

    .empty {
        margin: 6px 0 0;
        color: color-mix(in srgb, var(--vn-font-color) 55%, transparent);
        font-size: 14px;
        font-style: italic;
    }

    .notice {
        margin: 0 0 12px;
        padding: 8px 12px;
        color: var(--vn-color-red, #e5484d);
        background: color-mix(in srgb, var(--vn-color-red, #e5484d) 10%, transparent);
        border: 1px solid color-mix(in srgb, var(--vn-color-red, #e5484d) 35%, transparent);
        border-radius: var(--vn-radius);
        font-size: 13px;
    }

    pre {
        background: var(--vn-bg-tint);
        padding: 16px;
        border-radius: var(--vn-radius);
        overflow-x: auto;
        font-size: 13px;
        white-space: pre;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 8px;
    }

    th,
    td {
        text-align: left;
        padding: 10px 12px;
        border-bottom: 1px solid color-mix(in srgb, var(--vn-font-color) 10%, transparent);
        font-size: 14px;
        vertical-align: top;
    }

    td code {
        display: inline-block;
        background: var(--vn-bg-tint);
        padding: 2px 8px;
        border-radius: 0;
        margin: 1px 2px 1px 0;
        font-size: 13px;
    }

    td code.dynamic {
        color: color-mix(in srgb, var(--vn-font-color) 60%, transparent);
        font-style: italic;
    }

    @media (max-width: 900px) {
        .docs-layout {
            flex-direction: column;
        }

        .sidebar {
            width: 100%;
            padding: 12px 16px;
            border-right: none;
            border-bottom: 1px solid color-mix(in srgb, var(--vn-font-color) 10%, transparent);
        }

        .doc-panel {
            max-width: 100%;
            padding: 24px 16px;
        }
    }
</style>
