<script>
	import { slide } from 'svelte/transition';
	import { fade } from 'svelte/transition';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { scheduleList } from '../../store/popupSlice';
	import flatpickr from 'flatpickr';
	import 'flatpickr/dist/flatpickr.css';
	import moment from 'moment';
	import { commonService } from '../../api/index';

	export let scheduleView_store;
	const dispatch = createEventDispatcher();

	const test = (e) => {
		let date = e.detail;
		console.log(e, date);
	}
	let timepickerOptions = {
		bgColor: '#000',
	}

	let yDay = new Date();
	yDay.setDate(new Date().getDate() - 1);
	let now = new Date();
	let today = new Date(now.toISOString().substring(0, 10)+' 00:00:00');

	// if(scheduleView_store.length > 0) {
	// 		today_scheduleView = ;
	// 		after_scheduleView = scheduleView_store[2];
	// 		complete_scheduleView = scheduleView_store[3];
	// 	}

	let before_scheduleList = [];
	let before_scheduleView = scheduleView_store[0] != undefined ? scheduleView_store[0] : true;
	let today_scheduleList = [];
	let today_scheduleView = scheduleView_store[1] != undefined ? scheduleView_store[1] : true;
	let after_scheduleList = [];
	let after_scheduleView = scheduleView_store[2] != undefined ? scheduleView_store[2] : true;
	let complete_scheduleList = [];
	let complete_scheduleView = scheduleView_store[3] != undefined ? scheduleView_store[3] : false;
	let complete_allOn = false;
	$: make_scheduleList = () => {
		console.log('make_scheduleList');
		before_scheduleList = [];
		today_scheduleList = [];
		after_scheduleList = [];
		complete_scheduleList = [];
		$scheduleList.map((v) => {
			if(v.complete) {
				if(complete_allOn) {
					complete_scheduleList.push(v);
				} else {
					if(v.date.toString().substring(0, 10) == now.toISOString().substring(0, 10)) {
						complete_scheduleList.push(v);
					}
				}
			} else {
				if(new Date(v.date.toString().substring(0, 10)) < today) {
					before_scheduleList.push(v);
				} else if(v.date.toString().substring(0, 10) == now.toISOString().substring(0, 10)) {
					today_scheduleList.push(v);
				} else if(new Date(v.date.toString().substring(0, 10)) > today) {
					after_scheduleList.push(v);
				}
			}
		});
	}
	$:if($scheduleList) {
		make_scheduleList();
	}
	const scheduleCheck = (e, index) => {
		// console.log(e.target.checked, index);
		$scheduleList[index].complete = e.target.checked;
		commonService.setSchedules($scheduleList);
	}

	let schedule_txt = "";
	let schedule_date = null;
	let date_format = 'YYYY-MM-DD HH:mm';
	// datePicker 초기설정
	const datePickerSetting = {
		enableTime:true,
		time_24hr: true,
		locale: {
				firstDayOfWeek: 0, // 일요일부터 시작
				weekdays: {
						shorthand: ['일', '월', '화', '수', '목', '금', '토'],
						longhand: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
				},
				months: {
						shorthand: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
						longhand: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
				},
		},
		dateFormat: 'Y-m-d H:i',
		enabled: [
				(date) => {
						return !(date.getDay() === 0 || date.getDay() === 6);
				}
		],
		disable: [
				(date) => {
						return (date.getDay() === 0 || date.getDay() === 6);
				}
		],
	}
	// moment(new Date()).format('YYYY-MM-DD HH:mm');
	const scheduleAdd_before = (e) => {
		e.preventDefault();
		if(schedule_txt.length > 1) {
			let in_date = schedule_date || moment(new Date()).format(date_format);
			const idx = $scheduleList.length > 0 ? $scheduleList[$scheduleList.length - 1].idx + 1 : 0;
			$scheduleList.push({
				idx,
				name: schedule_txt,
				date: in_date,
				complete: false,
			});
			scheduleList.set($scheduleList);
			setSchedules($scheduleList);
			schedule_txt = "";
			schedule_date = null;
			flatpickr("#datepicker", {
				...datePickerSetting, 
				defaultDate: new Date(),
				now: new Date(),
			});
		}
	}
	// 업데이트 중인지
	let updateOn = false;
	// 스케줄 업데이트 창으로
	const updateScheduleOn = (inSchedule) => {
			console.log(inSchedule);
			updateOn = true;
			schedule_txt = inSchedule.name;
			schedule_date = inSchedule.date;
			flatpickr("#datepicker", {
				...datePickerSetting, 
				now: new Date(inSchedule.date),
				defaultDate:new Date(inSchedule.date)
			});
	}

	const resetForm = () => {
		updateOn = false;
		schedule_txt = "";
		schedule_date = null;
		flatpickr("#datepicker", {
			...datePickerSetting, 
			defaultDate: new Date(),
			now: new Date(),
		});
	}

	onMount(() => {
		resetForm();
	});
	onDestroy(() => {
		dispatch('change_scheduleView_store', 
			{ value: [before_scheduleView, today_scheduleView, after_scheduleView, complete_scheduleView]})
	})
</script>

