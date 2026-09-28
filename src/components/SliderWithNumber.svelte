<script lang="ts">
    import { clamp } from '../lib/utils/numerics';
    interface Props {
        label: string; id: string; min?: number; max?: number; step?: number;
        value: number; defaultValue?: number; digits?: number; onInput: (value: number) => void;
    }
    let { label, id, min = 0, max = 1, step = 0.01, value, defaultValue = 0,
        digits = 3, onInput }: Props = $props();
    let actions: HTMLDetailsElement;

    function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
        const next = event.currentTarget.valueAsNumber;
        if (Number.isFinite(next)) onInput(clamp(next, min, max));
        else event.currentTarget.value = value.toFixed(digits);
    }

    function choose(next: number) {
        onInput(clamp(next, min, max));
        actions.open = false;
    }
</script>
<div class="slider-control">
    <label id={`${id}-label`} for={id}>{label}</label>
    <div class="slider-inputs">
        <input type="range" {id} {min} {max} {step} {value} oninput={handleInput} />
        <input type="number" aria-labelledby={`${id}-label`} {min} {max} {step}
            value={value.toFixed(digits)} onchange={handleInput} />
        <details class="slider-actions" bind:this={actions}>
            <summary aria-label={`Actions for ${label}`}>⋯</summary>
            <div class="slider-action-list">
                <button onclick={() => choose(defaultValue)}>Reset</button>
                <button onclick={() => choose(min)}>Minimum</button>
                <button onclick={() => choose(max)}>Maximum</button>
            </div>
        </details>
    </div>
</div>