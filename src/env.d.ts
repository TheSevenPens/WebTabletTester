declare module '*.svg?url' {
  const content: string;
  export default content;
}

declare module '*.svelte' {
  import type { Component } from 'svelte';
  const component: Component;
  export default component;
}
