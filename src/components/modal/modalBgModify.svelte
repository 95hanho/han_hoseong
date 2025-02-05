<script>
	import { commonService } from './../../api/index.js';
  import { bg_info, modal_bgModify } from '../../store/modalSlice.js';
  import { modalUI } from '../../lib/ui.js';
  import bg_ex1 from '../../assets/img/bg/coming-soon.jpg';
  import bg_ex2 from '../../assets/img/bg/cover-1.jpg';
  import bg_ex3 from '../../assets/img/bg/cover-9.jpg';
  import bg_ex4 from '../../assets/img/bg/cover.jpg';
  import bg_ex5 from '../../assets/img/bg/post-5.jpg';
	import { slide } from 'svelte/transition';

/* 모달 기본설정 */
  let modalEle = null;
  let closeBtn = null;
  const { close } = modal_bgModify;
  let setting_bg = {};
  // 사이즈 체크박스
  $:sizeChecked = setting_bg["background-size"] === "cover"
  // 위치체크박스
  $:positionChecked = setting_bg["background-position"] === "center"
  // 프리뷰 스타일
  $: bg_style = Object.entries(setting_bg).reduce((acc, cur) => {
      if(cur[0] === "background-image") {
        acc += cur[0] + ":url(" + cur[1] + ");";
      } else {
        acc += cur[0] + ":" + cur[1] + ";";
      }
        return acc;
    }, '');
  let sizeX = 0;
  let sizeY = 0;
  $:if(setting_bg["background-size"] !== "cover") {
    setting_bg["background-size"] = `${sizeX / 2}px ${sizeY / 2}px`;
  }
  let positionX = 0;
  let positionY = 0;
  $:if(setting_bg["background-position"] !== "center") {
    setting_bg["background-position"] = `${positionX}% ${positionY}%`;
  }
  let customColor = "";

  let bg_imageList = [];
  bg_imageList.push(bg_ex1, bg_ex2, bg_ex3, bg_ex4, bg_ex5);

  $: if($modal_bgModify) {
      modalUI.open(modalEle);
    //   closeBtn.focus();
      setting_bg = $bg_info;
      console.log(setting_bg);
      reset();
      document.addEventListener('keydown', escClose);
  } else {
      modalUI.close(modalEle);
      document.removeEventListener('keydown', escClose);
  }
  const escClose = (e) => {
      if(e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
          close();
      }
  }
    /* 모달 기본설정 */

  // 값/설정 초기화
  const reset = () => {
    sizeX = 0;
    sizeY = 0;
    positionX = 0;
    positionY = 0;
    customColor = "";
  }

  // 아이콘수정
  const modify = (e) => {
    e.preventDefault();
    close();
    $bg_info = {
      ...$bg_info,
      ["background-image"]: setting_bg["background-image"],
      ["background-size"]: setting_bg["background-size"] === "cover" ? "cover" : `${sizeX}px ${sizeY}px`,
      ["background-position"]: setting_bg["background-position"] === "center" ? "center" : `${positionX}% ${positionY}%`,
      ["background-color"]: setting_bg["background-color"] !== 'custom' ? setting_bg["background-color"] : customColor,
    }
    commonService.setBgInfo($bg_info);
  }

</script>

