<script>
    /** @type {string} */
    export let label;
    /** @type {string} */
    export let value = '';
    /** @type {string} - optional suffix (e.g. "px", "ms", "events/sec") */
    export let suffix = '';
</script>

<span>{label}:</span>
<span>
    <span class="monospace">{value}</span>{#if suffix}{suffix}{/if}
</span>
<br />
