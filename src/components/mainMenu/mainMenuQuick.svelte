<!-- 메인메뉴 오른쪽 퀵메뉴 -->
<script>
  import { moveIcon, moveMenu } from "../../store/iconSlice";
  import { inPage } from "../../store/pageSlice";
  import ico_quick_home from '../../assets/img/ico_quick_home.png';
  import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";
        
    export let quickList;
    export let subMenu_moveOn;
    export let quickMenu_moveOn;
    const dispatch = createEventDispatcher();

    let new_quick_move = false; // 새 퀵 위에 아이콘 무빙 중

    let menumoving_on_quick_group = -1; // 움직이는 메뉴가 어느 퀵그룹 위인지
    const quick_group_mousemove = (e, qIdx) => {
        if($moveMenu) {
            menumoving_on_quick_group = qIdx;
        }
    }
    const quick_group_mouseleave = (e) => {
        if($moveMenu) {
            menumoving_on_quick_group = -1;
        }
    }
    const quick_group_mouseup = (e, quick) => {
        console.log('quick_group_mouseup');
        const move_menu = {...$moveMenu};
        // 무브중인게 있고, 서브메뉴에서 오거나, 퀵메뉴에서 온게 있을 때
        if(move_menu && (subMenu_moveOn || quickMenu_moveOn)) {
            // quickList에 해당 메뉴있다면 일단 지워줌
            if(quickList.some((v) => v.menus.some((v) => v.menu_id === move_menu.menu_id))) {
                let qIdx;
                let qSubIdx;
                qIdx = quickList.findIndex((v) => {
                    qSubIdx = v.menus.findIndex((v) => v.menu_id === move_menu.menu_id);
                    return qSubIdx !== -1;
                });
                quickList[qIdx].menus = quickList[qIdx].menus.filter((v, i) => i !== qSubIdx);
            }
            // 해당 퀵에 추가
            quick.menus.push(move_menu);
            dispatch("change_quickList", {value:quickList});
            downOn = false;
            quick_btn_reset();
        }
    }

    /*  */
    let downOn = false;
    let initX = 0; // 아이콘 클릭 시 첫 x
    let initY = 0; // 아이콘 클릭 시 첫 y

    const quick_btn_mousedown = (e, qSub) => {
        if(!$moveMenu) {
            downOn = true;
            $moveMenu = qSub;
            initX = e.offsetX;
            initY = e.offsetY;
        }
    }
    const quick_btn_mousemove = (e) => {
        let moveX = e.offsetX;
        let moveY = e.offsetY;
        if(downOn && Math.abs(initX - moveX) + Math.abs(initY - moveY) > 15 && !quickMenu_moveOn) {
            dispatch("change_quickMenu_moveOn", {value:true});
        }
    }
    const quick_btn_mouseup = (qIdx) => {
        console.log('quick_btn_mouseup');
        downOn = false;
        if(!qIdx || qIdx == menumoving_on_quick_group) {
            quick_btn_reset();
        }
    }
    const quick_btn_reset = () => {
        $moveMenu = null;
        menumoving_on_quick_group = -1;
        dispatch("change_quickMenu_moveOn", {value:false});
    }
    $:if(quickMenu_moveOn) {
        document.addEventListener('mousemove', quick_menu_afterimage);
        document.addEventListener('mouseup', quick_btn_mouseup);
    } else {
        document.removeEventListener('mousemove', quick_menu_afterimage);
        document.removeEventListener('mouseup', quick_btn_mouseup);
    }
    
    // 퀵메뉴 드래그이동중 잔상보이게하기
    const quick_menu_afterimage = (e) => {
        if(e.target.closest('#mainMenu')) {
            const follower = document.getElementById('followerMenu');
            if(follower) {
                const x = e.clientX;
                const y = e.clientY;
                follower.style.transform = `translate(${x}px, ${y}px)`;
            }
        } else if(e.target.closest('#mainFooter')){
            quick_btn_mouseup();
            dispatch("change_menuOn", {value:false});
        } else if(e.target.closest('#iconsWrap')) {
            $moveIcon = $moveMenu;
            quick_btn_mouseup();
        } else {
            quick_btn_mouseup();
        }
    }
</script>


{#each quickList as quick, qIdx}
<div class="quick-group" class:move={menumoving_on_quick_group == qIdx}
    on:mousemove={(e) => quick_group_mousemove(e, qIdx)}
    on:mouseleave={(e) => quick_group_mouseleave(e)}
    on:mouseup={(e) => quick_group_mouseup(e, quick)}
    role="button"
    tabindex="0"
>
    <div class="title"><input type="text" bind:value={quick.name} placeholder="그룹 이름 지정"
        on:change={() => dispatch("change_quickList", {value:quickList})}></div>
    <div class="btns">
        {#each quick.menus as qSub, qSubIdx}
        <button 
            on:mousedown={(e) => quick_btn_mousedown(e, {...qSub,
                qIdx,
                qSubIdx,
            })}
            on:mousemove={(e) => quick_btn_mousemove(e)}
            on:mouseup={(e) => quick_btn_mouseup(e)}
            on:click={(e) => {
                if(qSub.frame_on) {
                    $inPage = {
                        ...qSub
                    }
                    dispatch("change_menuOn", {value:false});
                    quick_btn_mouseup();
                } else window.open(qSub.url);
            }}
        >
            <div class="btns-icon">
                {#if !qSub.icon}
                <img src={ico_quick_home} alt="">
                {:else}
                <i class={`bi ${qSub.icon} fs-48px`} style={`color:${qSub.color === 'custom' ? qSub.customColor : qSub.color}`}></i>
                {/if}
            </div>
            <h6>{qSub.name}</h6>
        </button>
        {/each}
    </div>
</div>
{/each}
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
    downOn = false;
    new_quick_move = false;
    // quickList에 해당 메뉴있다면 일단 지워줌
    if(quickList.some((v) => v.menus.some((v) => v.menu_id === $moveMenu.menu_id))) {
        let qIdx;
        let qSubIdx;
        qIdx = quickList.findIndex((v) => {
            qSubIdx = v.menus.findIndex((v) => v.menu_id === $moveMenu.menu_id);
            return qSubIdx !== -1;
        });
        quickList[qIdx].menus = quickList[qIdx].menus.filter((v, i) => i !== qSubIdx);
    }
    // quickList quick객체 하나 더 넣어서 해당 menu넣음
    quickList.push({
        name:"",
        menus: [
            $moveMenu,
        ]
    });
    dispatch("change_quickList", {value:quickList});
    quick_btn_reset();
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