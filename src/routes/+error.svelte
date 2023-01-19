<script>
    import { page } from "$app/stores";
</script>

<main>
    <h2>{$page.status} {$page.error.message}</h2>
    <p>예스피씨 이용에 불편을 드려서 죄송합니다. 현재 오류가 발생하여 사용이 어렵습니다.</p>
    <p>아래 구글 설문지로 문의주시면 신속히 처리하겠습니다.</p>
    <button>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLScammI4qPQs8MNfHpSJhOh1ik43_jlB0fRqxv3cJLD285tZbQ/viewform?usp=sf_link" class="request">잘못된 정보 제보하기</a>
    </button>
</main>

<svelte:head>
    <title>오류 - 예스피씨</title>
</svelte:head>

<style>
    main {
        font-family: "IBM Plex Sans KR", sans-serif;
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        justify-items: center;
        color: #7F8181
    }

    main p {
        margin: 0;
    }

    h2 {
        font-weight: 600;
        color: #30B3E7;
    }

    button {
        font-family: "IBM Plex Sans KR", sans-serif;
        font-weight: 600;
        font-size: 1rem;
        display: block;
        border-radius: 10px;
        border: solid 1px #30B3E7;
        padding: 10px;
        margin-top: 1rem;
        background: #30B3E7;
    }

    button a {
        color: #FFFFFF;
        text-decoration: none;
    }

    button:focus-visible {  
        outline: 2px solid #7F8181;     
    }

    @media (prefers-color-scheme: dark) {
        main {
            color: #e4e4e4;
        }
    }
</style>
