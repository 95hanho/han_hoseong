<script>
	import { fade } from 'svelte/transition';
	import { popup_command, scheduleList } from "../../store/popupSlice";
	import { onMount } from 'svelte';
	import { getSchedules, setSchedules } from '../../compositions/api';

  let goal_txt = ""; // 목표 텍스트
  let goal_focus = false;
  let noCompleteNum = 0;
  // 목표 제출
  const goal_submit_before = (e) => {
    e.preventDefault();
    if(goal_txt.length > 1) {
        const idx = $scheduleList.length > 0 ? $scheduleList[$scheduleList.length - 1].idx + 1 : 0;
        $scheduleList.push({
          idx,
          name: goal_txt,
          date: new Date().toISOString().substring(0, 10),
          complete: false,
        });
        setSchedules($scheduleList);
        goal_txt = "";
        make_scheduleList();
    }
  }
  const todayschedule_focus = () => {
      goal_focus = true;
  }
  const todayschedule_focusout = () => {
      goal_focus = false;
  }

	let now = new Date();
	let today_scheduleList = [];
  let today_scheduleListView = [];
  const make_scheduleList = () => {
		today_scheduleList = [];
    today_scheduleListView = [];
    noCompleteNum = 0;
		$scheduleList.map((v) => {
			if(!v.complete) {
				if(v.date.toString().substring(0, 10) == now.toISOString().substring(0, 10)) {
          today_scheduleListView.push(true);
					today_scheduleList.push(v);
				} else if(new Date(v.date.toString().substring(0, 10)) < new Date(now.toISOString().substring(0, 10))) {
          noCompleteNum++;
        }
			}
		});
	}

  $: if($scheduleList) {
    make_scheduleList();
  }

  onMount(() => {
    $scheduleList = getSchedules();
    make_scheduleList();
  });
</script>

{#if today_scheduleList.length === 0}
<div class="todayschedule add-shadow"
    in:fade={{duration:500}} out:fade={{duration:200}}>
    <form class="bottom-ment" on:submit={goal_submit_before}>
        <h4>하루 목표를 세우고 시작해볼까?</h4>
        <input type="text" class="goal_txt" bind:value={goal_txt} on:focus={todayschedule_focus} on:focusout={todayschedule_focusout}>
        {#if goal_txt.length > 4}
        <button type="submit" class:focus={goal_focus}>
            <i class="bi bi-arrow-left-circle-fill fs-24px"></i>
        </button>
        {/if}
    </form>
</div>
{:else}
<div class="schedule add-shadow" in:fade={{duration:500}} out:fade={{duration:200}}>
    <h3>Today Work</h3>
    <h6><button on:click={() => {
      $popup_command = 1;
    }}>이전 미완료) {noCompleteNum}건</button></h6>
    <div class="schedule-list">
        <ul>
            {#each today_scheduleList as schedule, sIdx}
            {#if today_scheduleListView[sIdx]}
            <li on:click={() => {
              setTimeout(() => {
                today_scheduleListView[sIdx] = false;
                today_scheduleListView = today_scheduleListView;
                make_scheduleList();
              }, 1000);
            }} out:fade={{duration:1000}}>
                <label class="checkbox-wrap" for={"schedule" + schedule.idx}>
                  <label class="round-checkbox" 
                  class:checked={schedule.complete}>
                    <input type="checkbox" id={"schedule" + schedule.idx} 
                      bind:checked={schedule.complete}> 
                    <span class="marking"></span>
                  </label>
                </label>
                <label class="work" for={"schedule" + schedule.idx}>
                    <span class="title">{schedule.name}</span>
                    <div class="clock">{schedule.date.substring(11)}</div>
                </label>
            </li>
            {/if}
            {/each}
        </ul>
    </div>
</div>
{/if}