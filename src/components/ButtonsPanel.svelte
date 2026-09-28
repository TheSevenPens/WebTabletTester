<script lang="ts">
    import { pointerLiveStats } from '../lib/stores';
    const buttons = [
        { bit: 1, label: 'Pri/Tip' },
        { bit: 2, label: 'Sec' },
        { bit: 4, label: 'Aux' },
        { bit: 8, label: 'X1/Back' },
        { bit: 16, label: 'X2/Fwd' },
        { bit: 32, label: 'Eraser' },
    ];
</script>

<section class="controlscolumn" aria-label="Buttons">
    <h2>BUTTONS</h2>
    {#each buttons as button (button.bit)}
        <label class="button-status">
            <input
                type="checkbox"
                checked={(($pointerLiveStats?.buttons ?? 0) & button.bit) !== 0}
                disabled
            />
            {button.bit}-{button.label}
        </label>
    {/each}
</section>
