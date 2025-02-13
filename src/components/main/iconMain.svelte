<!-- 바탕화면 아이콘 화면 -->
<script>
	import { commonService } from './../../api/index.js';
	import { moveIcon } from '../../store/iconSlice.js';
	import { inPage } from '../../store/pageSlice.js';
    import ico_quick_home from '../../assets/img/ico_quick_home.png';
    import { onMount } from 'svelte';
    import { initCalcWidthHeight, folderUi } from '../../lib/ui.js';
    import { scale, fade } from 'svelte/transition';
    import IconScr from '../icons/iconScr.svelte';
	import { modal_confirm, modal_confirm_result } from '../../store/modalSlice.js';

    let icons = []; // 아이콘
    let existIcons = []; // 존재하는 아이콘리스트
    let initX = 0; // 아이콘 클릭 시 첫 x
    let initY = 0; // 아이콘 클릭 시 첫 y
    let downRow = -1; // 마우스다운 시의 아이콘 행
    let downCol = -1; // 마우스다운 시의 아이콘 열
    let moveX = 0; // 아이콘 움직이는동안 x
    let moveY = 0; // 아이콘 움직이는동안 y
    let movingRow = -1; // 이동시킬 아이콘 행
    let movingCol = -1; // 이동시킬 아이콘 열
    let movingIcon = {}; // 무빙 중인 아이콘
    let icon_target = null;
    let downOn = false; // 클릭이 돼있는지
    let iconMoveOn = false; // 아이콘 무빙 중인지
    let childDownOn = false; // 폴더 안에서 아이콘 마우스 다운여부
    let movingChildIdx = -1;

    let openIndexs = [];
    let openFolderEle = null; // 폴더 오픈될 때 Ele
    let folderRenameIndex = null; // 폴더 이름변경 버튼 나타내기 setTimeout
    let folderPositionNum = 0; // 폴더가 열릴 때 공간이 오른쪽이나 밑으로 넘치는지
    // => 1 : 안넘침, 2: width넘침, 3: height넘침, 4: width,height넘침

    let overRow = false;
    let overCol = false;
    let maxIconsLengs = {};
    let completeIcons = null; // 아이콘 완성
    let fromMenuIcon = false; // 메뉴에서 아이콘이 왔는지

    let folder_opening = false; // 폴더가 열린 상태인지


    /* 테스트 아이콘 데이터 */
    let iconData = {
        icons : [
            // {
            //     row:0,
            //     col:1,
            //     title: "자유게시판",
            //     type: "Intra",
            //     frame: "https://eaintra.exc.co.kr/allbbs/list.asp",
            //     parent: "정보공유",
            //     menu_id: 1022
            // }
        ]
    };
    // 아이콘 mousedown
    const icon_mousedown = (e, row, col, children) => {
        if(e.target.classList.contains('icon-child') || e.target.closest('.icon-child')) {
            return;
        }
        icon_target = e.target;
        downOn = true;
        initX = e.offsetX;
        initY = e.offsetY;
        downRow = row;
        downCol = col;
        // console.log('DOWN', x, y, e);
    }
    // folder안의 아이콘 mousedown
    const folderIcon_mousedown = (e, row, col, childIdx) => {
        e.stopPropagation();
        childDownOn = true;
        initX = e.offsetX;
        initY = e.offsetY;
        downRow = row;
        downCol = col;
        movingChildIdx = childIdx;
    }
    // 아이콘 mousemove
    const icon_mousemove = (e, row, col, childIdx) => {
        moveX = e.offsetX;
        moveY = e.offsetY;
        if(childDownOn && !e.target.classList.contains('icon-child') 
        && !e.target.closest('.icon-child')) {
            icons[downRow][downCol].folderOn = false;
        }
        if(childDownOn && downRow === row && downCol === col
        && Math.abs(initX - moveX) + Math.abs(initY - moveY) > 15
            && icons[row][col]?.children[childIdx]) {
            movingRow = row;
            movingCol = col;
            movingIcon = icons[movingRow][movingCol].children[movingChildIdx];
            iconMoveOn = true;
        } else if(downOn && downRow === row && downCol === col
        && Math.abs(initX - moveX) + Math.abs(initY - moveY) > 15
            && icons[row][col]) {
            movingRow = row;
            movingCol = col;
            movingIcon = icons[movingRow][movingCol];
            iconMoveOn = true;
        } else if(fromMenuIcon && Object.keys(movingIcon).length > 0) {
            movingRow = row;
            movingCol = col;
            iconMoveOn = true;
        }
    }
    // 아이콘 mouseup
    const icon_mouseup = async (e, row, col) => {
        if(row == undefined && col == undefined) {
            resetMove();
            return;
        }
        if(e.target.classList.contains('icon-child') || e.target.closest('.icon-child')) {
            resetMove();
            return;
        }
        if(downRow !== row || downCol !== col) {
            // 폴더 안에서 바깥으로 옮기기
            if(childDownOn && iconMoveOn && !icons[row][col]) {
                icons[row][col] = movingIcon;
                icons[movingRow][movingCol].children = 
                    icons[movingRow][movingCol].children.filter((v, i) => i !== movingChildIdx);
                await commonService.set_icon({
                    ...movingIcon,
                    row, col,
                    folder_icon_id: 0, folder_child_order: 0,
                    type: "update_icon",
                });
            }
            // 아이콘 빈곳으로 위치 옮기기
            else if(downOn && iconMoveOn && !icons[row][col]) {
                icons[row][col] = movingIcon;
                icons[movingRow][movingCol] = null;
                await commonService.set_icon({
                    ...movingIcon,
                    row, col,
                    type: "update_icon",
                });
            }
            // 아이콘 폴더 안에 넣기
            else if(downOn && iconMoveOn && icons[row][col].folder && !icons[movingRow][movingCol].folder) {
                if(icons[row][col].children.length < 6) {
                    icons[row][col].children.push(movingIcon);
                    icons[movingRow][movingCol] = null;
                    await commonService.set_icon({
                        ...movingIcon,
                        folder_icon_id: icons[row][col].icon_id,
                        folder_child_order: icons[row][col].children.length,
                        type: "update_icon",
                    });
                } else {
                    alert('디렉토리 안에 아이콘은 6개까지만 넣을 수 있습니다.');
                }
            }
            // 아이콘 위치 서로 바꾸기
            else if(downOn && iconMoveOn && icons[row][col]) {
                let moving_icon = icons[movingRow][movingCol];
                let existing_icon = icons[row][col];
                [icons[row][col], icons[movingRow][movingCol]]
                = [icons[movingRow][movingCol], icons[row][col]];
                await commonService.set_icon({
                    ...moving_icon,
                    row:existing_icon.row,
                    col:existing_icon.col,
                    type: "update_icon",
                });
                await commonService.set_icon({
                    ...existing_icon,
                    row:moving_icon.row,
                    col:moving_icon.col,
                    type: "update_icon",
                });
            }
            // win메뉴에서 아이콘 가져오기
            else if(fromMenuIcon && iconMoveOn && !icons[row][col]?.folder) {
                console.log('win메뉴에서 아이콘 가져오기');
                const new_icon = {...movingIcon, row, col}
                await commonService.set_icon({
                    ...new_icon,
                    type: "create_icon",
                }).then((data) => {
                    new_icon.icon_id = data.icon_id;
                });
                icons[row][col] = new_icon;
            }
            // win메뉴에서 아이콘을 폴더 안에 넣기
            else if(fromMenuIcon && iconMoveOn && icons[row][col]?.folder) {
                console.log('win메뉴에서 아이콘을 폴더 안에 넣기');
                icons[row][col].children.push(movingIcon);
                const new_icon = {...movingIcon,
                    folder_icon_id: icons[row][col].icon_id,
                    folder_child_order: icons[row][col].children.length,
                }
                await commonService.set_icon({
                    ...new_icon,
                    type: "create_icon",
                }).then((data) => {
                    new_icon.icon_id = data.icon_id;
                });
            }
        }
        // iconData = iconData;
        // icons_wrap_making();
        resetMove();
    }
    // folder안의 아이콘 mouseup
    const folderIcon_mouseup = async (e, row, col, childIdx) => {
        e.stopPropagation();
        // folder 안에서 위치(순서) 바꾸기
        if(iconMoveOn && icons[row][col] === icons[movingRow][movingCol] && (movingChildIdx !== childIdx)) {
            const moving_icon = icons[row][col].children[movingChildIdx];
            const existing_icon = icons[row][col].children[childIdx];
            const moving_order = childIdx + 1;
            const existing_order = movingChildIdx + 1;
            [icons[row][col].children[movingChildIdx], icons[row][col].children[childIdx]]
            = [icons[row][col].children[childIdx], icons[row][col].children[movingChildIdx]]
            await commonService.set_icon({
                ...moving_icon,
                folder_child_order: moving_order,
                type: "update_icon",
            });
            await commonService.set_icon({
                ...existing_icon,
                folder_child_order: existing_order,
                type: "update_icon",
            });
        }
        resetMove();
    }
    // 아이콘 삭제
    let folder_delete_store = {};
    const icon_delete = () => {
        const moving_icon = icons[movingRow][movingCol];
        if(moving_icon.folder && moving_icon.children.length > 0) {
            folder_delete_store.row = movingRow;
            folder_delete_store.col = movingCol;
            folder_delete_store.icon_id = icons[movingRow][movingCol]?.icon_id;
            modal_confirm.open(`
                폴더 안의 아이콘도 같이 삭제됩니다.<br />
                삭제하시겠습니까??
                `, "folder_n_child_delete");
            return;
        }
        if(iconMoveOn) {
            let del_icon_id = icons[movingRow][movingCol]?.icon_id;
            // 폴더 안에 있는거 삭제 시
            if(childDownOn) {
                icons[movingRow][movingCol].children
                    = icons[movingRow][movingCol].children.filter((v, i) => i !== movingChildIdx);
            } 
            // 밖에 있는거 삭제 시
            else if(downOn) {
                icons[movingRow][movingCol] = null;
            }
            commonService.delete_icon({icon_id:del_icon_id});
            resetMove();
        }
    }
    $:if($modal_confirm_result == "folder_n_child_delete") {
        icons[folder_delete_store.row][folder_delete_store.col].children.map((v) => {
            commonService.delete_icon({icon_id:v.icon_id});
        });
        commonService.delete_icon({icon_id:folder_delete_store.icon_id});
        icons[folder_delete_store.row][folder_delete_store.col] = null;
        $modal_confirm_result = "";
    }
    // 무브 리셋
    const resetMove = () => {
        icon_target = null;
        downOn = false;
        fromMenuIcon = false;
        childDownOn = false;
        iconMoveOn = false;
        downRow = -1;
        downCol = -1;
        movingRow = -1;
        movingCol = -1;
        movingChildIdx = -1;
        movingIcon = {};
    }
    // 아이콘 드래그이동중
    $: if(iconMoveOn) {
        document.addEventListener('mousemove', iconMoveOnFnc);
        document.addEventListener('mouseup', icon_mouseup);
    } else {
        document.removeEventListener('mousemove', iconMoveOnFnc);
        document.removeEventListener('mouseup', icon_mouseup);
    }
    // 아이콘 드래그이동중 잔상보이게하기
    const iconMoveOnFnc = (e) => {
        const follower = document.getElementById('follower');
        const x = e.clientX;
        const y = e.clientY;
        follower.style.transform = `translate(${x}px, ${y}px)`;
    }
    // 아이콘 디렉토리 추가
    const folderAdd = async () => {
        let breakOn = false;
        for(let i = 0; i < icons.length; i++) {
            for(let j = 0; j < icons[i].length; j++) {
                if(!icons[i][j]) {
                    let newFolderIcon = {
                        row:i,
                        col:j,
                        folder:true,
                        folder_name:'새폴더',
                        children: [
                        ],
                        folderOn:false,
                    };
                    icons[i][j] = newFolderIcon;
                    iconData.icons.push(newFolderIcon);
                    await commonService.set_icon({
                        ...newFolderIcon,
                        type:'create_folder',
                    }).then((data) => {
                        newFolderIcon.icon_id = data.icon_id;
                    });
                    breakOn = true;
                    break;
                }
            }
            if(breakOn) break;
        }
    }
    // 폴더 열었을 떄
    $:if(openFolderEle) {
        setTimeout(() => {
            document.addEventListener('mousedown', closeFolder);
        }, 500);
    }
    // 폴더 닫는 이벤트
    const closeFolder = (e) => {
        if(folderUi.folderOutClick(e.target)) {
            icons[openIndexs[0]][openIndexs[1]].folderOn = false;
            folder_opening = false;
            document.removeEventListener('mousedown', closeFolder);
        }
    }
    // 아이콘 완성되면
    $:if(completeIcons) {
        folderUi.maxScrollCalc(overCol, overRow);
    }
    // 화면 아이콘 공간 만들기
    let icons_wrap_making_index = null;
    const icons_wrap_making = () => {
        clearTimeout(icons_wrap_making_index);
        icons_wrap_making_index = setTimeout(() => {
            maxIconsLengs = initCalcWidthHeight();
            overRow = false;
            overCol = false;
            let maxRow = 0;
            let maxCol = 0;
            iconData.icons.map((v) => {
                if(maxRow < v.row) maxRow = v.row;
                if(maxCol < v.col) maxCol = v.col;
            });
            if(maxRow + 1 >= maxIconsLengs.rowLeng) {
                overRow = true;
                maxIconsLengs.rowLeng = maxRow + 1;
            }
            if(maxCol + 1 >= maxIconsLengs.colLeng) {
                overCol = true;
                maxIconsLengs.colLeng = maxCol + 1;
            }
            icons = [];
            for(let i = 0; i < maxIconsLengs.rowLeng; i++) {
                icons.push(new Array(maxIconsLengs.colLeng).fill(null));
            }
            existIcons = [];
            iconData.icons.map((v, i) => {
                icons[v.row][v.col] = v;
                if(!v.folder) existIcons.push(v);
            });
            // folderUi.maxScrollCalc(overCol, overRow);
            document.getElementById('wrapper').removeEventListener('scroll', folderUi.iconSideScrShowHide);
            if(overCol) {
                document.getElementById('wrapper').addEventListener('scroll', folderUi.iconSideScrShowHide);
            }
            document.getElementById('wrapper').removeEventListener('scroll', folderUi.iconTboScrShowHide);
            if(overRow) {
                document.getElementById('wrapper').addEventListener('scroll', folderUi.iconTboScrShowHide);
            }
        }, 500);
    }
    // 아이콘 무브 추가
    // viewPage 추가하기
    $:if($moveIcon) {
        if(existIcons.some((v) => v.menu_id === $moveIcon.menu_id)) {
            alert('이미 존재하는 아이콘입니다.\n삭제 후 진행해주세요.');
        } else {
            $moveIcon.idx = iconData.icons.length;
            movingIcon = $moveIcon;
            fromMenuIcon = true;
            iconMoveOn = true;
        }
        $moveIcon = null;
    }
    // test
    const test = (e, b, c) => {
        e.stopPropagation();
        console.log('test', e, b, c);
    }
    let init = true;
    $: if(iconData.icons.length > 0) {
        // iconData.icons가 바뀔 때 저장해 줬었음.
        change_icons();
    }
    const change_icons = () => {
        // if(!init) commonService.set_icons(iconData.icons);
    }
    
    $: console.log("iconData.icons", iconData.icons);
    // $: console.log("icons", icons);
    onMount(async () => {
        // iconData.icons = commonService.getIcons();
        iconData.icons = await commonService.get_icons();
        setTimeout(() => {
            init = false;
        }, 50);
        icons_wrap_making();
        window.addEventListener('resize', icons_wrap_making);
    });