<div class="modal" bind:this={modalEle}>
    <button
        class="modal-background"
        on:click={() => close()}
    ></button>
    <div class="modal-board">
        <div class="modal-content">
        <div class="modal-title">배경화면 설정</div>
            <div id="modalBgContent" class="modal-con">
                <!-- 설정창 -->
                <div class="panel panel-inverse" data-sortable-id="form-stuff-1" data-init="true">
                    <!-- BEGIN panel-body -->
                    <div class="panel-body">
                        <div class="row mb-15px flex_center">
                          <button on:click={(e) => {
                            const ele = document.getElementById('bgList');
                            const scrEle = document.getElementById('modalBgContent');
                            scrEle.scrollTo({
                              top: ele.offsetTop,
                              behavior: "instant", // 부드러운 스크롤
                            });
                          }} class="bg-preview" class:on={setting_bg["background-image"]} style={bg_style} />
                        </div>
                        <!--  -->
                        <div class="row mb-15px">
                          <label for="123" class="form-label col-form-label col-md-2">배경 사이즈 </label>
                          <div class="col-md-3 flex_center">
                            <label for="bgSize">사이즈 채우기</label>
                          </div>
                          <div class="col-md-1 flex_center">
                            <input id="bgSize" type="checkbox" class="form-check-input"
                              bind:checked={sizeChecked}
                              on:change={(e) => {
                                if(!sizeChecked) {
                                  setting_bg["background-size"] = "cover";
                                } else {
                                  setting_bg["background-size"] = "";
                                  sizeX = 50;
                                  sizeY = 50;
                                }
                              }}>
                          </div>
                        </div>
                        {#if setting_bg["background-size"] !== "cover"}
                        <div class="row mb-15px">
                          <label for="123" class="form-label col-form-label col-md-2"></label>
                          <label for="123" class="form-label col-form-label col-md-2 align_center">가로 : </label>
                          <div class="col-md-2">
                            <input type="text" class="form-control" bind:value={sizeX}>
                          </div>
                          <div class="col-md-1 flex_center">px</div>
                          <label for="123" class="form-label col-form-label col-md-2 align_center">세로 : </label>
                          <div class="col-md-2">
                            <input type="text" class="form-control" bind:value={sizeY}>
                          </div>
                          <div class="col-md-1 flex_center">px</div>
                        </div>
                        {/if}
                        <div class="row mb-15px">
                          <label for="123" class="form-label col-form-label col-md-2">배경 위치</label>
                          <div class="col-md-3 flex_center">
                            <label for="bgCenter">중앙 정렬</label>
                          </div>
                          <div class="col-md-1 flex_center">
                            <input id="bgCenter" type="checkbox" class="form-check-input"
                              bind:checked={positionChecked}
                              on:change={(e) => {
                                if(!positionChecked) { 
                                  setting_bg["background-position"] = "center";
                                } else {
                                  setting_bg["background-position"] = "";
                                  positionX = 50;
                                  positionY = 50;
                                }
                              }}>
                          </div>
                        </div>
                        {#if setting_bg["background-position"] !== "center"}
                        <div class="row mb-15px">
                          <label for="123" class="form-label col-form-label col-md-2"></label>
                          <label for="123" class="form-label col-form-label col-md-2 align_center">가로 : </label>
                          <div class="col-md-2">
                            <input type="text" class="form-control" bind:value={positionX}>
                          </div>
                          <div class="col-md-1 flex_center">%</div>
                          <label for="123" class="form-label col-form-label col-md-2 align_center">세로 : </label>
                          <div class="col-md-2">
                            <input type="text" class="form-control" bind:value={positionY}>
                          </div>
                          <div class="col-md-1 flex_center">%</div>
                        </div>
                        {/if}
                        <div class="row mb-15px">
                          <label for="123" class="form-label col-form-label col-md-2">배경색</label>
                          <div class="col-md-4">
                            <select class="form-select" bind:value={setting_bg["background-color"]}
                              on:change={((e) => {
                                if(e.target.value === 'custom') {
                                  customColor = "";
                                }
                              })}>
                              <option style="color:#000" value={undefined}>-기본-</option>
                              <option style="color:#f00" value="#f00">레드</option>
                              <option style="color:#0f0" value="#0f0">그린</option>
                              <option style="color:#00f" value="#00f">블루</option>
                              <option style="color:#ff0" value="#ff0">노랑</option>
                              <option style="color:#fff" value="#fff">하양</option>
                              <option style="color:#fff" value="#eee">그레이</option>
                              <option style="color:#000" value="#000">블랙</option>
                              <option style="color:#000" value="custom">사용자설정</option>
                            </select>
                          </div>
                          {#if setting_bg["background-color"] === 'custom'}
                          <div class="col-md-4">
                            <input type="text" class="form-control" bind:value={customColor}>
                          </div>
                          {/if}
                        </div>
                        {#if setting_bg["background-color"] === 'custom'}
                        <div class="row mb-15px">
                          <div class="col-md-2"></div>
                          <div class="col-md-8">
                            <p class="c_red">* 색상 16진수 값을 입력해주세요.</p>
                          </div>
                        </div>
                        {/if}
                        <div class="row">
                          <div class="col-md-12 align_right">
                              <button class="btn btn-primary w-100px me-5px"
                              on:click={modify}>변경</button>
                              <button type="button" class="btn btn-default w-100px"
                              on:click={() => close()}>취소</button>
                          </div>
                        </div>
                    </div>
                    <!-- END panel-body -->
                </div>
                <!--  -->
                <div class="panel panel-inverse">
                  <div id="bgList" class="panel-heading">
                      <h4 class="panel-title">배경화면 리스트</h4>
                  </div>
                  <div class="row gx-3 bg-list" in:slide={{duration:500}} out:slide={{duration:400}}>
                    {#each bg_imageList as bg_image}
                    <button class:pick={setting_bg["background-image"] == bg_image}
                      on:click={() => {
                      setting_bg["background-image"] = bg_image;
                      const scrEle = document.getElementById('modalBgContent');
                      scrEle.scrollTo({
                        top: 0,
                        behavior: "instant", // 부드러운 스크롤
                      });
                    }}><img src={bg_image} alt=""></button>
                    {/each}
                    <label title="사진추가하기" for="bgAdd">
                      <i class="bi bi-file-earmark-plus-fill fs-50px"></i>
                    </label>
                    <input id="bgAdd" class="hide" type="file" accept="image/*">
                  </div>
                </div>
            </div>
            <div class="modal-btn_wrap">
                <button
                type="button"
                class="modal_close"
                tabindex="0"
                bind:this={closeBtn}
                on:click={() => close()}
                >
                닫기
                </button>
            </div>
        </div>
    </div>
</div>