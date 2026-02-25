<script>
    import { createEventDispatcher } from "svelte";

    export let label = "";
    export let id = "";
    export let min = "0.0";
    export let max = "1.0";
    export let step = "0.01";
    export let value = 0.0;
    export let list = "";

    const dispatch = createEventDispatcher();

    // Re-dispatch input event so parents know when the value updates
    function handleInput(event) {
        // Value is automatically updated due to bind:value
        value = parseFloat(event.currentTarget.value);
        dispatch("input", { value });
    }
</script>

<label for={id}>
    {label} <span>{value || 0}</span>
</label>
<br />
<input
    type="range"
    {id}
    {min}
    {max}
    {step}
    bind:value
    on:input={handleInput}
    list={list || undefined}
/>
