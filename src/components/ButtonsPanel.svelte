<script lang="ts">
    import { pointerLiveStats } from '../lib/stores';

    // Helper to safely parse the buttons string (which defaults to "-")
    function getButtonsVal(val: string): number {
        return val === '-' ? 0 : parseInt(val, 10) || 0;
    }
</script>

<div class="controlscolumn" id="buttonsColumn" style="text-align: left;">
    <div style="text-align: center; margin-bottom: 4px;">
        <span style="font-weight: bold">BUTTONS</span>
    </div>
    <div style="font-size: 0.85em; display: flex; flex-direction: column; gap: 2px; padding-left: 15px;">
        <label><input type="checkbox" checked={(getButtonsVal($pointerLiveStats.buttons) & 1) !== 0} disabled /> Primary (1)</label>
        <label><input type="checkbox" checked={(getButtonsVal($pointerLiveStats.buttons) & 2) !== 0} disabled /> Secondary (2)</label>
        <label><input type="checkbox" checked={(getButtonsVal($pointerLiveStats.buttons) & 4) !== 0} disabled /> Auxiliary (4)</label>
        <label><input type="checkbox" checked={(getButtonsVal($pointerLiveStats.buttons) & 32) !== 0} disabled /> Eraser (32)</label>
        <label><input type="checkbox" checked={(getButtonsVal($pointerLiveStats.buttons) & 8) !== 0} disabled /> X1/Back (8)</label>
        <label><input type="checkbox" checked={(getButtonsVal($pointerLiveStats.buttons) & 16) !== 0} disabled /> X2/Fwd (16)</label>
    </div>
</div>
