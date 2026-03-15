<script lang="ts">
    /** Controlled slider: parent owns value and provides onInput(newValue) callback. Svelte 5 $props. */
    let {
        label = '',
        id = '',
        min = '0.0',
        max = '1.0',
        step = '0.01',
        value = 0.0,
        onInput = () => {},
        list = '',
    } = $props();

    function handleInput(event) {
        const newValue = parseFloat(event.currentTarget.value);
        onInput(newValue);
    }
</script>

<label for={id}>
    {label} <span>{value ?? 0}</span>
</label>
<br />
<input
    type="range"
    {id}
    {min}
    {max}
    {step}
    {value}
    oninput={handleInput}
    list={list || undefined}
/>
