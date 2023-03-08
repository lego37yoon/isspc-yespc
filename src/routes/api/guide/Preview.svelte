<script>
    import { onMount } from 'svelte';

    export let uri;
    let code = null;

    onMount(async () => {
        const data = await fetch(`..${uri}`);
        code = await data.text();
    })
</script>

<code>{code}</code>

<style>
    code {
        display: block;
        padding: 0.5em;
        line-break:anywhere;
        background: #f1f1f1;
        color: #747575;
        border-radius: 5px;
    }

    @media (prefers-color-scheme: dark) {
        code {
            background: #3d3d3d;
            color: #7F8181;
        }
    }
</style>