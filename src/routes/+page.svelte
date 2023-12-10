<script>
    import { Html5Qrcode, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from "html5-qrcode";
    import "@material/web/icon/icon.js";
    import "@material/web/iconbutton/icon-button.js";
    import "@material/web/tabs/tabs.js";
    import "@material/web/tabs/secondary-tab.js";
    import { onMount, tick } from "svelte";
    import { fade } from "svelte/transition";
    import { beforeNavigate } from "$app/navigation";
    
    let cameraHidden = false;
    let resultSection;
    let scanner = null;
    let tabs = null;
    let typeBarcode;
    let errorMessage;
    let infoMessage;
    let resultData = {
        resultCode: 410
    };

    async function getResultFromType(barcode) {
        errorMessage = undefined;
        if (barcode) {
            const responseData = await fetch(`/api/product?barcode=${barcode}`);
            resultData = await responseData.json();
            switch (resultData.resultCode) {
                case 400:
                    errorMessage = "해외 제품이나 단축형, 비표준형 바코드는 지원하지 않습니다.";
                    break;
                case 411:
                    errorMessage = "13자리 혹은 18자리가 맞는지 다시 한 번 확인해주세요.";
                    break;
                case 404:
                case 200:
                    if (scanner && !cameraHidden) {
                        scanner.pause(true);
                    }
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
        } else {
            errorMessage = "값을 입력해주세요.";
        }
   }

    async function createCamera() {
        scanner = new Html5Qrcode("reader");
        await scanner.start(
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
                    resizeMode: "none"
                }
            },
            (decodedText) => {
                getResultFromType(decodedText);
            },
            (errorMessage) => {
                console.warn(`HTML5 QR Code Scanner Error Message ${errorMessage}`);
            }
        ).catch(async (err) => {
            console.warn(`HTML5 QR Code Scanner Error Message ${err}`);
            cameraHidden = true;
            infoMessage = "카메라 권한이 없거나 카메라를 인식하지 못하여 전환되었습니다.";
            setTimeout(() => { infoMessage = undefined }, 2000);
            tabs.activeTabIndex = 1;
        });
    }

    async function stopCamera() {
        await scanner.stop();
        scanner.clear();
        scanner = null;
    }

    async function chooseTool(e) {
        switch(e.target.activeTabIndex) {
            case 1:
                if (scanner.getState() !== 1) {
                    await stopCamera();
                } else {
                    const tryStopScanner = setInterval(async function() {
                        if (scanner.getState() !== 1) {
                            await stopCamera();
                            clearInterval(tryStopScanner);
                        }
                    }, 500);
                }
                cameraHidden = true;
                break;
            case 0:
            default:
                cameraHidden = false;
                await tick();
                await createCamera();
                break;
        }
    };
    
    function closeDialog() {
        if(scanner && !cameraHidden) {
            scanner.resume();
        }
    }

    onMount(async() => {
        const dialogPolyfill = (await import ("dialog-polyfill")).default;
        await createCamera();
        dialogPolyfill.registerDialog(resultSection);
    });

    beforeNavigate(async () => {
        if (!cameraHidden) {
            await stopCamera();      
        }
    })
</script>

<svelte:head>
    <title>예스피씨</title>
</svelte:head>

<nav>
    <md-tabs on:change={chooseTool} bind:this={tabs} aria-label="카메라 혹은 키보드로 입력 전환" >
        <md-secondary-tab md-tab inline-icon active aria-controls="reader" id="camera-tab">
            <md-icon slot="icon">barcode_scanner</md-icon>
            카메라
        </md-secondary-tab>
        <md-secondary-tab md-tab inline-icon aria-controls="keyboard-form" id="keyboard-tab">
            <md-icon slot="icon">keyboard</md-icon>
            직접 입력
        </md-secondary-tab>
    </md-tabs>
</nav>

