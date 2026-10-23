<script lang="ts">
    import * as vn from 'velne-lib';
    import { asset, resolve } from '$app/paths';
    import libPackage from '../../../lib/package.json';

    const managers = ['npm', 'pnpm', 'bun', 'deno', 'yarn'] as const;
    type PackageManager = (typeof managers)[number];

    const installers: Record<PackageManager, { command: string; rest: string }> = {
        npm: { command: 'npm install velne-lib', rest: 'install velne-lib' },
        pnpm: { command: 'pnpm add velne-lib', rest: 'add velne-lib' },
        bun: { command: 'bun add velne-lib', rest: 'add velne-lib' },
        deno: { command: 'deno add npm:velne-lib', rest: 'add npm:velne-lib' },
        yarn: { command: 'yarn add velne-lib', rest: 'add velne-lib' },
    };

    let enabled = $state(true);
    let modalOpen = $state(false);
    let copied = $state(false);
    let packageManager = $state<PackageManager>('bun');
    let pmOpen = $state(false);
    let pickerEl: HTMLDetailsElement | undefined = $state();

    let installCommand = $derived(installers[packageManager].command);
    let installRest = $derived(installers[packageManager].rest);

    const usageSnippet = `import { Button } from 'velne-lib';
import 'velne-lib/tokens.css';

<Button variant="solid">Save changes</Button>`;

    const components = [
        {
            name: 'Button',
            component: 'Button',
            text: 'Solid, tonal, outlined, and quiet actions with a shared set of tokens.',
        },
        {
            name: 'A',
            component: 'A',
            text: 'Inline links and button-styled anchors, with an external-link icon built in.',
        },
        {
            name: 'Navbar',
            component: 'Navbar',
            text: 'A fixed, sticky, or static navigation bar with optional blur.',
        },
        {
            name: 'Toggle',
            component: 'Toggle',
            text: 'A compact checkbox switch that stays keyboard and screen-reader friendly.',
        },
        {
            name: 'Tooltip',
            component: 'Tooltip',
            text: 'Pointer-aware tooltips that stay inside the viewport and follow focus.',
        },
        {
            name: 'Modal',
            component: 'Modal',
            text: 'Accessible dialogs with focus trapping, scroll locking, and edge sheets.',
        },
    ];

    const features = [
        {
            title: 'Svelte 5 first',
            text: 'Runes, snippets, and bindable props are used where they make the component simpler.',
        },
        {
            title: 'Themeable by default',
            text: 'Every surface reads from CSS variables, so your brand can replace the defaults without fighting selectors.',
        },
        {
            title: 'Accessible interactions',
            text: 'Dialogs trap focus and inert the background. Toggles keep native input semantics. Icons stay out of the accessibility tree.',
        },
        {
            title: 'Small on purpose',
            text: 'A tight set of primitives instead of a framework. Import only what you render.',
        },
    ];

    function selectManager(manager: PackageManager) {
        packageManager = manager;
        pmOpen = false;
        copied = false;
    }

    async function copyInstall() {
        await navigator.clipboard.writeText(installCommand);
        copied = true;
        setTimeout(() => (copied = false), 1500);
    }

    $effect(() => {
        if (!pmOpen) return;
        const close = (event: PointerEvent) => {
            if (pickerEl && !pickerEl.contains(event.target as Node)) pmOpen = false;
        };
        document.addEventListener('pointerdown', close);
        return () => document.removeEventListener('pointerdown', close);
    });
</script>

<svelte:head>
    <title>velne-lib — Svelte 5 components</title>
    <meta
        name="description"
        content="A focused Svelte 5 component library with accessible primitives, CSS-variable theming, and sensible defaults."
    />
</svelte:head>

