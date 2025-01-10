<!-- 페이지 사이즈 조절 -->
<script>
  import { onMount } from "svelte";

    export let parentId; // 부모의 ID
    export let view;
    export let change_view;
    export let change_resizing;

    let rsDownOn = false;
    let resizeCase = 0;
    let initX = 0; // 페이지-리사이즈 클릭 시 첫 x
    let initY = 0; // 페이지-리사이즈 클릭 시 첫 y
    let fiveX = 0;
    let fiveY = 0;
    let lastMoveX = 0;
    let lastMoveY = 0;
    let initPageX = 0;
    let initPageY = 0;
    let parentEle = document.getElementById(parentId);
    let pWidth;
    let pHeight;

    // change_viewPages 축약
    const c_vps = () => {
        change_view(view);
    }

    const resizeMousedown = (e, caseNum) => {
        rsDownOn = true;
        resizeCase = caseNum;
        initX = e.clientX;
        initY = e.clientY;
        initPageX = e.offsetX;
        initPageY = e.offsetY;
        pWidth = Number(parentEle.style.width.replace('px', ''));
        pHeight = Number(parentEle.style.height.replace('px', ''));
        change_resizing(true);
    }

    $:if(rsDownOn) {
        document.addEventListener('mousemove', resizeMousemove);
        document.addEventListener('mouseup', resizeMouseup);
    } else {
        document.removeEventListener('mousemove', resizeMousemove);
        document.removeEventListener('mouseup', resizeMouseup);
    }
    const resizeMousemove = (e) => {
        // let pWidth = parentEle.style.width;
        let moveX = e.clientX;
        let moveY = e.clientY;
        let width = pWidth - (initX - moveX);
        let width2 = pWidth + initX - moveX;
        let height = pHeight + initY - moveY;
        let height2 = pHeight - (initY - moveY);
        // let width = moveX - initX + Number(pWidth.replace('px', ''));
        // let height = Number(pHeight.replace('px', '')) + initY - moveY;
        // let height2 = Number(pHeight.replace('px', '')) - (initY - moveY);
        // console.log(height);
        // let top = moveY - initY;
        // view.width = width;
        // view.top = initY + moveY;
        let x = 0;
        let y = 0;
        if(resizeCase == 1 || resizeCase == 6) {
            y = moveY - initY;
            if(300 < height && view.top + y > 0) {
                parentEle.style.transform = `translate(${x}px, ${y}px)`;
                parentEle.style.height = `${height}px`;
                lastMoveY = moveY;
            }
        }
        if(resizeCase == 2 || resizeCase == 6 || resizeCase == 7) {
            if(300 < width && window.innerWidth - view.left - pWidth - 15 - x > 0) {
                parentEle.style.width = `${width}px`;
                lastMoveX = moveX;
            }
        }
        if(resizeCase == 3 || resizeCase == 7 || resizeCase == 8) {
            if(300 < height2 && window.innerHeight - view.top - pHeight - 58 - y > 0) {
                parentEle.style.height = `${height2}px`;
                lastMoveY = moveY;
            }
        }
        if(resizeCase == 4 || resizeCase == 8) {
            x = moveX - initX;
            if(300 < width2 && view.left + x > 0) {
                parentEle.style.transform = `translate(${x}px, ${y}px)`;
                parentEle.style.width = `${width2}px`;
                lastMoveX = moveX;
            }
        }
        if(resizeCase === 5) {
            x = moveX - initX;
            y = moveY - initY;
            if(300 < height && view.top + y > 0) {
                parentEle.style.height = `${height}px`;
                lastMoveY = moveY;
                fiveY = moveY - initY;
            }
            if(300 < width2 && view.left + x > 0) {
                parentEle.style.width = `${width2}px`;
                lastMoveX = moveX;
                fiveX = moveX - initX;
            }
            if(300 < height && view.top + y > 0 || 300 < width2 && view.left + x > 0) {
                parentEle.style.transform = `translate(${fiveX}px, ${fiveY}px)`;
            }
        }
    }
    const resizeMouseup = (e) => {
        let lastX = (lastMoveX || e.clientX) - initX;
        let lastY = (lastMoveY || e.clientY) - initY;
        let rX = view.left + lastX;
        let rY = view.top + lastY;
        if(resizeCase == 1 || resizeCase == 5 || resizeCase == 6) {
            view.top =  rY;
            if(rY < 0) view.top = 0;
            else if(rY > window.innerHeight - 92) view.top = window.innerHeight - 92
        }
        if(resizeCase == 4 || resizeCase == 5 || resizeCase == 8) {
            view.left = rX;
            if(rX < 0) view.left = 0;
            else if(rX > window.innerWidth - 50) view.left = window.innerWidth - 50;
        }
        view.width = Number(parentEle.style.width.replace('px',''));
        view.height = Number(parentEle.style.height.replace('px',''));
        c_vps();
        lastMoveX = 0;
        lastMoveY = 0;
        rsDownOn = false;
        resizeCase = 0;
        change_resizing(false);
    }

    onMount(() => {
        parentEle = document.getElementById(parentId);
    });
</script>

<button class="page-resize-top" 
    on:mousedown={(e) => resizeMousedown(e, 1)}>
</button>
<button class="page-resize-right"
    on:mousedown={(e) => resizeMousedown(e, 2)}>
</button>
<button class="page-resize-bottom"
    on:mousedown={(e) => resizeMousedown(e, 3)}>
</button>
<button class="page-resize-left"
    on:mousedown={(e) => resizeMousedown(e, 4)}>
</button>
<button class="page-resize-topLeft"
    on:mousedown={(e) => resizeMousedown(e, 5)}>
</button>
<button class="page-resize-topRight"
    on:mousedown={(e) => resizeMousedown(e, 6)}>
</button>
<button class="page-resize-bottomRight"
    on:mousedown={(e) => resizeMousedown(e, 7)}>
</button>
<button class="page-resize-bottomLeft"
    on:mousedown={(e) => resizeMousedown(e, 8)}>
</button>