<main>
    <section id="input-tab">
        {#if cameraHidden}
            <form on:submit|preventDefault={getResultFromType(typeBarcode.value)}
                transition:fade={{ duration: 300 }}
                id="keyboard-form"  aria-labelledby="keyboard-tab">
                <input id="type-barcode" type="text" inputmode="numeric"
                    placeholder="880" bind:this={typeBarcode}/>
                <button id="type-submit" type="submit">
                    <md-icon>search</md-icon>
                    찾기
                </button>
            </form>
            {#if errorMessage}
                <p class="error-message" transition:fade={{ duration: 300 }}>
                    {errorMessage}
                </p>
            {:else if infoMessage}
                <p class="info-message" transition:fade={{ duration: 300 }}>
                    {infoMessage}
                </p>
            {/if}
            
        {:else}
            <div id="reader" aria-labelledby="camera-tab" />
        {/if}
        <p>
            880으로 시작하는 GS1 규격의 13자리 유통 바코드{#if cameraHidden}
            &nbsp;및 편의점 전용 18자리 바코드{/if}만 지원해요.
        </p>
    </section>
</main>

<dialog id="result" bind:this={resultSection}>
    {#if resultData.spc}
        <h1>✅ 다행이에요!</h1>
        <p class="info-container">
            <md-icon>info</md-icon>
            <span style="color: {resultData.color}" class="info">{resultData.manu} </span>
            <span>정품을 찾으셨어요.</span>
        </p>
    {:else}
        <h1>❓ 아쉽네요.</h1>
        <p class="info-container">
            <md-icon>info</md-icon>
            <span class="info">SPC 혹은 계열사 </span>
            <span>제품이 아니에요.</span>
        </p>
    {/if}
    {#if resultData.barcode != null}
        {#if resultData.product}
            <p class="info-container">
                <md-icon>bakery_dining</md-icon>
                <span class="info">제품명</span>
                {resultData.product}
            </p>
        {/if}
        <p class="info-container">
            <md-icon>barcode_scanner</md-icon>
            <span class="info">바코드 번호</span>
            <span class="info-barcode">{resultData.barcode ? resultData.barcode: "데이터를 읽으면 데이터가 표시됩니다."}</span>
        </p>
        <a href="https://www.spc.co.kr/business/spc-brand/" target="_blank" rel="noreferrer" class="suggest-spc button-style-link">
            <md-icon>store</md-icon>
            SPC의 다양한 브랜드 만나기
        </a>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLScammI4qPQs8MNfHpSJhOh1ik43_jlB0fRqxv3cJLD285tZbQ/viewform?entry.350390761={resultData.barcode}" class="request button-style-link" target="_blank" rel="noreferrer">
            <md-icon>contact_support</md-icon>
            제보 및 문의하기
        </a>
    {/if}
    <form method="dialog">
        <button id="close-dialog" on:click={closeDialog}>
            <md-icon>find_replace</md-icon>
            닫고 다시 찾기
        </button>    
    </form>
</dialog>

<style>

    nav {
        display: flex;
        justify-content: center;
        border-radius: 10px;
        --md-sys-color-primary: #30B3E7;
        --md-sys-color-on-surface: #30B3E7;
        --md-sys-color-surface: transperant;
        --md-ref-typeface-plain: "IBM Plex Sans KR", sans-serif;
        --md-ref-typeface-weight-medium: 600;
    }

    nav md-tabs {
        border-radius: 10px;
    }

    .error-message {
        margin-bottom: 0;
        color: #8C182B;
    }

    .button-style-link {
        border-radius: 10px;
        font-weight: 600;
        display: flex;
        justify-content: center;
        gap: 5px;
        text-decoration: none;
        padding: 10px;
        margin-bottom: 0.5em;
    }

    .request {
        background: #666868;
        color: #ffffff;
        
    }

    .suggest-spc {
        background: #4063A0;
        color: #ffffff;
    }

    .info-container {
        display: flex;
        gap: 5px;
    }

    .info {
        font-weight: 600;
        word-break: keep-all;
    }

    .info-barcode {
        background: #e4e4e4;    
        border-radius: 10px;
        padding: 0.1em 0.5em;
    }

    main {
        font-family: "IBM Plex Sans KR", sans-serif;
        color: #666868;
    }

    dialog {
        font-family: "IBM Plex Sans KR", sans-serif;
        position: fixed;
        box-shadow: 1px 1px 5px #666868;
    }

    dialog[open] {
        animation: showingDialog 0.7s ease normal;
    }
  
    @keyframes showingDialog{
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    dialog form {
        margin: 0;
    }

    section, form {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: center;
        margin: 2rem 0 2rem 0;
    }

    form input {
        min-width: 0;
        width: 15em;
        max-width: 90vw;
    }

    section p {
        text-align: center;
        word-break: keep-all;
    }

    
    #reader {
        width: 320px;
        border-radius: 10px;
        overflow: hidden;
    }

    #result {
        border-radius: 10px;
        border: none;
    }
    
    input {
        margin-bottom: 0.5em;
        height: 2.5em;
        font-size: 1em;
        border-radius: 10px;
        border: 1px solid #30B3E7;
        color: #666868;
        padding: 0.5rem;
    }

    input:focus-visible {
        outline: 2px solid #30B3E7;
    }

    button {
        font-family: "IBM Plex Sans KR", sans-serif;
        font-weight: 600;
        font-size: 1rem;
        display: flex;
        justify-content: center;
        gap: 5px;
        border-radius: 10px;
        border: none;
        color: #FFFFFF;
        padding: 10px;
        background: #30B3E7;
        cursor: pointer;
    }

    dialog button {
        width: 100%;
    }

    section button {
        width: 100%;
    }

    button:focus-visible, button:hover, .button-style-link:hover {
        outline: solid #30B3E7;
        outline-offset: 0.1em;
    }

    @media (prefers-color-scheme: dark) {
        nav {
            --md-sys-color-on-surface-variant: #e4e4e4;
            --md-sys-color-outline-variant: #373737;
        }

        input {
            background: #373737;
            color: #e4e4e4;
        }

        dialog {
            background: #373737;
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

        .info-barcode {
            background: #4b4d4d;
        }

        .error-message {
            color: #f38b9d;
        }
    }

    @media screen and (max-width: 340px) {
        #reader {
            width: 90vw;
        }
    }
</style>