<script lang="ts">
    const appTitleLine1 = 'SevenPens';
    const appTitleLine2 = 'Tablet Tester';
    const appVersion = 'v2.01beta';

    const docsUrl = 'https://docs.sevenpens.com/drawtab/resources/sevenpens-tablet-tester';
    const docsLabel = 'DOCS';

    const codeUrl = 'https://github.com/TheSevenPens/WebTabletTester';
    const codeLabel = 'CODE';
</script>

<div class="controlscolumn" id="headerColumn">
    <h3>{appTitleLine1} <br /> {appTitleLine2} <br /> {appVersion}</h3>
    <p>
        <a href={docsUrl} target="_blank" rel="noopener noreferrer">{docsLabel}</a>
        |
        <a href={codeUrl} target="_blank" rel="noopener noreferrer">{codeLabel}</a>
    </p>
</div>
