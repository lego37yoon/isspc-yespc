<script>
    import { Html5Qrcode } from "html5-qrcode";
    import { onMount } from 'svelte';
    import { isSpcProduct } from './api/+server.js';

    let toolChooser;
    let cameraHidden;
    let resultSection;
    let resultData = {
        manu: null,
        spc: false,
        barcode: null,
        color: null
    };

    function onScanSuccess(decodedText, decodedResult) {
        // handle the scanned code as you like, for example:
        console.log(`Code matched = ${decodedText}`, decodedResult);
    }

    function onScanFailure(error) {
        // handle scan failure, usually better to ignore and keep scanning.
        // for example:
        console.warn(`Code scan error = ${error}`);
    }

    onMount(async() => {
        await import ("@material/mwc-tab-bar");
        await import ("@material/mwc-tab");

        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                let cameraId = devices[0].id;
                const codeScanner = new Html5Qrcode("reader");
                codeScanner.start(
                    cameraId,
                    {
                        fps: 10
                    },
                    (decodedText) => {
                        codeScanner.stop().then(() => {
                            resultData = isSpcProduct(decodedText);
                        }).catch((err) => {
                            console.warn(`HTML QR Code Scanner Stop Failed ${err}`);
                        });
                    },
                    (errorMessage) => {
                        console.warn(`HTML5 QR Code Scanner Error Message ${errorMessage}`);
                    }
                ).catch((err) => {
                    console.warn(`HTML5 QR Code Scanner Error Message ${err}`);
                    toolChooser.setAttribute("activeIndex", "1");
                });
            }
        }).catch(() => {
            toolChooser.setAttribute("activeIndex", "1");
        });

        toolChooser.addEventListener('MDCTabBar:activated', function(data) {
            switch(data.detail.index) {
                case 1:
                    cameraHidden.setAttribute("hidden");
                    break;
                case 0:
                default:
                    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
                    cameraHidden.removeAttribute("hidden");
                    break;
            }
        });
    })

</script>

<header>
    <h1>
        <sup class="header-bread">빵을</sup>
        <span class="header-default">샤리</span>
        <span class="header-enabled">SHARY</span>
    </h1>
</header>

<main>
    <mwc-tab-bar activeIndex="0" bind:this={toolChooser}>
        <mwc-tab isMinWidthIndicator label="카메라" />
        <mwc-tab isMinWidthIndicator label="직접 입력" />
    </mwc-tab-bar>

    <section id="camera-tab" bind:this={cameraHidden}>
        <div id="reader"></div>
    </section>

    {#key resultData.barcode}
    {#if resultData.barcode != null}
    <div id="result" bind:this={resultSection}>
        {#if resultData.spc}
            <h1>다행이에요!</h1>
            <p><span style="color: {resultData.color}">{manu}</span> 정품을 찾으셨네요.</p>
        {:else}
            <h1>아쉽네요.</h1>
            <p>SPC 혹은 계열사 제품이 아니에요.</p>
        {/if}
        <p>바코드 정보: {resultData.barcode ? resultData.barcode: "데이터를 읽으면 데이터가 표시됩니다."}</p>
    </div>
    {/if}
    {/key}
</main>

<style>
    header {
        display: flex;
        justify-content: center;
        font-family: "IBM Plex Sans KR", sans-serif;
        font-weight: 600;
        color: #30B3E7;
    }

    .header-bread {
        font-size: 0.7rem;
        vertical-align: top;
    }
    .header-default {
        display: inline;
    }
    .header-enabled {
        display: none;
    }

    section {
        display: flex;
        justify-content: center;
    }

    #reader {
        height: 500px;
        width: 500px;
    }
</style>