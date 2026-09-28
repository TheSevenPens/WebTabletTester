<script lang="ts">
    interface Props {
        label: string;
        value?: string | number | null;
        suffix?: string;
        digits?: number;
    }
    let { label, value = null, suffix = '', digits = 1 }: Props = $props();
    const formatted = $derived(typeof value === 'number' ? value.toFixed(digits) : (value ?? '—'));
</script>

<div class="stat-row">
    <span>{label}</span><span class="monospace">{formatted}{value !== null ? suffix : ''}</span>
</div>
