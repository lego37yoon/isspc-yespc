<script>
    import { onMount } from 'svelte';

    export let uri;
    let code = null;

    onMount(async () => {
        const data = await fetch(`..${uri}`);
        code = await data.text();
        console.log(code);
    })
</script>

<code>{code}</code>

<style>
    code {
        background: #f1f1f1;
        color: #747575;
        padding: 5px;
        border-radius: 5px;
    }

    @media (prefers-color-scheme: dark) {
        code {
            background: #3d3d3d;
            color: #7F8181;
        }
    }
</style>