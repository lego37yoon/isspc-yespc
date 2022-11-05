<script>
    import { page } from "$app/stores";
</script>

<main>
    <h2>{$page.status} {$page.error.message}</h2>
    <p>예스피씨 이용에 불편을 드려서 죄송합니다. 현재 오류가 발생하여 사용이 어렵습니다.</p>
    <p>아래 구글 설문지로 문의주시면 신속히 처리하겠습니다.</p>
    <p><a href="https://forms.gle/YCXs6e3GNUTyqWLG9" class="request">잘못된 정보 제보하기</a></p>
</main>

<svelte:head>
    <title>오류 - 예스피씨</title>
</svelte:head>

<style>
    main {
        font-family: "IBM Plex Sans KR", sans-serif;
        color: #7F8181
    }

    h2 {
        font-weight: 600;
        color: #30B3E7;
    }

    @media (prefers-color-scheme: dark) {
        main {
            color: #e4e4e4;
        }
    }
</style>
