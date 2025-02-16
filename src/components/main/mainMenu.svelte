<!-- 왼쪽 아래 메인 메뉴 -->
<script>
	import { commonService } from './../../api/index.js';
	import { fade, slide } from 'svelte/transition';
    import { inPage } from "../../store/pageSlice";
    import MainMenuQuick from "../mainMenu/mainMenuQuick.svelte";
    import ico_quick_home from '../../assets/img/ico_quick_home.png';
    import MainMenuSubLi from '../mainMenu/mainMenuSubLi.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { intraList } from '../../menus/intra';
	import { modal_bgModify, modal_menu, modal_menuModify, modal_result } from '../../store/modalSlice';
	import { menuList } from '../../store/menuSlice';
	import { moveMenu } from '../../store/iconSlice';

    const dispatch = createEventDispatcher();

    /* START 왼쪽 하이라이트 메뉴 열기 닫기 */
    let hightlightOn = false;
    let highlightOpenIndex = null;
    let settingOn = false;
    const highlightOpen = (e) => {
        highlightOpenIndex = setTimeout(() => {
            hightlightOn = true;
        }, 500);
    }
    const highlightClose = () => {
        clearTimeout(highlightOpenIndex);
        hightlightOn = false;
        settingOn = false;
    }
    /* END 왼쪽 하이라이트 메뉴 열기 닫기 */

    // 
    let storeMenus = {};

    // 메뉴 보여줄 정렬타입
    let menuViewType = 1; // 1: 메뉴별, 2: 가나다 순
    // 왼쪽 메뉴리스트
    let curMenuNum = 0;
    $: menuSortList = Object.entries($menuList).reduce((acc, cur) =>  {
        acc.push(...cur[1]);
        return acc;
    },[]).sort((a, b) => a.name > b.name ? 1 : -1);

    // 메뉴검색 텍스트
    let menuSearchTxt = "";
    let searchList = [];
    $: match_search = menuSearchTxt.replace(/\s|\.|>|\(|\)|·/g, "").match(/^[0-9a-zA-Z가-힣]+/);
    $: match_txt = match_search 
        ? match_search[0] : "";
    $: if(match_search && match_txt) {
        searchList = Object.entries($menuList).reduce((acc, cur) =>  {
            let list = cur[1].filter((v) => {
                let name = v.name.replace(/\s|\.|>|\(|\)|·/g, "");
                if(name.includes(match_txt)) return true;
                else return false;
            });
            acc.push(...list);
            return acc;
        },[]).sort((a, b) => a.name > b.name ? 1 : -1);
    }

    let menuOpen = 0; // 오픈할 메뉴

    // 오른쪽 즐겨찾기리스트
    let quickList = [];
    $: if(quickList && quickList.length > 0) {
        commonService.set_quicks(quickList);
    }
    // 퀵 리스트 그룹 사라질 때 quickList에서 뺌
    $: if(quickList.some((v) => v.menus.length === 0)) {
        let findIdx = quickList.findIndex((v) => v.menus.length === 0)
        quickList = quickList.filter((v, i) => i !== findIdx);
    }
    
    const change_quickList = (e) => {
        quickList = e.detail.value;
        console.log(quickList);
    }

    let subMenu_moveOn = false; // 서브메뉴 무브시작
    const change_subMenu_moveOn = (e) => {
        subMenu_moveOn = e.detail.value;
    }
    let quickMenu_moveOn = false; // 퀵메뉴 무브시작
    const change_quickMenu_moveOn = (e) => {
        quickMenu_moveOn = e.detail.value;
        console.log('quickMenu_moveOn', quickMenu_moveOn);
    }

    $:if($modal_result) {
        let originIdx = $menuList[$modal_menu.parent].findIndex((v) => v.menu_id === $modal_menu.menu_id);        
        $menuList[$modal_menu.parent][originIdx] = $modal_menu;
        $menuList = $menuList;
        commonService.set_menus({
            ...$modal_menu,
        });
        $modal_result = "";
        dispatch("change_menuOn", {value:true});
        modal_menuModify.reset();
    }

    onMount(async () => {
        const menu_await = await commonService.get_menus();
        const menu_version = commonService.get_menu_version() || undefined;
        // 버전이 다르면 새로가져오기
        if(menu_await.version !== menu_version) {
            commonService.set_local_menus(menu_await.menus);
            storeMenus = {
                hanho: menu_await.menus,
            }
        } else {
            storeMenus = {
                hanho: commonService.get_local_menus()
            }
        }
        /*  */
        commonService.get_quicks().then((data) => {
            quickList = data.quickList;
        });
        // console.log(quickList);
        /*  */
        curMenuNum = 1;
        $menuList = storeMenus.hanho;
    });
