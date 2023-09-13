<script>
    import apis from "./apis.json";
    import Preview from "./Preview.svelte";
</script>

<svelte:head>
    <title>공개 API | 예스피씨</title>
</svelte:head>

<main>
    <div id="inner-main">
        <section id="openapi">
            <h1>공개 API 사용 안내</h1>
            <p>예스피씨에 기여해주신 데이터를 다시 사용하실 수 있도록, 2023년 3월 8일부터 예스피씨에 사용되는 데이터를 공개 API로 사용하실 수 있습니다. 별도의 인증키는 필요하지 않습니다.</p>
            <p class="notice">
                단, 예스피씨 또한 Vercel의 무료 플랜 트래픽 제한을 적용받는 서비스이므로 해당 제한에 의하여 일일 사용이 중단될 수 있습니다. 이 점 유의하시어 개발에 참고하시기 바랍니다.
            </p>
            {#each apis.list as content}
                <details id="{content.id}">
                    <summary>
                        <h2>
                            <span class="request">{content.request}</span>
                            {content.name}
                        </h2>
                        <code>{content.uri}</code>    
                    </summary>
                    <p>{content.description}</p>
                    <h3>예시</h3>
                    <ul>
                        <li>요청: <code>{content.example}</code></li>
                        <li>결과: <Preview uri={content.example} /></li>
                    </ul>
                    <h3>요청에 사용되는 매개변수</h3>
                    <table>
                        <thead>
                            <th>이름</th>
                            <th>형태</th>
                            <th>설명</th>
                        </thead>
                        <tbody>
                            {#each content.parameter as list}
                            <tr>
                                <td><code>{list.name}</code></td>
                                <td>{list.value}</td>
                                <td>{list.description}</td>
                            </tr>
                            {/each}
                        </tbody>
                    </table>
                    <h3>응답</h3>
                    <p class="response-type">데이터 종류: <code>{content.response.type}</code></p>
                    {#each content.response.parameter as params}
                    <details class="response">
                        <summary>
                            <h4>{params.name}</h4>
                        </summary>
                        <ul>
                            <li>형식: {params.type}</li>
                            <li>{params.description}</li>
                        </ul>
                        {#if params.result}
                        <table>
                            <caption>{params.name} 응답 값의 예시</caption>
                            <thead>
                                <th>값</th>
                                {#if params.result[0].http}
                                    <th>HTTP 상태코드</th>
                                {/if}
                                <th>설명</th>
                            </thead>
                            <tbody>
                                {#each params.result as example}
                                    <tr>
                                        <td><code>{example.value}</code></td>
                                        {#if example.http}
                                        <td><code>{example.http}</code></td>
                                        {/if}
                                        <td>{example.description}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                        {/if}
                    </details>
                    {/each}
                </details>
            {/each}
        </section>
        <section id="data-download">
            <h1>데이터 내려받기</h1>
            <p>예스피씨에서 사용하는 상품 데이터를 내려받을 수 있습니다.</p>
            <a href="https://github.com/lego37yoon/isspc-yespc/blob/main/src/routes/api/data/products.json">상품 목록 (JSON)</a>
        </section>
    </div>
</main>

<style>
    div {
        font-family: "IBM Plex Sans KR", sans-serif;
        color: #7F8181;
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        justify-items: start;
    }

    main {
        display: grid;
        margin: 0 0.5em 0 0.5em;
        grid-template-columns: repeat(1, 1fr);
        justify-items: center;
    }

    details {
        margin: 1em 0.5em 0 0;
        padding: 0.5em 1em 0.5em 1em;
        box-sizing: border-box;
        width: 100%;
        background: #f8f8f8;
        border-radius: 5px;
    }

    details h3, .response-type {
        display: inline-block;
        margin-bottom: 0.5em;
    }

    summary, .response {
        margin: 0;
    }

    summary {
        cursor: pointer;
    }
    
    .response-type {
        margin-inline-start: 1em;
    }

    summary h2, summary h4 {
        display: inline-block;
        margin: 0;
    }

    summary code {
        margin-inline-start: 0.5em;
    }
    
    h1, h2, h3, h4{
        color: #30B3E7;
    }

    ul {
        padding: 0 0 0 1em;
        
    }

    a, a:visited {
        color: #7F8181;
    }

    .notice {
        margin: 0;
        border-radius: 5px;
        padding: 10px;
    }

    code {
        padding: 5px;
        border-radius: 5px;
        display: inline-block;
        line-break: anywhere;
    }

    table {
        border: 1px solid #f1f1f1;
        border-radius: 7px;
        overflow-x: scroll;
    }

    td, th {
        padding: 10px;
        border-radius: 5px;
    }

    td code {
        line-break: normal;
    }

    .notice, code, th {
        background: #f1f1f1;
        color: #747575;
    }

    .request {
        background: #30B3E7;
        font-size: 0.8em;
        padding: 0 5px 0 5px;
        margin: 5px;
        color: #ffffff;
        border-radius: 5px;
    }

    @media (prefers-color-scheme: dark) {
        p, li, a, a:visited {
            color: #e4e4e4;
        }

        table {
            border: 1px solid #3d3d3d;
            background: #3d3d3d;
            color: #e4e4e4;
        }

        .notice, code, th {
            background: #3d3d3d;
            color: #7F8181;
        }

        details {
            background: #2c2c2c;
        }
    }
</style>