</script>

<section id="iconsWrap" style={`width:${overCol ? maxIconsLengs.colLeng * 120 + "px" : "100%"};
    overflow-x:${overCol ? 'scroll' : 'hidden'};
    height:${overRow ? maxIconsLengs.rowLeng * 120 + "px" : "calc(100% - 58px)"};
    z-index:${folder_opening ? "3" : "2"}`}>
    <div class="lefttop-btn">
        <button class="folder-add" class:iconMoveOn={iconMoveOn}
            on:click={folderAdd} on:mouseup={icon_delete}>
            {#if iconMoveOn}
            <i class="bi bi-trash fs-24px c_red"></i>
            <span>DELETE</span>
            {:else}
            <i class="bi bi-folder-plus fs-24px"></i>
            <span>ADD</span>
            {/if}
        </button>
    </div>
    {#each icons as colIcons, row}
    <ul style={`width:${maxIconsLengs.colLeng * 120 + 'px'}`}>
        {#each colIcons as icon, col}
        <li>
            <button
                class="icon-btn"
                class:icon-act={icon}
                class:add-shadow={icon}
                class:moving={iconMoveOn}
                on:mousedown={(e) => icon_mousedown(e, row, col)}
                on:mousemove={(e) => icon_mousemove(e, row, col)}
                on:mouseup={(e) => icon_mouseup(e, row, col)}
                on:dblclick={(e) => {
                    if(!icon) return;
                    if(icon?.folder) {
                        folderPositionNum = folderUi.folderPosition(e.target.closest('button'));
                        icon.folderOn = true;
                        folder_opening = true;
                        openIndexs = [row, col];
                    } else {
                        $inPage = {
                            ...icon
                        }
                    }
                }}
                on:touchstart={(e) => {
                    if(!icon) return;
                    if(icon?.folder) {
                        folderPositionNum = folderUi.folderPosition(e.target.closest('button'));
                        icon.folderOn = true;
                        openIndexs = [row, col];
                    } else {
                        $inPage = {
                            ...icon
                        }
                    }
                }}>
                {#if icon}
                    {#if icon.folder}
                    <div class="dir-icon">
                        <i class="bi bi-folder fs-64px"></i>
                    </div>
                    {:else if icon.icon}
                    <div class="dir-icon">
                        <i class={`bi ${icon.icon} fs-64px`} style={`color:${icon.color === 'custom' ? icon.customColor : icon.color}`}/>
                    </div>
                    {:else}
                    <div class="icon-img">
                        <img src={ico_quick_home} alt="">
                    </div>
                    {/if}
                    <div class="icon-name">
                        <p>{icon.folder ? icon.folder_name : icon.name}</p>
                    </div>
                {/if}
            </button>
            {#if icon && icon?.folder && icon?.folderOn}
                <div class="icon-child" in:scale={{duration: 500, start: 1.2}}
                    out:fade={{duration:500}}
                    bind:this={openFolderEle}
                    class:three={icon.children.length > 4}
                    class:no-over={folderPositionNum == 1}
                    class:over-width={folderPositionNum == 2}
                    class:over-height={folderPositionNum == 3}
                    class:over-all={folderPositionNum == 4}
                    class:over-title={folderPositionNum == 5}
                    class:over-titleWidth={folderPositionNum == 6}
                >
                    <div class="icon-child-rename">
                        <input type="text" bind:value={icon.folder_name} on:change={(e) => {
                            commonService.set_icon({
                                ...icon,
                                type:"update_icon",
                            });
                        }}>
                    </div>
                    <ul>
                        {#each icon.children as childIcon, childIdx}
                        <li>
                            <button class="icon-act"
                            on:mousedown={(e) => folderIcon_mousedown(e, row, col, childIdx)}
                            on:mousemove={(e) => icon_mousemove(e, row, col, childIdx)}
                            on:mouseup={(e) => folderIcon_mouseup(e, row, col, childIdx)}
                            on:dblclick={(e) => {
                                $inPage = {
                                    ...childIcon
                                }
                            }}
                            >
                                {#if childIcon.icon}
                                <div class="dir-icon">
                                    <i class={`bi ${childIcon.icon} fs-64px`} style={`color:${childIcon.color === 'custom' ? childIcon.customColor : childIcon.color}`}/>
                                </div>
                                {:else}
                                <div class="icon-img">
                                    <img src={ico_quick_home} alt="">
                                </div>
                                {/if}
                                
                                <div class="icon-name"><p>{childIcon.name}</p></div>
                            </button>
                        </li>
                        {/each}
                    </ul>
                </div>
            {/if}
        </li>
        {/each}
        <li class="hide" bind:this={completeIcons}></li>
    </ul>
    {/each}
    <!-- 폴더 드래그 시 따라다니는 유령그림 -->
    {#if movingRow > -1 && movingCol > -1}
    <div id="follower" class="pointer-space icon add-shadow">
        {#if movingIcon.folder}
        <div class="dir-icon">
            <i class="bi bi-folder fs-48px"></i>
        </div>
        {:else if !movingIcon.icon}
        <div class="icon-img">
            <img src={ico_quick_home} alt="">
        </div>
        {:else if movingIcon.icon}
        <div class="icon-img">
            <i class={`bi ${movingIcon.icon} fs-48px`} style={`color:${movingIcon.color === 'custom' ? movingIcon.customColor : movingIcon.color}`}/>
        </div>
        {/if}
        <div class="icon-name">
            <p>{movingIcon.folder ? movingIcon.folder_name : movingIcon.name}</p>
        </div>
    </div>
    {/if}
</section>
<IconScr {iconMoveOn} />