<!-- 할일 팝업 -->
<div class="app-popup schedule-space" 
in:fade={{duration: 500}} out:fade={{duration: 200}}>
	<div class="title">
		<span>To-do List</span>
		<button><i class="bi bi-gear-fill"></i></button>
		<!-- 아이디어: 완료목록보기 -->
		<!-- 리스트 길이제한 화면 끝까지 vs 정해진 높이 -->
	</div>
	<div class="list">
		<div class="before-list">
			<button on:click={() => before_scheduleView = !before_scheduleView}>
				이전의({before_scheduleList.length})
				{#if before_scheduleView}
				<i class="bi bi-caret-down-fill"></i>
				{:else}
				<i class="bi bi-caret-up-fill"></i>
				{/if}
			</button>
			{#if before_scheduleView}
			<div class="boxs" in:slide={{duration:500}} out:slide={{duration:500}}>
				{#each before_scheduleList as schedule}
				<div class="schedule-box">
					<label class="round-checkbox" class:checked={schedule.complete}>
						<input type="checkbox" bind:checked={schedule.complete}
							on:click={(e) => scheduleCheck(e, schedule.idx)}>
						<span class="marking"></span>
					</label>
					<div class="content">
						<div>
							<h4>{schedule.name}</h4>
							<h5>{schedule.date.substring(5)}
								<i class="bi bi-alarm-fill fs-14px"></i>
								<span>3시간 전</span>
							</h5>
						</div>
					</div>
					<button on:click={() => updateScheduleOn(schedule)}>
						<i class="bi bi-three-dots fs-24px"></i>
					</button>
				</div>
				{/each}
			</div>
			{/if}
		</div>
		<div class="today">
			<button on:click={() => today_scheduleView = !today_scheduleView}>
				오늘({today_scheduleList.length})
				{#if today_scheduleView}
				<i class="bi bi-caret-down-fill"></i>
				{:else}
				<i class="bi bi-caret-up-fill"></i>
				{/if}
			</button>
			{#if today_scheduleView}
			<div class="boxs" in:slide={{duration:500}} out:slide={{duration:500}}>
				{#each today_scheduleList as schedule}
				<div class="schedule-box">
					<label class="round-checkbox" class:checked={schedule.complete}>
						<input type="checkbox" bind:checked={schedule.complete}
							on:click={(e) => scheduleCheck(e, schedule.idx)}>
						<span class="marking"></span>
					</label>
					<div class="content">
						<div>
							<h4>{schedule.name}</h4>
							<h5>{schedule.date.substring(10)}</h5>
						</div>
					</div>
					<button on:click={() => updateScheduleOn(schedule)}>
						<i class="bi bi-three-dots fs-24px"></i>
					</button>
				</div>
				{/each}
			</div>
			{/if}
		</div>
		<div class="after-list">
			<button on:click={() => after_scheduleView = !after_scheduleView}>
				미래({after_scheduleList.length})
				{#if after_scheduleView}
				<i class="bi bi-caret-down-fill"></i>
				{:else}
				<i class="bi bi-caret-up-fill"></i>
				{/if}
			</button>
			{#if after_scheduleView}
			<div class="boxs" in:slide={{duration:500}} out:slide={{duration:500}}>
				{#each after_scheduleList as schedule}
				<div class="schedule-box">
					<label class="round-checkbox" class:checked={schedule.complete}>
						<input type="checkbox" bind:checked={schedule.complete}
							on:click={(e) => scheduleCheck(e, schedule.idx)}>
						<span class="marking"></span>
					</label>
					<div class="content">
						<div>
							<h4>{schedule.name}</h4>
							<h5>{schedule.date.substring(5)}</h5>
						</div>
					</div>
					<button on:click={() => updateScheduleOn(schedule)}>
						<i class="bi bi-three-dots fs-24px"></i>
					</button>
				</div>
				{/each}
				
			</div>
			{/if}
		</div>
		<div class="complete">
			<button on:click={() => complete_scheduleView = !complete_scheduleView}>
				{complete_allOn ? "전체 완료 목록" : "오늘 완료 목록"}({complete_scheduleList.length})
				{#if complete_scheduleView}
				<i class="bi bi-caret-down-fill"></i>
				{:else}
				<i class="bi bi-caret-up-fill"></i>
				{/if}
				<button class="btn" class:btn-default={!complete_allOn} 
					class:btn-white={complete_allOn}
					on:click|stopPropagation={() => complete_allOn = !complete_allOn}>
					{#if complete_allOn}
					오늘만 보기
					{:else}
					전체보기
					{/if}
				</button>
			</button>
			{#if complete_scheduleView}
			<div style="text-align: right;"></div>
			<div class="boxs" in:slide={{duration:500}} out:slide={{duration:500}}>
				{#each complete_scheduleList as schedule}
				<div class="schedule-box">
					<label class="round-checkbox" class:checked={schedule.complete}>
						<input type="checkbox" bind:checked={schedule.complete}
							on:click={(e) => scheduleCheck(e, schedule.idx)}>
						<span class="marking"></span>
					</label>
					<div class="content">
						<div>
							<h4>{schedule.name}</h4>
							<h5>{schedule.date.substring(5)}</h5>
						</div>
					</div>
					<button on:click={() => updateScheduleOn(schedule)}>
						<i class="bi bi-three-dots fs-24px"></i>
					</button>
				</div>
				{/each}
				
			</div>
			{/if}
		</div>
	</div>
	<div class="new-schedule">
		<form on:submit={scheduleAdd_before}>
			{#if updateOn}
			<h5>일정수정<button class="btn btn-danger" on:click={resetForm}>취소</button></h5>
			{/if}
			<div>
				<input type="text" placeholder="New Todo" bind:value={schedule_txt}>
				{#if schedule_txt.length >= 2}
					<button class="submit-btn" type="submit">
						<i class="bi bi-arrow-left-circle-fill fs-23px"></i>
					</button>	
				{/if}
				<label for="datepicker">
					<i class="bi bi-clock fs-30px" class:c_red={!schedule_date}></i>
					<!-- <span>18:00</span> -->
				</label>
			</div>
			<div>
				<label for="" class="date-view">{schedule_date || ""}</label>
				<div class="date-wrap" >
					<input type="text" class="form-control" id="datepicker" 
						bind:value={schedule_date}>
				</div>
			</div>
		</form>
	</div>
</div>