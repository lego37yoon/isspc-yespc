<script>
    import contributors from "./contributors.json";
</script>

<svelte:head>
    <title>기여해주신 분들 - 예스피씨</title>
</svelte:head>

<main>
    <div id="contributors">
        <h2>예스피씨 개발에 기여해주신 분들</h2>
        <section id="special-thanks">
            <h3>Special Thanks</h3>
            <ul>
                {#each contributors.special as special}
                <li><a href="{special.url}" target="_blank" rel="noreferrer">{special.name}</a> - {special.notes}</li>
                {/each}
            </ul>
        </section>
        <section id="code-contribute">
            <h3>코드에 기여해주신 분들</h3> 
            <ul>
                {#each contributors.code as code}
                <li><a href="{code.url}" target="blank" rel="noreferrer">{code.name}</a> - {code.notes}</li>
                {/each}
            </ul>
        </section>
        <section id="data-contribute">
            <h3>데이터에 기여해주신 분들</h3> 
            <ul>
                {#each contributors.data as data}
                <li><a href="{data.url}" target="blank" rel="noreferrer">{data.name}</a> - {data.notes}</li>
                {/each}
            </ul>
        </section>
        <section id="oss-contribute">
            <h3>사용한 오픈소스 내역</h3> 
            <ul>
                {#each contributors.oss as oss}
                <li>
                    [<a href="{oss["license-url"]}" target="blank" rel="noreferrer">{oss["license-name"]}</a>] 
                    <a href="{oss.url}" target="blank" rel="noreferrer">{oss.name}</a> - {oss.notes}
                </li>
                {/each}
            </ul>
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
        grid-template-columns: repeat(1, 1fr);
        justify-items: center;
    }

    section {
        
    }

    a, a:visited {
        color: #7F8181;
    }

    h2, h3 {
        color: #30B3E7;
    }
</style>