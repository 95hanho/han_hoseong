<script>
  import { createEventDispatcher } from "svelte";
    import { moveIcon, moveMenu } from "../../store/iconSlice";
	import { modal_menuModify } from "../../store/modalSlice";
    import { inPage } from "../../store/pageSlice";

    export let subMenus;
    export let sortOn;
    export let subMenu_moveOn;
    const dispatch = createEventDispatcher();

    let downOn = false;
    let initX = 0; // 아이콘 클릭 시 첫 x
    let initY = 0; // 아이콘 클릭 시 첫 y
    let moving_menu = null;

    const subMenu_mousedown = (e, sMenu) => {
        downOn = true;
        moving_menu = sMenu;
        initX = e.offsetX;
        initY = e.offsetY;
    }
    const subMenu_mousemove = (e) => {
        let moveX = e.offsetX;
        let moveY = e.offsetY;
        if(downOn && Math.abs(initX - moveX) + Math.abs(initY - moveY) > 15) {
            $moveMenu = moving_menu;
            dispatch('change_subMenu_moveOn', {value:true});
        }
    }
    const subMenu_mouseup = (e) => {
        moving_menu = null;
        $moveMenu = null;
        downOn = false;
        dispatch('change_subMenu_moveOn', {value:false});
    }
    $:if(subMenu_moveOn) {
        document.addEventListener('mousemove', subMenu_moveOnFnc);
        document.addEventListener('mouseup', subMenu_mouseup);
    } else {
        document.removeEventListener('mousemove', subMenu_moveOnFnc);
        document.removeEventListener('mouseup', subMenu_mouseup);
    }
    // 서브메뉴 드래그이동중 잔상보이게하기
    const subMenu_moveOnFnc = (e) => {
        if(!downOn) return;
        if(e.target.closest('#mainMenu')) {
            const follower = document.getElementById('followerMenu');
            const x = e.clientX;
            const y = e.clientY;
            if(follower) follower.style.transform = `translate(${x}px, ${y}px)`;
        } else if(e.target.closest('#mainFooter')) {
            subMenu_mouseup();
            dispatch("change_menuOn", {value:false});
        } else if(e.target.closest('#iconsWrap')) {
            $moveIcon = $moveMenu;
            dispatch("change_menuOn", {value:false});
            subMenu_mouseup();
        } else {
            subMenu_mouseup();
        }
    }
</script>

{#each subMenus as subMenu, index}
<li id={"mainMenuSubLi"+ index}>
    <button
        class:sortOn={sortOn}
        title={subMenu.name}
        on:mousedown={(e) => subMenu_mousedown(e, 
            {
                ...subMenu,
            }
        )}
        on:mousemove={(e) => subMenu_mousemove(e)}
        on:click|preventDefault={(e) => {
            if(subMenu.frame_on) {
                $inPage = {
                    ...subMenu,
                }
                dispatch("change_menuOn", {value:false});
                subMenu_mouseup();
            } else window.open(subMenu.url);
        }}
    >
        <i class={`bi ${subMenu.icon} fs-18px`} style={`color:${subMenu.color === 'custom' ? subMenu.customColor : subMenu.color}`}></i>
        {subMenu.name}
        <button class="menu-modify" on:mousedown|stopPropagation 
            on:click|stopPropagation={() => {
                modal_menuModify.open({...subMenu});
                dispatch("change_menuOn", {value:false});
            }}>
            <i class="bi bi-three-dots fs-24px"></i>
        </button>
    </button>
</li>
{/each}
