<script lang="ts">
    import SidebarPanel from './SidebarPanel.svelte';
    import BackgroundSettings from './BackgroundSettings.svelte';
    import GridSettings from './GridSettings.svelte';
    import RenderingSettings from './RenderingSettings.svelte';
    import ConfigSettings from './ConfigSettings.svelte';
</script>
<SidebarPanel title="Options" side="right">
    <BackgroundSettings />
    <GridSettings />
    <RenderingSettings />
    <ConfigSettings />
</SidebarPanel>