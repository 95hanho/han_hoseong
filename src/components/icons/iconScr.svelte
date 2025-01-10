<!-- 아이콘이 보이지 않는 범위 있을 시 스크롤버튼 -->
<script>
    import { folderUi } from "../../lib/ui";

    export let iconMoveOn;

    let scrLeftIndex = null;
    let scrRightIndex = null;
    let scrTopIndex = null;
    let scrBottomIndex = null;
    const actScrLeft = (leftOn) => {
        if(iconMoveOn) {
            scrLeftIndex = folderUi.scrSideMove(leftOn);
        }
    }
    const actScrRight = (leftOn) => {
        if(iconMoveOn) {
            scrRightIndex = folderUi.scrSideMove(leftOn);
        }
    }
    const actScrTop = (topOn) => {
        if(iconMoveOn) {
            scrTopIndex = folderUi.scrTboMove(topOn);
        }
    }
    const actScrBottom = (topOn) => {
        if(iconMoveOn) {
            scrBottomIndex = folderUi.scrTboMove(topOn);
        }
    }
    const endScr = () => {
        clearInterval(scrLeftIndex);
        clearInterval(scrRightIndex);
        clearInterval(scrTopIndex);
        clearInterval(scrBottomIndex);
    }
</script>

<section id="iconsScr">
    <div class="side left">
        <button on:click={() => folderUi.clickSideScr(true)}
            on:mouseover={() => actScrLeft(true)}
            on:mouseleave={endScr}
            on:touchstart={() => actScrLeft(true)}
            on:touchend={endScr}
            on:touchcancel={endScr}>
            <i class="bi bi-chevron-double-left"></i>
        </button>
    </div>
    <div class="side right">
        <button on:click={() => folderUi.clickSideScr(false)}
            on:mouseenter={() => actScrRight(false)}
            on:mouseleave={endScr}
            on:touchstart={() => actScrRight(false)}
            on:touchend={endScr}
            on:touchcancel={endScr}>
            <i class="bi bi-chevron-double-right"></i>
        </button>
    </div>
    <!-- {#if iconMoveOn} -->
    <div class="tbo top">
        <button on:click={() => folderUi.clickTboScr(true)}
            on:mouseenter={() => actScrTop(true)}
            on:mouseleave={endScr}
            on:touchstart={() => actScrTop(true)}
            on:touchend={endScr}
            on:touchcancel={endScr}>
            <i class="bi bi-chevron-double-up"></i>
        </button>
    </div>
    <div class="tbo bottom">
        <button on:click={() => folderUi.clickTboScr(false)}
            on:mouseenter={() => actScrBottom(false)}
            on:mouseleave={endScr}
            on:touchstart={() => actScrBottom(false)}
            on:touchend={endScr}
            on:touchcancel={endScr}>
            <i class="bi bi-chevron-double-down"></i>
        </button>
    </div>
    <!-- {/if} -->
    
</section>