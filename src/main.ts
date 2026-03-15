import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import faviconUrl from './assets/7P Logo Core.svg?url'

const app = mount(App, {
  target: document.getElementById('app')!,
})

const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
if (link) link.href = faviconUrl

export default app
