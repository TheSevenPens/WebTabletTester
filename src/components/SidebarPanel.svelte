<script lang="ts">
    import type { Snippet } from 'svelte';
    interface Props { title: string; side: 'left' | 'right'; children: Snippet; }
    let { title, side, children }: Props = $props();
    let minimized = $state(true);
    const id = $props.id();
</script>
<aside class="sidebar" class:minimized aria-label={title}>
    <button class="sidebar-toggle" aria-expanded={!minimized} aria-controls={id}
        aria-label={`${minimized ? 'Expand' : 'Collapse'} ${title} panel`}
        onclick={() => { minimized = !minimized; }}>
        <span>{title}</span>
        <span aria-hidden="true">{(side === 'left') === minimized ? '▶' : '◀'}</span>
    </button>
    <div id={id} class="sidebar-content" hidden={minimized}>{@render children()}</div>
</aside>