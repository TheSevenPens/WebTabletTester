<script lang="ts">
    import { paintSettings, uiState } from '../lib/stores';
</script>

<section class="advanced-panel-section">
    <h4 class="advanced-panel-section-title">Config</h4>
    <label>
        <input type="checkbox" bind:checked={$paintSettings.eraseOnStrokeStart} />
        Erase on stroke start
    </label>
    <br />
    <label>
        <input type="checkbox" bind:checked={$uiState.showStrokeStats} />
        Show stroke stats
    </label>
</section>
