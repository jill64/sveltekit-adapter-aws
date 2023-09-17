<script lang="ts">
  import { Toaster } from '@jill64/svelte-toast'

  export let data

  $: ({ title } = data)
</script>

<Toaster />
<svelte:head>
  <title>{title}</title>
</svelte:head>
<h1>{title}</h1>
<slot />

<style>
  :global(body) {
    font-family: sans-serif;
  }
</style>