</script>

<div id="mainMenu">
    <div class="menuList" class:trash={quickMenu_moveOn}>
        <div class="sort">
            <div class="cur-menu">
                <button>한호성</button>
            </div>
            <div>
                <div class="sort-btn">
                    <button class:on={menuViewType === 1}
                        on:click={() => menuViewType = 1}>메뉴별</button>
                    <button class:on={menuViewType === 2}
                        on:click={() => menuViewType = 2}>가나다순</button>
                </div>
            </div>
        </div>
        <div class="menu-search">
            <input type="text" class="form-control" placeholder="메뉴이름을 입력해주세요."
                bind:value={menuSearchTxt}>
            <div class="search-icon"><i class="bi bi-search fs-20px"></i></div>
            {#if menuSearchTxt.length > 0}
            <button class="search-reset"
                on:click={() => {
                    menuSearchTxt = "";
                }}><i class="bi bi-x-circle-fill fs-15px c_red"></i></button>
            {/if}
        </div>
        <!--  -->
        {#if menuSearchTxt.length > 0}
        <ul in:fade={{delay:200 ,duration:300}} out:fade={{duration:200}}>
        <MainMenuSubLi subMenus={searchList} sortOn={true} {subMenu_moveOn}
            on:change_subMenu_moveOn={change_subMenu_moveOn} />
        </ul>
        {:else if menuViewType === 1}
        <div in:fade={{delay:200 ,duration:300}} out:fade={{duration:200}}>
            {#each Object.entries($menuList) as menuEntry, index}
            <ul>
                <li>
                    <button class="sort-title" class:on={menuOpen === index}
                        on:click={() => {
                            if(menuOpen === index) {
                                menuOpen = -1;
                            } else {
                                menuOpen = index;
                            }
                        }}>
                        {menuEntry[0]}
                    </button>
                </li>
                {#if menuOpen === index}
                <li class="sub-menus" in:slide={{duration:500}} out:slide={{duration:500}}>
                    <ul>
                        <MainMenuSubLi subMenus={menuEntry[1]} sortOn={false} {subMenu_moveOn}
                            on:change_subMenu_moveOn={change_subMenu_moveOn} />
                    </ul>
                </li>
                {/if}
            </ul>
            {/each}
        </div>
        {:else if menuViewType === 2}
        <ul in:fade={{delay:200 ,duration:300}} out:fade={{duration:200}}>
        <MainMenuSubLi subMenus={menuSortList} sortOn={true} {subMenu_moveOn}
            on:change_subMenu_moveOn={change_subMenu_moveOn} />
        </ul>
        {/if}
        {#if quickMenu_moveOn}
        <button class="quick-trashcan"
            on:mouseup={(e)=> {
                let qIdx;
                let qSubIdx;
                qIdx = quickList.findIndex((v) => {
                    qSubIdx = v.menus.findIndex((v) => v.menu_id === $moveMenu.menu_id);
                    return qSubIdx !== -1;
                });
                quickList[qIdx].menus = quickList[qIdx].menus.filter((v, i) => i !== qSubIdx);
                // 전체삭제는 따로 처리
                if(quickList.length == 1 && quickList[0].menus.length == 0) {
                    commonService.set_quicks(quickList);
                }
                $moveMenu = null;
                quickMenu_moveOn = false
            }}>
            <i class="bi bi-trash fs-50px"></i>
        </button>
        {/if}
    </div>
    <div class="menuQuick">
        <MainMenuQuick {quickList} on:change_quickList={change_quickList} 
            {subMenu_moveOn}
            {quickMenu_moveOn} on:change_quickMenu_moveOn={change_quickMenu_moveOn} />
    </div>
    <div class="menuInfo" class:open={hightlightOn}
        class:setting={settingOn}
        on:mouseenter={highlightOpen}
        on:mouseleave={highlightClose}
        role="button"
        tabindex="0">
        <div class="highlight">
            <div>
                <div class="top-space">
                    <button>
                        <span><i class="bi bi-list fs-24px"></i></span>
                        <span>메인메뉴</span>
                    </button>
                </div>
                <div class="bottom-space">
                    <!-- <button on:click={() => {
                        $inPage = {
                            frame: "https://eaintra.exc.co.kr/member/myINfo.asp",
                            menu_id:1002,
                            parent: "개인정보",
                            name: "개인정보수정",
                            type: "Intra"
                        }
                        dispatch("change_menuOn", {value:true});
                    }}>
                        <span><i class="bi bi-person-circle fs-24px"></i></span>
                        <span>개인정보</span>
                    </button>
                    <button on:click={() => {
                        $inPage = {
                            name: "메시지",
                            type: "Intra",
                            frame: "https://eaintra.exc.co.kr/message/frame_message_list.asp?m_no=&page=&searchType=&searchText=&mode=&starmode=&searchName=",
                            parent: "일반관리",
                            menu_id: 1010
                        }
                        dispatch("change_menuOn", {value:false});
                    }}>
                        <span><i class="bi bi-envelope fs-24px"></i></span>
                        <span>메시지</span>
                        <div class="noread">99+</div>
                    </button>
                    <button on:click={() => {
                        $inPage = { 
                            frame: "https://eaintra.exc.co.kr/intra_mainPAge.asp",
                            menu_id:1001,
                            parent: "메인",
                            name: "인트라메인",
                            type: "Intra"
                        }
                        dispatch("change_menuOn", {value:false});
                    }}>
                        <span><i class="bi bi-house-door fs-24px"></i></span>
                        <span>메인페이지</span>
                    </button>
                    <button on:click={() => {
                        window.open("https://bris.exc.co.kr/index.asp");
                    }}>
                        <span class="bris-icon">B</span>
                        <span>브리스 바로가기</span>
                    </button>
                    <button on:click={() => {
                        window.open("https://mbris.exc.co.kr/index.asp");
                    }}>
                        <span class="bris-icon mobile">M-B</span>
                        <span>M-브리스 바로가기</span>
                    </button> -->
                    <button on:click={() => {
                        hightlightOn = true;
                        settingOn = true;
                    }}>
                        <span><i class="bi bi-gear fs-24px"></i></span>
                        <span>환경설정</span>
                    </button>
                </div>
            </div>
            <div class="setting">
                <div class="top-space">
                    <button on:click={() => {
                        settingOn = false;
                    }}>
                        <span><i class="bi bi-arrow-left fs-24px"></i></span>
                        <span>메인메뉴로 돌아가기</span>
                    </button>
                </div>
                <div class="bottom-space">
                    <button on:click={() => {
                        modal_bgModify.open();
                        dispatch("change_menuOn", {value:false});
                    }}>
                        <span><i class="bi bi-window fs-24px"></i></span>
                        <span>배경화면 설정</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- 메뉴 안 아이콘 옮길 때 잔상 -->
    {#if $moveMenu}
    <div id="followerMenu" class="pointer-space menu">
        {#if !$moveMenu.icon}
        <div class="icon">
            <img src={ico_quick_home} alt="">
        </div>
        {:else}
        <div class="icon">
            <i class={`bi ${$moveMenu.icon} fs-48px`} style={`color:${$moveMenu.color === 'custom' ? $moveMenu.custom_color : $moveMenu.color}`}/>
        </div>
        {/if}
        <h6 class="title">{$moveMenu.name}</h6>
    </div>    
    {/if}
</div>