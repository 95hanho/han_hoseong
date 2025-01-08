<script>
  import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
  import { banners } from '../../store/bannerSlice';

</script>

<!-- 배너조작 팝업 -->
<div class="app-popup banner-space"
in:fade={{duration: 500}} out:fade={{duration: 200}}>
	<div class="title">
		<span>베너 조작</span>
		<button><i class="bi bi-gear-fill"></i></button>
	</div>
	<div class="list">
		<button>
			<i class="bi bi-calendar2-check-fill"></i>
			<div class="etc-control">
				<h3>오늘 할일</h3>
				<h4>기타 조작 사항 없음</h4>
			</div>
			<div class="switch">
				<input
					type="checkbox"
					id="calendar"
					name="private"
					class="switch_checkbox"
					bind:checked={$banners.calendar.view}
				/>
				<label for="calendar" class="switch_label">
					<span></span>
				</label>
			</div>
		</button>
		<hr>
		<button>
			<i class="bi bi-cloud-sun-fill"></i>
			<div class="etc-control">
				<h3>날씨</h3>
				<h4>기타 조작 사항 없음</h4>
			</div>
			<div class="switch">
				<input
					type="checkbox"
					id="weather"
					name="private"
					class="switch_checkbox"
					bind:checked={$banners.weather.view}
				/>
				<label for="weather" class="switch_label">
					<span></span>
				</label>
			</div>
		</button>
		<hr>
	</div>
	<button class="all-control"
		class:disabled={!Object.values($banners).some((v) => v.view)}
		on:click={() => {
			if(Object.values($banners).some((v) => v.view)) {
				for(let key in $banners) {
					$banners[key].view = false;
				}
			}
			
		}}>
		<span>전체 배너 내리기</span>
	</button>
	
</div>