<!-- 하단 작업표시줄 -->
<script>
    import { menuUi, pageUi } from "../../lib/ui";
    import Page from "../page/page.svelte";
    import { inPage } from "../../store/pageSlice";
	import { createEventDispatcher, onMount } from "svelte";

    export let menuOn;
    const dispatch = createEventDispatcher();

    $:if(menuOn) {
        menuUi.menuOnOff(false);
        document.addEventListener('mousedown', outClickMenuOff);
        // document.addEventListener('mousemove', outClickMenuOff);
    } else {
        menuUi.menuOnOff(true);
        document.removeEventListener('mousedown', outClickMenuOff);
        // document.removeEventListener('mousemove', outClickMenuOff);
    }
    // 메뉴 밖 마우스 나갈 시 메뉴 닫힘
    const outClickMenuOff = (e) => {
        if(!e.target.closest('#mainFooter') && !e.target.closest('#mainMenu')) {
            dispatch("change_menuOn", {value:false});
        }
    }
    
    let hoverIndex;
    let cur_zIndex = 15;
    $: max_zIndex = viewPages.reduce((acc, cur) => {
        if(cur.zIndex > acc) return cur.zIndex;
        else return acc;
    }, 0);
    let viewPages = [
        // {
        //     pageOn: false,
        //     full: false,
        //     title:"메인페이지",
        //     top:60,
        //     left:60,
        //     zIndex: 0,
        //     frame:"https://eaintra.exc.co.kr/intra_mainPAge.asp"
        // },
    ];
    // viewPage 추가하기
    $:if(Object.keys($inPage).length) {
        store_mainBtn = null;
        let findIdx = viewPages.findIndex((v) => v.menu_id === $inPage.menu_id);
        if(findIdx === -1) {
            viewPages.push(
                {
                    ...$inPage,
                    top: 60 + viewPages.length * 40,
                    left: 60 + viewPages.length * 40,
                    zIndex: cur_zIndex++,
                    pageOn: true,
                },
            );
        } else {
            viewPages[findIdx].zIndex = cur_zIndex++;
            viewPages[findIdx].pageOn = true;
        }
        viewPages = viewPages;
        $inPage = {};
    }
    let fullOn = false;
    const change_fullOn = (e) => {
        fullOn = e.detail.value;
    }

    let store_mainBtn = null; // 오른쪽 밑 메인으로 버튼 누를 시 켜져있던 화면 잠시 기억

    const change_view = (v, i) => {
        viewPages[i] = v;
        viewPages = viewPages;
    }
    const change_cur_zIndex = (e) => {
        cur_zIndex = e.detail.value;
    }
    const closeView = (e) => {
        viewPages = viewPages.filter((v, i) => i !== e.detail.value);
    }

    let makeViewPages = null;
    let makeViewIndex = null;
    $: pageUi.pageBlockScrView(makeViewPages);
    onMount(() => {
        window.addEventListener('resize', () => {
            clearTimeout(makeViewIndex);
            makeViewIndex = setTimeout(() => {
                pageUi.pageBlockScrView();
            }, 500);
        });
    });
</script>

<footer id="mainFooter" class:full={fullOn}>
    <!-- 왼쪽 -->
    <button class="menu-btn" on:click={() => {
        dispatch("change_menuOn", {value:!menuOn});
    }}>
        <span class="fab fa-windows"></span>
        <span>hanho portfolio</span>
    </button>
    <!-- 가운데 -->
    <div class="current-url">
        <div>
            <div class="page-block-wrap">
                {#each viewPages as view, viewIdx}
                <div class="page-block">
                    <button class="page-box" class:hover={view.hover} on:click={() => {
                        clearTimeout(hoverIndex);
                        store_mainBtn = null;
                        if(view.pageOn && view.zIndex && view.zIndex === max_zIndex) {
                            view.pageOn = false;
                            view.zIndex = 0;
                        } else {
                            view.pageOn = true;
                            view.zIndex = cur_zIndex++;
                        }
                        }}
                        class:on={view.pageOn}
                        on:mouseenter={() => {
                            hoverIndex = setTimeout(() => {
                                view.hover = true;
                            }, 800);
                        }} 
                        on:mouseleave={() => {
                            clearTimeout(hoverIndex);
                            view.hover = false;
                        }}>
                        <i class={`bi ${view.icon} fs-24px`} style={`color:${view.color === 'custom' ? view.custom_color : view.color}`} />
                        <div class="page-title">
                            <span>{view.name}</span>
                        </div>
                        <div class="underline"></div>
                        <button class="close-page" on:click={(e) => {
                            e.stopPropagation();
                            closeView(viewIdx);
                        }}>
                            <i class="bi bi-x-circle-fill"></i>
                        </button>
                    </button>
                </div>
                {/each}
            </div>
        </div>
        <button class="left" on:click={pageUi.pageBlockMoveLeft}>◀</button>
        <button class="right" on:click={pageUi.pageBlockMoveRight}>▶</button>
    </div>
    <!-- 오른쪽 -->
    <div class="right-wrap">
        <button class="main-btn" on:click={() => {
            if(!store_mainBtn && viewPages.some((v) => v.pageOn)) {
                store_mainBtn = viewPages.map((v) => {
                    let result = false;
                    if(v.pageOn) {
                        v.pageOn = false;
                        result = true;
                    }
                    return result;
                });
            } else if(store_mainBtn) {
                store_mainBtn.map((v, i) => {
                    if(v) viewPages[i].pageOn = true;
                });
                store_mainBtn = null;
            }
            viewPages = viewPages;
        }}>메인으로</button>
    </div>
</footer>
<div id="pages">
    {#each viewPages as view, viewIdx}
    <Page {view} {viewIdx} {cur_zIndex} {max_zIndex} {menuOn} 
        {fullOn} on:change_fullOn={change_fullOn}
        on:change_view={(e) => {
            change_view(e.detail.value, viewIdx);
        }} on:closeView={closeView} on:change_cur_zIndex={change_cur_zIndex}/>
    {#if viewPages.length - 1 === viewIdx}
    <div class="hide" bind:this={makeViewPages}></div>
    {/if}
    {/each}
</div>


