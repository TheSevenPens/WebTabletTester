<script lang="ts">
    import type { Snippet } from 'svelte';
    interface Props { title: string; children: Snippet; }
    let { title, children }: Props = $props();
    let collapsed = $state(false);
    const id = $props.id();
</script>
<section class="settings-section">
    <h3>
        <button class="section-toggle" onclick={() => { collapsed = !collapsed; }}
            aria-expanded={!collapsed} aria-controls={id}>
            {title}<span aria-hidden="true">{collapsed ? '▶' : '▼'}</span>
        </button>
    </h3>
    <div id={id} hidden={collapsed} class="section-body">{@render children()}</div>
</section>