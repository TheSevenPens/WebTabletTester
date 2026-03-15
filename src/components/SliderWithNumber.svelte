<script lang="ts">
    /** Controlled slider: parent owns value and provides onInput(newValue) callback. Svelte 5 $props. */
    interface Props {
        label?: string;
        id?: string;
        min?: string;
        max?: string;
        step?: string;
        value?: number;
        defaultValue?: number;
        digits?: number;
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
        defaultValue = 0.0,
        digits = 3,
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

    let showMenu = $state(false);
    let menuX = $state(0);
    let menuY = $state(0);

    function handleContextMenu(event: MouseEvent) {
        event.preventDefault();
        menuX = event.clientX;
        menuY = event.clientY;
        showMenu = true;
    }

    function closeMenu() {
        showMenu = false;
    }

    function handleMenuAction(action: 'RESET' | 'MIN' | 'MAX') {
        closeMenu();
        let newVal = value;
        if (action === 'RESET') {
            newVal = defaultValue;
        } else if (action === 'MIN') {
            newVal = parseFloat(min);
        } else if (action === 'MAX') {
            newVal = parseFloat(max);
        }
        
        if (!isNaN(newVal)) {
            onInput(newVal);
        }
    }
</script>

<svelte:window onclick={closeMenu} onscroll={closeMenu} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div oncontextmenu={handleContextMenu}>
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
            value={Number(value ?? 0).toFixed(digits)}
            onchange={handleInput}
            style="width: 50px; text-align: right; padding: 0 2px; height: 1.5em; font-size: 0.9em; box-sizing: border-box;"
        />
    </div>
</div>

{#if showMenu}
    <div
        style="position: fixed; left: {menuX}px; top: {menuY}px; background: white; border: 1px solid #ccc; box-shadow: 2px 2px 5px rgba(0,0,0,0.2); z-index: 1000; padding: 2px 0; border-radius: 4px; font-size: 0.9em;"
        oncontextmenu={(e) => e.preventDefault()}
        role="menu"
        tabindex="-1"
    >
        <button type="button" style="display: block; width: 100%; text-align: left; background: none; border: none; padding: 4px 16px; cursor: pointer; font-size: inherit;" onclick={() => handleMenuAction('RESET')}>RESET</button>
        <button type="button" style="display: block; width: 100%; text-align: left; background: none; border: none; padding: 4px 16px; cursor: pointer; font-size: inherit;" onclick={() => handleMenuAction('MIN')}>MIN</button>
        <button type="button" style="display: block; width: 100%; text-align: left; background: none; border: none; padding: 4px 16px; cursor: pointer; font-size: inherit;" onclick={() => handleMenuAction('MAX')}>MAX</button>
    </div>
{/if}
