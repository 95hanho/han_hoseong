<!-- 메인메뉴 오른쪽 퀵메뉴 -->
<script>
  import { moveIcon, moveMenu } from "../../store/iconSlice";
  import { inPage } from "../../store/pageSlice";
  import ico_quick_home from '../../assets/img/ico_quick_home.png';
        
    export let quickList;
    export let change_quickList;
    export let quickMenu_moveOn;
    export let change_quickMenu_moveOn;
    export let subMenu_moveOn;
    export let change_menuOn;

    console.log('quickList', quickList);

    let on_subMenu_move = -1;
    const quick_mousemove = (e, qIdx) => {
        if($moveMenu) {
            on_subMenu_move = qIdx;
        }
    }
    const quick_mouseleave = (e) => {
        if($moveMenu) {
            on_subMenu_move = -1;
        }
    }
    const quick_mouseup = (e, quick) => {
        if($moveMenu && (subMenu_moveOn || quickMenu_moveOn)) {
            on_subMenu_move = -1;
            if(quickList.some((v) => v.menus.some((v) => v.menuIdx === $moveMenu.menuIdx))) {
                let qIdx;
                let qSubIdx;
                qIdx = quickList.findIndex((v) => {
                    qSubIdx = v.menus.findIndex((v) => v.menuIdx === $moveMenu.menuIdx);
                    return qSubIdx !== -1;
                });
                quickList[qIdx].menus = quickList[qIdx].menus.filter((v, i) => i !== qSubIdx);
            }
            quick.menus.push($moveMenu);
            change_quickList(quickList);
        }
    }

    /*  */
    let downOn = false;
    let initX = 0; // 아이콘 클릭 시 첫 x
    let initY = 0; // 아이콘 클릭 시 첫 y

    const quick2_mousedown = (e, qSub) => {
        downOn = true;
        $moveMenu = qSub;
        initX = e.offsetX;
        initY = e.offsetY;
    }
    const quick2_mousemove = (e) => {
        let moveX = e.offsetX;
        let moveY = e.offsetY;
        if(downOn && Math.abs(initX - moveX) + Math.abs(initY - moveY) > 15) {
            change_quickMenu_moveOn(true);
        }
    }
    const quick2_mouseup = (e) => {
        $moveMenu = null;
        downOn = false;
        on_subMenu_move = -1;
        change_quickMenu_moveOn(false);
    }
    $:if(quickMenu_moveOn) {
        document.addEventListener('mousemove', quick2_moveOnFnc);
        document.addEventListener('mouseup', quick2_mouseup);
    } else {
        document.removeEventListener('mousemove', quick2_moveOnFnc);
        document.removeEventListener('mouseup', quick2_mouseup);
    }
    // 퀵메뉴 드래그이동중 잔상보이게하기
    const quick2_moveOnFnc = (e) => {
        if(e.target.closest('#mainMenu')) {
            const follower = document.getElementById('followerMenu');
            const x = e.clientX;
            const y = e.clientY;
            follower.style.transform = `translate(${x}px, ${y}px)`;
        } else if(e.target.closest('#mainFooter')){
            quick2_mouseup();
            change_menuOn(false);
        } else if(e.target.closest('#iconsWrap')) {
            $moveIcon = $moveMenu;
            quick2_mouseup();
        } else {
            quick2_mouseup();
        }
    }
</script>


{#each quickList as quick, qIdx}
<div class="quick-group" class:move={on_subMenu_move == qIdx}
    on:mousemove={(e) => quick_mousemove(e, qIdx)}
    on:mouseleave={(e) => quick_mouseleave(e)}
    on:mouseup={(e) => quick_mouseup(e, quick)}
    role="button"
    tabindex="0"
>
    <div class="title"><input type="text" bind:value={quick.name} placeholder="그룹 이름 지정"
        on:change={() => change_quickList(quickList)}></div>
    <div class="btns">
        {#each quick.menus as qSub, qSubIdx}
        <button 
            on:mousedown={(e) => quick2_mousedown(e, {...qSub,
                qIdx,
                qSubIdx,
            })}
            on:mousemove={(e) => quick2_mousemove(e)}
            on:mouseup={(e) => quick2_mouseup(e)}
            on:click={(e) => {
                $inPage = {
                    ...qSub
                }
                change_menuOn(false);
                quick2_mouseup();
            }}
        >
            <div class="btns-icon">
                {#if !qSub.icon}
                <img src={ico_quick_home} alt="">
                {:else}
                <i class={`bi ${qSub.icon} fs-48px`} style={`color:${qSub.color === 'custom' ? qSub.customColor : qSub.color}`}></i>
                {/if}
            </div>
            <h6>{qSub.title}</h6>
        </button>
        {/each}
    </div>
</div>
{/each}