<vn.Navbar position="sticky" blur>
    <a class="brand" href={resolve('/')} aria-label="velne-lib home">
        <img class="brand-mark" src={asset('favicon.svg')} alt="" width="24" height="24" />
        <span>velne-lib</span>
    </a>

    {#snippet right()}
        <vn.A variant="btn-simple" href={resolve('/docs')}>Docs</vn.A>
        <vn.A
            variant="btn-simple"
            href="https://github.com/ivaansridev/velne"
            target="_blank"
            rel="noopener noreferrer">GitHub</vn.A>
        <vn.A variant="btn-solid" href={resolve('/docs')}>Get started</vn.A>
    {/snippet}
</vn.Navbar>

<main class="page">
    <section class="hero">
        <div class="hero-copy">
            <p class="eyebrow">
                <span class="status-dot"></span> Svelte 5 · v{libPackage.version}
            </p>
            <h1>Components that get out of your way.</h1>
            <p class="lede">
                A focused Svelte 5 component library with accessible primitives, sensible defaults,
                and tokens you can bend to your brand.
            </p>

            <div class="actions">
                <vn.A href={resolve('/docs')} variant="btn-solid">Get started</vn.A>
                <vn.A
                    href="https://github.com/ivaansridev/velne"
                    variant="btn-simple"
                    target="_blank"
                    rel="noopener noreferrer">GitHub</vn.A
                >
            </div>

            <p class="note">No runtime dependencies beyond Svelte. MIT licensed.</p>
        </div>

        <div class="hero-demo" aria-label="Live component preview">
            <div class="demo-window">
                <div class="demo-window-bar">
                    <span></span><span></span><span></span>
                    <small>Button.svelte</small>
                </div>
                <div class="demo-window-body">
                    <div class="demo-row">
                        <vn.Button variant="solid">Save changes</vn.Button>
                        <vn.Button variant="tonal">Preview</vn.Button>
                        <vn.Button variant="outlined">Cancel</vn.Button>
                    </div>

                    <div class="demo-row">
                        <vn.Tooltip content="Includes an external-link icon">
                            <vn.A href="https://svelte.dev" variant="btn-simple">Open docs</vn.A>
                        </vn.Tooltip>
                    </div>

                    <div class="demo-row demo-row-between">
                        <label class="toggle-demo">
                            <vn.Toggle bind:checked={enabled} />
                            <span>Notifications {enabled ? 'on' : 'off'}</span>
                        </label>
                        <vn.Button variant="simple" onclick={() => (modalOpen = true)}>
                            Open modal
                        </vn.Button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="section-head">
            <p class="eyebrow">The set</p>
            <h2>Six pieces. One visual language.</h2>
            <p>
                Enough to build a real interface, small enough to understand at a glance. Every
                component shares the same radius, spacing, and accent tokens.
            </p>
        </div>

        <div class="component-grid">
            {#each components as item, index (item.component)}
                <a
                    class="component-card"
                    href={resolve(`/docs?c=${encodeURIComponent(item.component)}`)}
                >
                    <span class="card-number">{String(index + 1).padStart(2, '0')}</span>
                    <h3>{item.name}</h3>
                    <p>{item.text}</p>
                    <span class="card-arrow" aria-hidden="true">→</span>
                </a>
            {/each}
        </div>
    </section>

    <section class="section split">
        <div class="section-head sticky-head">
            <p class="eyebrow">Under the hood</p>
            <h2>Designed for the edges.</h2>
            <p>
                The details that usually get skipped are the ones that make a component library feel
                finished.
            </p>
        </div>

        <div class="feature-list">
            {#each features as feature (feature.title)}
                <article class="feature">
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                </article>
            {/each}
        </div>
    </section>

    <section class="section install">
        <div class="section-head">
            <p class="eyebrow">Install</p>
            <h2>Two lines to your first component.</h2>
            <p>Add the package, import the tokens once, and start composing.</p>
        </div>

        <div class="install-card">
            <div class="install-row">
                <div class="install-command">
                    <details class="pm-picker" bind:open={pmOpen} bind:this={pickerEl}>
                        <summary aria-label={`Package manager: ${packageManager}`}>
                            {packageManager}
                            <span class="chevron" aria-hidden="true">▾</span>
                        </summary>
                        <ul class="pm-menu">
                            {#each managers as manager (manager)}
                                <li>
                                    <button
                                        type="button"
                                        class:active={manager === packageManager}
                                        onclick={() => selectManager(manager)}
                                    >
                                        {manager}
                                    </button>
                                </li>
                            {/each}
                        </ul>
                    </details>
                    <span>{installRest}</span>
                </div>
                <vn.Button variant="simple" onclick={copyInstall}>
                    {copied ? 'Copied' : 'Copy'}
                </vn.Button>
            </div>
            <pre><code>{usageSnippet}</code></pre>
        </div>
    </section>

    <footer class="site-footer">
        <p>Built for Svelte 5. MIT licensed.</p>
        <nav aria-label="Footer">
            <a href={resolve('/docs')}>Docs</a>
            <a href="https://github.com/ivaansridev/velne" target="_blank" rel="noopener noreferrer"
                >GitHub</a
            >
            <a
                href="https://www.npmjs.com/package/velne-lib"
                target="_blank"
                rel="noopener noreferrer">npm</a
            >
        </nav>
    </footer>
</main>

<vn.Modal bind:open={modalOpen}>
    {#snippet heading()}
        This is a real dialog
    {/snippet}

    <p style="margin: 0">
        The modal traps focus, locks scrolling, and restores focus to the trigger when it closes.
        Press <kbd>Esc</kbd>, click the backdrop, or use the buttons below.
    </p>

    {#snippet footer()}
        <vn.Button variant="simple" onclick={() => (modalOpen = false)}>Close</vn.Button>
        <vn.Button variant="solid" onclick={() => (modalOpen = false)}>Got it</vn.Button>
    {/snippet}
</vn.Modal>

<style>
    .page {
        box-sizing: border-box;
        width: min(1120px, 100%);
        margin: 0 auto;
        padding: 0 1.25rem 4rem;
    }

    .brand {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        color: inherit;
        font-weight: 700;
        letter-spacing: -0.02em;
        text-decoration: none;
    }

    .brand-mark {
        display: block;
        flex: none;
        width: 24px;
        height: 24px;
        border-radius: 6px;
    }

    .nav-link {
        color: inherit;
        font-size: 14px;
        text-decoration: none;
        opacity: 0.68;
        transition: opacity 120ms ease;
    }

    .nav-link:hover {
        opacity: 1;
    }

    .hero {
        position: relative;
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
        gap: clamp(2rem, 6vw, 5rem);
        align-items: center;
        padding: clamp(3rem, 8vw, 6rem) 0 clamp(3rem, 7vw, 5rem);
    }

    .hero::before {
        content: '';
        position: absolute;
        z-index: -1;
        inset: -10% -15% auto;
        height: 520px;
        background: radial-gradient(
            circle at 72% 22%,
            color-mix(in srgb, var(--vn-accent) 14%, transparent),
            transparent 58%
        );
        pointer-events: none;
    }

    .eyebrow {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
        color: var(--vn-accent);
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--vn-accent);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--vn-accent) 12%, transparent);
    }

    .hero h1 {
        max-width: 11ch;
        margin: 0.65rem 0 1.25rem;
        font-size: clamp(2.9rem, 7vw, 5.4rem);
        font-weight: 750;
        letter-spacing: -0.055em;
        line-height: 0.95;
    }

    .lede {
        max-width: 53ch;
        margin: 0;
        color: color-mix(in srgb, var(--vn-font-color) 68%, transparent);
        font-size: clamp(1rem, 1.8vw, 1.15rem);
        line-height: 1.65;
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
        margin: 2rem 0 1rem;
    }

    .note {
        margin: 0;
        color: color-mix(in srgb, var(--vn-font-color) 48%, transparent);
        font-size: 13px;
    }

    .hero-demo {
        position: relative;
    }

    .demo-window {
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--vn-font-color) 12%, transparent);
        border-radius: var(--vn-radius-med);
        background: color-mix(in srgb, var(--vn-bg-tint) 88%, transparent);
        box-shadow: 0 24px 80px color-mix(in srgb, #000 35%, transparent);
        transform: rotate(1.2deg);
    }

    .demo-window-bar {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 10px 12px;
        border-bottom: 1px solid color-mix(in srgb, var(--vn-font-color) 10%, transparent);
        background: color-mix(in srgb, var(--vn-font-color) 3%, transparent);
    }

    .demo-window-bar span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: color-mix(in srgb, var(--vn-font-color) 20%, transparent);
    }

    .demo-window-bar span:first-child {
        background: color-mix(in srgb, var(--vn-accent) 70%, transparent);
    }

    .demo-window-bar small {
        margin-left: 6px;
        color: color-mix(in srgb, var(--vn-font-color) 45%, transparent);
        font-size: 11px;
    }

    .demo-window-body {
        display: grid;
        gap: 1.35rem;
        padding: clamp(1.25rem, 3vw, 2rem);
    }

    .demo-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.65rem;
    }

    .demo-row-between {
        justify-content: space-between;
    }

    .toggle-demo {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        color: color-mix(in srgb, var(--vn-font-color) 72%, transparent);
        font-size: 14px;
    }

    .section {
        padding: clamp(3rem, 7vw, 5.5rem) 0 0;
    }

    .section-head {
        max-width: 620px;
        margin-bottom: 2rem;
    }

    .section-head h2 {
        margin: 0.5rem 0 0.75rem;
        font-size: clamp(1.9rem, 4vw, 3rem);
        letter-spacing: -0.045em;
        line-height: 1.05;
    }

    .section-head p:last-child {
        margin: 0;
        color: color-mix(in srgb, var(--vn-font-color) 62%, transparent);
        line-height: 1.65;
    }

    .component-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1px;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--vn-font-color) 12%, transparent);
        border-radius: var(--vn-radius-med);
        background: color-mix(in srgb, var(--vn-font-color) 12%, transparent);
    }

    .component-card {
        display: flex;
        min-height: 200px;
        flex-direction: column;
        padding: 1.5rem;
        background: var(--vn-bg-tint);
        color: inherit;
        text-decoration: none;
        transition: background-color 140ms ease;
    }

    .component-card:hover {
        background: color-mix(in srgb, var(--vn-accent) 7%, var(--vn-bg-tint));
    }

    .card-number {
        color: var(--vn-accent);
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 11px;
        letter-spacing: 0.08em;
    }

    .component-card h3 {
        margin: 1.4rem 0 0.5rem;
        font-size: 1.15rem;
        letter-spacing: -0.02em;
    }

    .component-card p {
        margin: 0;
        color: color-mix(in srgb, var(--vn-font-color) 58%, transparent);
        font-size: 14px;
        line-height: 1.55;
    }

    .card-arrow {
        margin-top: auto;
        padding-top: 1.25rem;
        color: var(--vn-accent);
        font-size: 18px;
        transition: transform 140ms ease;
    }

    .component-card:hover .card-arrow {
        transform: translateX(4px);
    }

    .split {
        display: grid;
        grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
        gap: clamp(2rem, 6vw, 5rem);
    }

    .sticky-head {
        align-self: start;
        position: sticky;
        top: 80px;
        margin-bottom: 0;
    }

    .feature-list {
        display: grid;
        gap: 0;
        border-top: 1px solid color-mix(in srgb, var(--vn-font-color) 12%, transparent);
    }

    .feature {
        display: grid;
        grid-template-columns: minmax(150px, 0.45fr) 1fr;
        gap: 1.5rem;
        padding: 1.5rem 0;
        border-bottom: 1px solid color-mix(in srgb, var(--vn-font-color) 12%, transparent);
    }

    .feature h3 {
        margin: 0;
        font-size: 15px;
        letter-spacing: -0.01em;
    }

    .feature p {
        margin: 0;
        color: color-mix(in srgb, var(--vn-font-color) 58%, transparent);
        font-size: 14px;
        line-height: 1.6;
    }

    .install {
        display: grid;
        grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
        gap: clamp(2rem, 6vw, 5rem);
        align-items: start;
    }

    .install .section-head {
        margin-bottom: 0;
    }

    .install-card {
        overflow: visible;
        border: 1px solid color-mix(in srgb, var(--vn-font-color) 12%, transparent);
        border-radius: var(--vn-radius-med);
        background: var(--vn-bg-tint);
    }

    .install-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid color-mix(in srgb, var(--vn-font-color) 10%, transparent);
    }

    .install-command {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.35rem;
        min-width: 0;
        color: var(--vn-accent);
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 13px;
        white-space: nowrap;
    }

    .pm-picker {
        position: relative;
        display: inline-block;
    }

    .pm-picker summary {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        border-radius: 3px;
        cursor: pointer;
        list-style: none;
        outline: none;
    }

    .pm-picker summary::-webkit-details-marker {
        display: none;
    }

    .pm-picker summary:hover {
        color: var(--vn-font-color);
    }

    .pm-picker summary:focus-visible {
        outline: 2px solid var(--vn-accent);
        outline-offset: 3px;
    }

    .chevron {
        font-size: 9px;
        transition: transform 120ms ease;
    }

    .pm-picker[open] .chevron {
        transform: rotate(180deg);
    }

    .pm-menu {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        z-index: 20;
        min-width: 110px;
        margin: 0;
        padding: 4px;
        list-style: none;
        border: 1px solid color-mix(in srgb, var(--vn-font-color) 15%, transparent);
        border-radius: var(--vn-radius);
        background: var(--vn-bg-tint);
        box-shadow: 0 16px 40px color-mix(in srgb, #000 40%, transparent);
    }

    .pm-menu button {
        display: block;
        width: 100%;
        padding: 6px 8px;
        border: 0;
        border-radius: 3px;
        background: transparent;
        color: var(--vn-font-color);
        cursor: pointer;
        font: inherit;
        font-size: 13px;
        text-align: left;
    }

    .pm-menu button:hover {
        background: color-mix(in srgb, var(--vn-font-color) 8%, transparent);
    }

    .pm-menu button.active {
        background: var(--vn-accent);
        color: var(--vn-bg);
    }

    .install-card pre {
        margin: 0;
        padding: 1.25rem;
        overflow-x: auto;
        color: color-mix(in srgb, var(--vn-font-color) 78%, transparent);
        font-size: 13px;
        line-height: 1.65;
    }

    .site-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-top: clamp(4rem, 9vw, 7rem);
        padding-top: 1.5rem;
        border-top: 1px solid color-mix(in srgb, var(--vn-font-color) 12%, transparent);
        color: color-mix(in srgb, var(--vn-font-color) 48%, transparent);
        font-size: 13px;
    }

    .site-footer p {
        margin: 0;
    }

    .site-footer nav {
        display: flex;
        gap: 1rem;
    }

    .site-footer a {
        color: inherit;
        text-decoration: none;
    }

    .site-footer a:hover {
        color: var(--vn-font-color);
    }

    @media (max-width: 900px) {
        .hero,
        .split,
        .install {
            grid-template-columns: 1fr;
        }

        .hero {
            padding-top: 3rem;
        }

        .hero-demo {
            max-width: 560px;
        }

        .sticky-head {
            position: static;
        }

        .component-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 620px) {
        .page {
            padding-inline: 1rem;
        }

        .nav-link {
            display: none;
        }

        .hero h1 {
            font-size: clamp(2.6rem, 13vw, 3.8rem);
        }

        .component-grid {
            grid-template-columns: 1fr;
        }

        .component-card {
            min-height: 160px;
        }

        .feature {
            grid-template-columns: 1fr;
            gap: 0.5rem;
        }

        .demo-window {
            transform: none;
        }

        .site-footer {
            flex-direction: column;
            align-items: flex-start;
        }
    }
</style>
