<script>
    /** Svelte 5 $props. */
    let { label, value = '', suffix = '' } = $props();
</script>

<span>{label}:</span>
<span>
    <span class="monospace">{value}</span>{#if suffix}{suffix}{/if}
</span>
<br />
