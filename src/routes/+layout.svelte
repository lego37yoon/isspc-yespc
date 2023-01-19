<script>
    import { page } from "$app/stores";
</script>

<header>
    <h1>
        <a href="{$page.url.origin}">
            <span class="header-default">예스피씨</span>
            <sup class="header-bread">알파</sup>
        </a>
    </h1>
</header>

<slot></slot>

<footer>
    <p>&copy; 2023 <a href="https://twitter.com/paperbox_update" target="_blank" rel="noreferrer">paperbox</a> and <a href="./oss" target="_blank" rel="noreferrer">contributors</a></p>
    <p>Special Thanks to <a href="https://twitter.com/RanolP_777" target="_blank" rel="noreferrer">Ranol☆P</a></p>
    <p>Inspired by <a href="https://isnamyang.nullfull.kr" target="_blank" rel="noreferrer">IsNamyang</a> Project</p>
    <p id="outmenu">
        <a href="https://docs.google.com/forms/d/e/1FAIpQLScammI4qPQs8MNfHpSJhOh1ik43_jlB0fRqxv3cJLD285tZbQ/viewform?usp=sf_link" class="request" target="_blank" rel="noreferrer">제보 및 문의</a> | 
        <a href="https://github.com/lego37yoon/isspc-yespc" target="_blank" rel="noreferrer">기여</a> |
        <a href="./api/guide">오픈 API</a>
    </p>
</footer>


<style>
    header {
        display: flex;
        justify-content: center;
        font-family: "IBM Plex Sans KR", sans-serif;
        font-weight: 600;
        color: #30B3E7;
    }

    h1 a, h1 a:visited, h1 a:active {
        color: #30B3E7;
        text-decoration: transparent;
    }

    h1 a:hover {
        text-decoration: underline solid 2.5px #30B3E7;
        text-underline-position: under;
        transition: text-decoration 1s;
    }

    a:focus-visible {
        outline: 2px solid #30B3E7;
        border-radius: 5px;
    }

    h1 a:focus-visible {
        outline-offset: 7px;
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

    footer a:hover {
        background: #7F8181;
        color: #e4e4e4;
        border-radius: 5px;
        text-decoration: none;
    }

    footer p {
        margin: 0;
    }

    #outmenu {
        border-top: 1px solid #7F8181;
        margin-top: 5px;
        padding-top: 5px;
    }

    @media (prefers-color-scheme: dark) {

        :global(body) {
            background: #414141;
        }
    }
</style>