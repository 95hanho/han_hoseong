<!-- todolist, 베너조작, 알람 등의 팝업관리 -->
<script>
	import { popup_command } from "../../store/popupSlice";
	import AlertFooter from "../footer/alertFooter.svelte";
	import BannerFooter from "../footer/bannerFooter.svelte";
	import ScheduleFooter from "../footer/scheduleFooter.svelte";

  // 팝업창 열기
  const footerPopupOn = (number) => {
    if(popupOnNum === number) {
        popupOnNum = 0;
        document.removeEventListener('mousedown', outClickPopupOff);
    } else {
        popupOnNum = number;
        document.addEventListener('mousedown', outClickPopupOff);
    }
  }
  // 바깥쪽 클릭 시 닫힘
  const outClickPopupOff = (e) => {
      if((!e.target.closest('.app-popup') && !e.target.closest('.module'))) {
          if (popupOnNum == 1 && e.target.closest('.flatpickr-calendar')) return;
          popupOnNum = 0;
          document.removeEventListener('mousedown', outClickPopupOff);
      }
  }

  let popupOnNum = 0;
  /* 스케줄 관련 */
  let scheduleView_store = [];
  const change_scheduleView_store = (v) => {
      scheduleView_store = v;
  };

  $: if($popup_command) {
    footerPopupOn($popup_command);
    $popup_command = 0;
  }

</script>

<div id="popupMain">
  <div class="popup-btns">
    <div class="module">
      <button on:click={() => footerPopupOn(1)}>
          <i class="bi bi-calendar2-check-fill fs-30px"></i>
      </button>
    </div>
    <div class="module">
        <button on:click={() => footerPopupOn(2)}>
            <i class="bi bi-card-checklist fs-34px"></i>
        </button>
    </div>
    <div class="module">
        <button on:click={() => footerPopupOn(3)}>
            <i class="bi bi-bell-fill fs-30px"></i>
            <span>99+</span>
        </button>
    </div>
  </div>
  {#if popupOnNum === 1}
  <ScheduleFooter {scheduleView_store} {change_scheduleView_store}/>
  {:else if popupOnNum === 2}
  <BannerFooter />
  {:else if popupOnNum === 3}
  <AlertFooter />
  {/if}
</div>
