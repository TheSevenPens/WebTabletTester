<script lang="ts">
    /** Controlled slider: parent owns value and provides onInput(newValue) callback. Svelte 5 $props. */
    interface Props {
        label?: string;
        id?: string;
        min?: string;
        max?: string;
        step?: string;
        value?: number;
        onInput?: (newValue: number) => void;
        list?: string;
    }

    let {
        label = '',
        id = '',
        min = '0.0',
        max = '1.0',
        step = '0.01',
        value = 0.0,
        onInput = () => {},
        list = '',
    }: Props = $props();

    function handleInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
        let newValue = parseFloat(event.currentTarget.value);
        if (isNaN(newValue)) return;
        
        if (min !== undefined) {
            const minVal = parseFloat(min);
            if (!isNaN(minVal) && newValue < minVal) newValue = minVal;
        }
        if (max !== undefined) {
            const maxVal = parseFloat(max);
            if (!isNaN(maxVal) && newValue > maxVal) newValue = maxVal;
        }

        onInput(newValue);
    }
</script>

<label for={id} style="display: block; margin-bottom: 2px;">{label}</label>
<div style="display: flex; align-items: center; gap: 4px;">
    <input
        type="range"
        {id}
        {min}
        {max}
        {step}
        {value}
        oninput={handleInput}
        list={list || undefined}
        style="flex: 1; margin: 0;"
    />
    <input 
        type="number" 
        {min} 
        {max} 
        {step} 
        value={Number(value ?? 0).toFixed(3)}
        onchange={handleInput}
        style="width: 50px; text-align: right; padding: 0 2px; height: 1.5em; font-size: 0.9em; box-sizing: border-box;"
    />
</div>
