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
	import { modal_bgModify, modal_menu, modal_result } from '../../store/modalSlice';
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
    $: console.log(match_txt);
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

    let menuOpen = -1; // 오픈할 메뉴

    // 오른쪽 즐겨찾기리스트
    let quickList = [];
    $: if(quickList && quickList.length > 0) {
        commonService.setQuicks(quickList);
    }
    // 퀵 리스트 그룹 사라질 때 quickList에서 뺌
    $: if(quickList.some((v) => v.menus.length === 0)) {
        let findIdx = quickList.findIndex((v) => v.menus.length === 0)
        quickList = quickList.filter((v, i) => i !== findIdx);
    }
    
    const change_quickList = (ql) => {
        quickList = ql;
        console.log(quickList);
    }

    let new_quick_move = false; // 새 퀵 위에 아이콘 무빙 중
    let subMenu_moveOn = false; // 서브메뉴 무브시작
    const change_subMenu_moveOn = (v) => {
        subMenu_moveOn = v;
    }
    let quickMenu_moveOn = false; // 퀵메뉴 무브시작
    const change_quickMenu_moveOn = (v) => {
        quickMenu_moveOn = v;
    }

    $:if($modal_result) {
        let originIdx = $menuList[$modal_menu.parent].findIndex((v) => v.menuIdx === $modal_menu.menuIdx);        
        $menuList[$modal_menu.parent][originIdx] = $modal_menu;
        $menuList = $menuList;
        commonService.setMenus({
            ...storeMenus,
        });
        $modal_result = "";
        dispatch("change_menuOn", true);
        $modal_menu = {};
    }

    /* 테스트용 메뉴고유번호 붙이기 */
    $:if(curMenuNum) {
        indexMaking();
    }
    const indexMaking = () => {
        console.log('테스트용 메뉴고유번호 붙이기');
        let count = 0;
        Object.entries($menuList).map((entry, i) => {
            entry[1].map((v, i) => {
                count++;
                v.parent = entry[0];
                v.menuIdx = curMenuNum * 1000 + count;
            });
        });
    }
    /* 테스트용 메뉴고유번호 붙이기 */
    onMount(async () => {
        const menu_await = await commonService.get_menus();
        console.log("menu_await", menu_await);
        const menu_version = commonService.get_menu_version();
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
        quickList = commonService.getQuicks();
        console.log(quickList);
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
        {change_subMenu_moveOn} />
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
                            {change_subMenu_moveOn} />
                    </ul>
                </li>
                {/if}
                <!-- {#each menuEntry[1] as subMenu}
                <li><button>{subMenu.title}</button></li>
                {/each} -->
            </ul>
            {/each}
        </div>
        {:else if menuViewType === 2}
        <ul in:fade={{delay:200 ,duration:300}} out:fade={{duration:200}}>
        <MainMenuSubLi subMenus={menuSortList} sortOn={true} {subMenu_moveOn}
        {change_subMenu_moveOn} />
        </ul>
        {/if}
        {#if quickMenu_moveOn}
        <button class="quick-trashcan"
            on:mouseup={(e)=> {
                let qIdx;
                let qSubIdx;
                qIdx = quickList.findIndex((v) => {
                    qSubIdx = v.menus.findIndex((v) => v.menuIdx === $moveMenu.menuIdx);
                    return qSubIdx !== -1;
                });
                quickList[qIdx].menus = quickList[qIdx].menus.filter((v, i) => i !== qSubIdx);
            }}>
            <i class="bi bi-trash fs-50px"></i>
        </button>
        {/if}
    </div>
    <div class="menuQuick">
        <MainMenuQuick {quickList} on:change_quickList={change_quickList} 
            {subMenu_moveOn}
            {quickMenu_moveOn} on:change_quickMenu_moveOn={change_quickMenu_moveOn} />
        <!-- 퀵메뉴 맨밑 여유 빈칸 -->
        <div class="quick-group" class:new-quick={!new_quick_move} 
            class:move={$moveMenu && new_quick_move}
            class:new={$moveMenu && new_quick_move}
            role="button"
            tabindex="0"
            on:mousemove={(e) => {
                if($moveMenu) new_quick_move = true;
            }}
            on:mouseleave={(e) => {
                new_quick_move = false;
            }}
            on:mouseup={(e) => {
                if(!$moveMenu) return;
                new_quick_move = false;
                if(quickList.some((v) => v.menus.some((v) => v.menuIdx === $moveMenu.menuIdx))) {
                    let qIdx;
                    let qSubIdx;
                    qIdx = quickList.findIndex((v) => {
                        qSubIdx = v.menus.findIndex((v) => v.menuIdx === $moveMenu.menuIdx);
                        return qSubIdx !== -1;
                    });
                    quickList[qIdx].menus = quickList[qIdx].menus.filter((v, i) => i !== qSubIdx);
                }
                quickList.push({
                    name:"",
                    menus: [
                        $moveMenu,
                    ]
                });
                quickList = quickList;
            }}
        >
            {#if $moveMenu}
                {#if new_quick_move}
                <div in:fade={{duration:1500}}>
                    <div class="title"><input type="text" placeholder="그룹 이름 지정"></div>
                    <div class="btns">
                        <button>
                            <div class="btns-icon">
                                {#if !$moveMenu.icon}
                                <img src={ico_quick_home} alt="">
                                {:else}
                                <i class={`bi ${$moveMenu.icon} fs-48px`}
                                    style={`color:${$moveMenu.color === 'custom' ? $moveMenu.customColor : $moveMenu.color}`}
                                >
                                </i>
                                {/if}
                            </div>
                            <h6>{$moveMenu.name}</h6>
                        </button>
                    </div>
                </div>
                {:else}
                <i class="bi bi-plus-square fs-24px"></i>
                {/if}
            {/if}
        </div>
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
                    <button on:click={() => {
                        $inPage = {
                            frame: "https://eaintra.exc.co.kr/member/myINfo.asp",
                            menuIdx:1002,
                            parent: "개인정보",
                            name: "개인정보수정",
                            type: "Intra"
                        }
                        dispatch("change_menuOn", true);
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
                            menuIdx: 1010
                        }
                        dispatch("change_menuOn", false);
                    }}>
                        <span><i class="bi bi-envelope fs-24px"></i></span>
                        <span>메시지</span>
                        <div class="noread">99+</div>
                    </button>
                    <button on:click={() => {
                        
                        $inPage = {
                            frame: "https://eaintra.exc.co.kr/intra_mainPAge.asp",
                            menuIdx:1001,
                            parent: "메인",
                            name: "인트라메인",
                            type: "Intra"
                        }
                        dispatch("change_menuOn", false);
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
                    </button>
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
                        dispatch("change_menuOn", false);
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
            <i class={`bi ${$moveMenu.icon} fs-48px`} style={`color:${$moveMenu.color === 'custom' ? $moveMenu.customColor : $moveMenu.color}`}/>
        </div>
        {/if}
        <h6 class="title">{$moveMenu.name}</h6>
    </div>    
    {/if}
</div>