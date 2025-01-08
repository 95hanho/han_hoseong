<script>
    import { moveIcon, moveMenu } from "../../store/iconSlice";
	import { modal_menuModify } from "../../store/modalSlice";
    import { inPage } from "../../store/pageSlice";

    export let subMenus;
    export let sortOn;
    export let subMenu_moveOn;
    export let change_subMenu_moveOn;
    export let change_menuOn;

    let downOn = false;
    let initX = 0; // 아이콘 클릭 시 첫 x
    let initY = 0; // 아이콘 클릭 시 첫 y

    const subMenu_mousedown = (e, sMenu) => {
        downOn = true;
        $moveMenu = sMenu;
        initX = e.offsetX;
        initY = e.offsetY;
    }
    const subMenu_mousemove = (e) => {
        let moveX = e.offsetX;
        let moveY = e.offsetY;
        if(downOn && Math.abs(initX - moveX) + Math.abs(initY - moveY) > 15) {
            change_subMenu_moveOn(true);
        }
    }
    const subMenu_mouseup = (e) => {
        $moveMenu = null;
        downOn = false;
        change_subMenu_moveOn(false);
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
            change_menuOn(false);
        } else if(e.target.closest('#iconsWrap')) {
            $moveIcon = $moveMenu;
            change_menuOn(false);
            subMenu_mouseup();
        } else {
            subMenu_mouseup();
        }
    }
</script>

{#each subMenus as subMenu, index}
<li id="mainMenuSubLi">
    <button
        class:sortOn={sortOn}
        title={subMenu.title}
        on:mousedown={(e) => subMenu_mousedown(e, 
            {
                ...subMenu,
            }
        )}
        on:mousemove={(e) => subMenu_mousemove(e)}
        on:click={(e) => {
            $inPage = {
                ...subMenu,
            }
            change_menuOn(false);
            subMenu_mouseup();
        }}
    >
        <i class={`bi ${subMenu.icon} fs-18px`} style={`color:${subMenu.color === 'custom' ? subMenu.customColor : subMenu.color}`}></i>
        {subMenu.title}
        <button class="menu-modify" on:mousedown|stopPropagation 
            on:click|stopPropagation={() => {
                modal_menuModify.open({...subMenu});
                change_menuOn(false);
            }}>
            <i class="bi bi-three-dots fs-24px"></i>
        </button>
    </button>
</li>
{/each}
