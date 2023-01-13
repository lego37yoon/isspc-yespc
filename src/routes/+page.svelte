<script>
    import { Html5Qrcode, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from "html5-qrcode";
    import { onMount } from "svelte";
    import { isSpcProduct } from "./api/+server.js";

    let toolChooser;
    let cameraHidden = false;
    let resultSection;
    let codeElement = null;
    let typeBarcode;
    let errorMessage;
    let resultData = {
        resultCode: 410
    };

    async function getResultFromType(barcode) {
        errorMessage = undefined;
        resultData = isSpcProduct(barcode);
        switch (resultData.resultCode) {
            case 400:
                errorMessage = "해외 제품이나 단축형, 비표준형 바코드는 지원하지 않습니다.";
                break;
            case 411:
                errorMessage = "13자리 혹은 18자리가 맞는지 다시 한 번 확인해주세요.";
                break;
            case 404:
            case 200:
                await resultSection.showModal();
                if (typeof HTMLDialogElement !== "function") {
                    resultSection.style.position = "fixed";
                    resultSection.style.top = "50%";
                    resultSection.style.transform = "translate(0, -50%)";
                    document.getElementsByClassName("backdrop")[0].style.cssText = "background: rgba(0,0,0,0.1);position: fixed;top: 0;right: 0;bottom: 0;left: 0;";
                }
                break;
            default:
                errorMessage = `오류 코드 ${resultData.resultCode}. 알 수 없는 이유로 조회에 실패했습니다.`;
        }
    }

    async function createCamera() {
        codeElement = new Html5Qrcode("reader");
        await codeElement.start(
            {
                facingMode: "environment"
            },
            {
                fps: 30,
                aspectRatio: 1.0,
                supportedScanTypes: [ Html5QrcodeScanType.SCAN_TYPE_CAMERA ],
                formatsToSupport: [ Html5QrcodeSupportedFormats.EAN_13 ],
                useBarCodeDetectorIfSupported: true,
                videoConstraints: {
                    focusMode: "continuous",
                    facingMode: "environment",
                    height: { min: 512, max: 3120 },
                    width: { min: 512, max: 3120 },
                    frameRate: 30,
                    sharpness: 1.5,
                    focusDistance: 1.0,
                    resizeMode: "none"
                }
            },
            (decodedText) => {
                getResultFromType(decodedText);
            },
            (errorMessage) => {
                console.warn(`HTML5 QR Code Scanner Error Message ${errorMessage}`);
            }
        ).catch((err) => {
            console.warn(`HTML5 QR Code Scanner Error Message ${err}`);
            toolChooser.setAttribute("activeIndex", "1");
        });

    }

    onMount(async() => {
        await import ("@material/mwc-tab-bar");
        await import ("@material/mwc-tab");
        const dialogPolyfill = (await import ("dialog-polyfill")).default;

        await createCamera();
        toolChooser.addEventListener('MDCTabBar:activated', function(data) {
            switch(data.detail.index) {
                case 1:
                    cameraHidden = true;
                    codeElement.stop();
                    codeElement = null;
                    break;
                case 0:
                default:
                    cameraHidden = false;
                    createCamera();
                    break;
            }
        });
        dialogPolyfill.registerDialog(resultSection);
    });

</script>

<svelte:head>
    <title>예스피씨</title>
</svelte:head>

<nav>
    <mwc-tab-bar bind:this={toolChooser}>
        <mwc-tab isMinWidthIndicator label="카메라"/>
        <mwc-tab isMinWidthIndicator label="직접 입력" />
    </mwc-tab-bar>
</nav>

<main>
    <section id="input-tab">
        <div id="reader"></div>
        {#if cameraHidden}
            <form on:submit|preventDefault={getResultFromType(typeBarcode.value)}>
                <input id="type-barcode" type="text" inputmode="numeric" placeholder="880" bind:this={typeBarcode} />
                <button id="type-submit" type="submit">찾기</button>
                {#if errorMessage}
                    <p class="error-message">{errorMessage}</p>
                {/if}    
            </form>
            <p>880으로 시작하는 GS1 규격의 13자리 유통 바코드 및 편의점 전용 18자리 바코드만 지원해요.</p>
        {:else}
            <p>880으로 시작하는 GS1 규격의 13자리 유통 바코드만 지원해요.</p>
        {/if}
    </section>
</main>

<dialog id="result" bind:this={resultSection}>
    {#if resultData.spc}
        <h1>✅ 다행이에요!</h1>
        <p><span style="color: {resultData.color}">{resultData.manu}</span> 정품을 찾으셨어요.</p>
    {:else}
        <h1>❓ 아쉽네요.</h1>
        <p>SPC 혹은 계열사 제품이 아니에요.</p>
    {/if}
    {#if resultData.barcode != null}
        <p>{resultData.product ? resultData.product: ""}</p>
        <p>바코드 정보: {resultData.barcode ? resultData.barcode: "데이터를 읽으면 데이터가 표시됩니다."}</p>
        <p><a href="https://docs.google.com/forms/d/e/1FAIpQLScammI4qPQs8MNfHpSJhOh1ik43_jlB0fRqxv3cJLD285tZbQ/viewform?entry.350390761={resultData.barcode}" class="request" target="_blank" rel="noreferrer">제보 및 문의하기</a></p>
        <p><a href="https://www.spc.co.kr/business/spc-brand/" target="_blank" rel="noreferrer" class="suggest-spc">SPC의 다양한 브랜드도 만나보세요.</a></p>
    {/if}
    <button id="close-dialog" on:click={resultSection.close()}>닫고 다시 찾기</button>
</dialog>

<style>

    nav {
        --mdc-theme-primary: #30B3E7;
        --mdc-ripple-focus-opacity: 0.00;
        --mdc-typography-font-family: "IBM Plex Sans KR", sans-serif;
        --mdc-typography-button-font-size: 1.0rem;
        --mdc-typography-button-font-weight: 600;
    }

    nav mwc-tab:focus-visible {
        border-radius: 5px;
        outline: 2px solid #30B3E7;
    }

    .error-message {
        margin-bottom: 0;
        color: #8C182B;
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

    section, form {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        justify-items: center;
        margin: 2rem 0 2rem 0;
    }

    section p {
        text-align: center;
    }

    
    #reader {
        width: 320px;
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
        color: #7F8181;
        padding: 0.5rem;
    }

    input:focus-visible {
        outline: 2px solid #30B3E7;
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
    }

    button:focus-visible {  
        outline: 2px solid #7F8181;     
    }
    

    dialog button {
        width: 100%;
    }

    section button {
        width: 320px;
    }

    @media (prefers-color-scheme: dark) {
        nav {
            color: #e4e4e4;
            --mdc-tab-text-label-color-default: #e4e4e4;
        }

        input {
            background: #414141;
            color: #e4e4e4;
        }

        dialog {
            background: #414141;
            color: #e4e4e4;
        }

        section p {
            color: #e4e4e4;
        }

        input::placeholder {
            color: #e4e4e4;
        }

        button:focus-visible {
            outline: 2px solid #e4e4e4;     
        }

        .error-message {
            color: #f38b9d;
        }
    }
</style>