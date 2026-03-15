<script lang="ts">
    /** @type {() => void} */
    let { onClear = () => {}, onSave = () => {} } = $props();
</script>

<div class="controlscolumn" id="headerColumn">
    <h3>SevenPens <br /> Tablet Tester <br /> v0.910</h3>
    <p>
        <a
            href="https://thesevenpens.github.io/HtmlTabletTester/"
            target="_blank"
            rel="noopener noreferrer">DOCS</a
        >
        |
        <a
            href="https://github.com/TheSevenPens/HtmlTabletTester"
            target="_blank"
            rel="noopener noreferrer">CODE</a
        >
        <br />
        <button type="button" onclick={onClear}>CLEAR</button>
        <button type="button" onclick={onSave}>SAVE</button>
    </p>
</div>
