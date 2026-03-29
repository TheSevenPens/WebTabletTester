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
    <div
        style="font-size: 0.85em; display: flex; flex-direction: column; gap: 2px; padding-left: 15px;"
    >
        <label
            ><input
                type="checkbox"
                checked={(getButtonsVal($pointerLiveStats.buttons) & 1) !== 0}
                disabled
            /> 1-Pri/Tip</label
        >
        <label
            ><input
                type="checkbox"
                checked={(getButtonsVal($pointerLiveStats.buttons) & 2) !== 0}
                disabled
            /> 2-Sec</label
        >
        <label
            ><input
                type="checkbox"
                checked={(getButtonsVal($pointerLiveStats.buttons) & 4) !== 0}
                disabled
            /> 4-Aux</label
        >
        <label
            ><input
                type="checkbox"
                checked={(getButtonsVal($pointerLiveStats.buttons) & 8) !== 0}
                disabled
            /> 8-X1/Back</label
        >
        <label
            ><input
                type="checkbox"
                checked={(getButtonsVal($pointerLiveStats.buttons) & 16) !== 0}
                disabled
            /> 16-X2/Fwd</label
        >
        <label
            ><input
                type="checkbox"
                checked={(getButtonsVal($pointerLiveStats.buttons) & 32) !== 0}
                disabled
            /> 32-Era</label
        >
    </div>
</div>
