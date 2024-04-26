<script>
    import { page } from "$app/stores";
</script>

<header>
    <h1>
        <a href="{$page.url.origin}">
            <span class="header-default">예스피씨</span>
            <sup class="header-bread">베타</sup>
        </a>
    </h1>
</header>

<slot></slot>

<footer>
    <p>copyright 2022 - 2024 <a href="https://twitter.com/paperbox_update" target="_blank" rel="noreferrer">paperbox</a> and <a href="{$page.url.origin}/oss" >contributors</a></p>
    <p>Special Thanks to <a href="https://twitter.com/RanolP_777" target="_blank" rel="noreferrer">Ranol☆P</a></p>
    <p>Inspired by <a href="https://isnamyang.nullfull.kr" target="_blank" rel="noreferrer">IsNamyang</a> Project</p>
    <p>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLScammI4qPQs8MNfHpSJhOh1ik43_jlB0fRqxv3cJLD285tZbQ/viewform?usp=sf_link" class="request" target="_blank" rel="noreferrer">제보 및 문의하기</a> | 
        <a href="https://github.com/lego37yoon/isspc-yespc" target="_blank" rel="noreferrer">기여하기</a> | 
        <a href="{$page.url.origin}/api/guide">공개 API</a>
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

    h1 a, h1 a:visited, h1 a:hover, h1 a:active {
        color: #30B3E7;
        text-decoration: none;
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
        text-align: center;
    }

    footer a {
        display: inline-block;
    }

    footer, footer a, footer a:visited {
        color: #666868;
    }

    footer p {
        margin: 0;
    }

    @media (prefers-color-scheme: dark) {
        :global(body) {
            background: #373737;
        }

        footer, footer a, footer a:visited {
            color: #B1B6B6;
        }
    }
</style>