<script>
    import { Html5Qrcode, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from "html5-qrcode";
    import { onMount } from 'svelte';
    import { isSpcProduct } from './api/+server.js';

    let toolChooser;
    let cameraHidden = false;
    let resultSection;
    let codeElement;
    let typeBarcode;
    let resultData = {
        manu: null,
        spc: false,
        barcode: null,
        color: null
    };

    function getResultFromType(barcode) {
        if (barcode.startsWith("880")) {
            resultData = isSpcProduct(barcode);
            resultSection.showModal();
        }
    }

    function createCamera() {
        codeElement = new Html5Qrcode("reader");
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                codeElement.start(
                    {
                        facingMode: "environment"
                    },
                    {
                        fps: 10,
                        aspectRatio: 1.0,
                        supportedScanTypes: [ Html5QrcodeScanType.SCAN_TYPE_CAMERA ],
                        formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
                    },
                    (decodedText) => {
                        codeElement.pause(true);
                        resultData = isSpcProduct(decodedText);
                        resultSection.showModal();
                    },
                    (errorMessage) => {
                        console.warn(`HTML5 QR Code Scanner Error Message ${errorMessage}`);
                    }
                ).catch((err) => {
                    console.warn(`HTML5 QR Code Scanner Error Message ${err}`);
                    toolChooser.setAttribute("activeIndex", "1");
                });
            }
        }).catch((err) => {
            console.warn(err);
            toolChooser.setAttribute("activeIndex", "1");
        });
    }

    onMount(async() => {
        await import ("@material/mwc-tab-bar");
        await import ("@material/mwc-tab");

        createCamera();
        toolChooser.addEventListener('MDCTabBar:activated', function(data) {
            switch(data.detail.index) {
                case 1:
                    cameraHidden = true;
                    codeElement.stop();
                    break;
                case 0:
                default:
                    cameraHidden = false;
                    createCamera();
                    break;
            }
        });
    });

</script>

<header>
    <h1>
        <span class="header-default">예스피씨</span>
        <sup class="header-bread">알파</sup>
    </h1>
</header>

<nav>
    <mwc-tab-bar bind:this={toolChooser}>
        <mwc-tab isMinWidthIndicator label="카메라" />
        <mwc-tab isMinWidthIndicator label="직접 입력" />
    </mwc-tab-bar>
</nav>

<main>
    <section id="input-tab">
        <div id="reader"></div>
        {#if cameraHidden}
            <input id="type-barcode" type="text" inputmode="numeric" placeholder="880" bind:this={typeBarcode} />
            <button id="type-submit" on:click={getResultFromType(typeBarcode.value)}>찾기</button>
        {/if}
        <p>880으로 시작하는 GS1 규격의 유통 바코드만 지원해요.</p>
    </section>
</main>

<dialog id="result" bind:this={resultSection}>
    {#if resultData.spc}
        <h1>✅ 다행이에요!</h1>
        <p><span style="color: {resultData.color}">{resultData.manu}</span> 정품을 찾으셨네요.</p>
    {:else}
        <h1>❓ 아쉽네요.</h1>
        <p>SPC 혹은 계열사 제품이 아니에요.</p>
    {/if}
    {#if resultData.barcode != null}
        <p>바코드 정보: {resultData.barcode ? resultData.barcode: "데이터를 읽으면 데이터가 표시됩니다."}</p>
        <p><a href="https://forms.gle/YCXs6e3GNUTyqWLG9" class="request">잘못된 정보 제보하기</a></p>
        <p><a href="https://www.spc.co.kr/business/spc-brand/" target="_blank" class="suggest-spc">SPC의 다양한 브랜드도 만나보세요.</a></p>
    {/if}
    <button id="close-dialog" on:click={resultSection.close() && codeElement.resume()}>닫고 다시 찾기</button>
</dialog>

<style>
    nav {
        --mdc-theme-primary: #30B3E7;
        --mdc-ripple-focus-opacity: 0.00;
        --mdc-typography-font-family: "IBM Plex Sans KR", sans-serif;
        --mdc-typography-button-font-size: 1.0rem;
        --mdc-typography-button-font-weight: 600;
    }

    header {
        display: flex;
        justify-content: center;
        font-family: "IBM Plex Sans KR", sans-serif;
        font-weight: 600;
        color: #30B3E7;
    }

    .header-bread {
        font-size: 1.0rem;
        vertical-align: top;
    }
    .header-default {
        display: inline;
        margin-left: -7px;
    }

    .request {
        color: #7F8181;
    }
    .suggest-spc {
        color: #4063A0;
    }

    main {
        font-family: "IBM Plex Sans KR", sans-serif;
        color: #7F8181
    }

    dialog {
        font-family: "IBM Plex Sans KR", sans-serif;
        position: fixed;
    }

    section {
        display: grid;
        grid: repeat(1, 1fr);
        justify-content: center;
        margin: 2rem;
    }

    #reader {
        width: 500px;
    }

    #result {
        border-radius: 10px;
        border: solid 1px #7F8181;
    }
    
    input {
        margin: 1rem;
        height: 2.5rem;
        font-size: 1rem;
        border-radius: 10px;
        border: 1px solid #30B3E7;
        padding: 0.5rem;
    }

    button {
        font-family: "IBM Plex Sans KR", sans-serif;
        font-weight: 600;
        font-size: 1rem;
        display: block;
        border-radius: 10px;
        border: solid 1px #30B3E7;
        color: #FFFFFF;
        padding: 10px;
        background: #30B3E7;
        width: 100%;
    }
</style>