<!-- 페이지 -->
<script>
	import { fly } from "svelte/transition";
    import PageResize from "./pageResize.svelte";

    export let view;
    export let viewIdx;
    export let change_view;
    export let cur_zIndex;
    export let max_zIndex;
    export let change_cur_zIndex;
    export let closeView;
    export let menuOn;
    export let fullOn;
    export let change_fullOn;

    let downOn = false; // 클릭이 돼있는지
    let initX = 0; // 아이콘 클릭 시 첫 x
    let initY = 0; // 아이콘 클릭 시 첫 y
    // let lastX = 0; // 아이콘 움직이는동안 x
    // let lastY = 0; // 아이콘 움직이는동안 y

    let resizing = false; // resize 중
    const change_resizing = (v) => {
        resizing = v;
    }

    let mobileOn = window.innerWidth < 768;

    let viewStyle = "";
    // view.maxScreen ? `` : `top:${view.top}px;left:${view.left}px`;

    // change_viewPages 축약
    const c_vps = () => {
        change_view(view);
    }
    const pageMousedown = (e) => {
        if(view.maxScreen) return;
        downOn = true;
        view.zIndex = cur_zIndex++;
        initX = e.clientX;
        initY = e.clientY;
        change_cur_zIndex(cur_zIndex);
        c_vps();
    };
    const pageOut = (e) => {
        if(downOn) {
            downOn = false;
            let lastX = e.clientX - initX;
            let lastY = e.clientY - initY;
            let rX = view.left + lastX;
            let rY = view.top + lastY;
            view.left = rX;
            view.top =  rY;
            let minLeft = 250 - (view.width || 960);
            if(rX < minLeft) view.left = minLeft;
            else if(rX > window.innerWidth - 50) view.left = window.innerWidth - 50;
            if(rY < 0) view.top = 0;
            else if(rY > window.innerHeight - 92) view.top = window.innerHeight - 92
            c_vps();
        }
        // console.log();
        // const trans = page.style.transform.substring(10).replace(/\)|px/g, '').split(', ');
        // const tranX = Number(trans[0]);
        // const tranY = Number(trans[1]);
        // view.tranX = tranX;
        // view.tranY = tranY;
    };
    $: if(downOn) {
        document.addEventListener('mousemove', movePage);
        document.addEventListener('mouseup', pageOut);
        document.addEventListener('mouseleave', pageOut);
    } else {
        document.removeEventListener('mousemove', movePage);
        document.removeEventListener('mouseup', pageOut);
        document.removeEventListener('mouseleave', pageOut);
    }
    const movePage = (e) => {
        const page = document.getElementById("page-"+viewIdx);
        if(0 < e.clientX && e.clientX < window.innerWidth
            && 0 < e.clientY && e.clientY < window.innerHeight - 58
        ) {
            const x = e.clientX - initX;
            const y = e.clientY - initY;
            page.style.transform = `translate(${x}px, ${y}px)`;
        } else pageOut(e);
    }

    $:if(mobileOn) {
        viewStyle = `z-index:${view.zIndex}`;
    } else if(view.pageOn) {
        viewStyle = `z-index:${view.zIndex};${view.maxScreen ? "" : `top:${view.top}px;left:${view.left}px;
                    width:${view.width || 960}px;height:${view.height || 700}px;`};
                    ${resizing ? "transition: all 0s;" : ""}`;
    } else {
        viewStyle = `z-index:${view.zIndex}`;
        setTimeout(() => {
            viewStyle = "";
        }, 30);
    }

</script>

<div id={"page-"+viewIdx} class="page-wrap" class:off={!view.pageOn} 
    class:on={view.pageOn}
    class:moving={downOn || resizing}
    class:max-screen={mobileOn || (view.maxScreen && view.pageOn)}
    class:full={fullOn}
    style={viewStyle}>
    <!-- class:on={pageOnTest} -->
    <div class="page-top">
        <button class="move-btn" 
            on:mousedown={pageMousedown}
            on:mouseup={pageOut}
            on:dblclick={() => {
                view.maxScreen = !view.maxScreen;
                view.zIndex = cur_zIndex++;
                change_cur_zIndex(cur_zIndex);
                c_vps();
            }}>
            <i class={`bi ${view.icon} fs-24px`} style={`color:${view.color === 'custom' ? view.customColor : view.color}`} />
            {view.type + ") " + view.title}
        </button>
        <div class="right-wrap">
            <button on:click={() => {
                view.pageOn = false;
                view.zIndex = 0;
                c_vps();
            }}>─</button>
            {#if !mobileOn}
            <button on:click={() => {
                if(max_zIndex == view.zIndex) {
                    view.maxScreen = !view.maxScreen;
                }
                view.zIndex = cur_zIndex++;
                change_cur_zIndex(cur_zIndex);
                c_vps();
            }}>
                {#if view.maxScreen}
                <span class="material-symbols-outlined">stack</span>
                {:else}
                <span class="material-symbols-outlined">check_box_outline_blank</span>
                {/if}
            </button>
            {/if}
            {#if view.maxScreen}
            <button on:click={() => {
                change_fullOn(true);
            }}>
                <span class="material-symbols-outlined">open_with</span>
            </button>
            {/if}
            <button on:click={() => {
                view.pageOn = false;
                c_vps();
                closeView(viewIdx);
            }}>×</button>
        </div>
    </div>
    <div class="page-screen">
        {#if max_zIndex != view.zIndex || downOn || menuOn || resizing}
        <button class="page-cover" on:click={() => {
            view.zIndex = cur_zIndex++;
            change_cur_zIndex(cur_zIndex);
            c_vps();
        }}></button>
        {/if}
        <!--  -->
        <!-- <iframe src={view.frame} title="12321" 
        frameborder="0"></iframe> -->
        <!--  -->
    </div>
    {#if !view.maxScreen}
    <PageResize parentId={"page-"+viewIdx} {view} {change_view} {change_resizing}/>
    {/if}
    {#if fullOn}
    <button in:fly={{
        y:-100,
    }} class="full-close" on:click={() => {
        change_fullOn(false);
    }}>X</button>
    {/if}
</div>

