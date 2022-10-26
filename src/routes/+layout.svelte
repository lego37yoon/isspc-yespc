<script>
    /** @type {import('./$types').LayoutData} */
    export let data;
</script>

<header>
    <h1>
        <span class="header-default">예스피씨</span>
        <sup class="header-bread">알파</sup>
    </h1>
</header>

<slot></slot>

<footer>
    <p>copyright 2022 <a href="https://twitter.com/paperbox_update" target="_blank" rel="noreferrer">paperbox</a></p>
    <p>Special Thanks to <a href="https://twitter.com/RanolP_777" target="_blank" rel="noreferrer">Ranol☆P</a></p>
    <p>Inspired by <a href="https://isnamyang.nullfull.kr" target="_blank" rel="noreferrer">IsNamyang</a> Project</p>
    <p><a href="https://forms.gle/YCXs6e3GNUTyqWLG9" class="request" target="_blank" rel="noreferrer">문의하기</a></p>
</footer>


<style>
    header {
        display: flex;
        justify-content: center;
        font-family: "IBM Plex Sans KR", sans-serif;
        font-weight: 600;
        color: #30B3E7;
    }

    header p {
        text-align: center;
    }

    .header-bread {
        font-size: 1.0rem;
        vertical-align: top;
    }
    .header-default {
        display: inline;
        margin-left: -7px;
    }

    footer {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        justify-items: center;
        margin: 1rem;
        font-family: "IBM Plex Sans KR", sans-serif;
    }

    footer, footer a, footer a:visited {
        color: #7F8181;
    }

    footer p {
        margin: 0;
    }

</style>