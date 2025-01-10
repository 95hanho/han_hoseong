<!-- 베너들 (팝업형태로 특수 기능 처리) -->
<script>
  import weather from '../../assets/img/날씨예시.png'
  import weather2 from '../../assets/img/날씨예시2.png'
  import { banners } from '../../store/bannerSlice';
  import { fade } from 'svelte/transition';
  import { folderUi } from '../../lib/ui';
  import BannerSchedule from '../banner/bannerSchedule.svelte';
	import { moveIcon, moveMenu } from '../../store/iconSlice';

    const test = () => {
        console.log('test');
        window.removeEventListener('resize', folderUi.maxScrollCalc);
        // document.getElementById('wrapper').removeEventListener('scroll', folderUi.iconSideScrShowHide);
        // document.getElementById('wrapper').removeEventListener('scroll', folderUi.iconTboScrShowHide);
    }

    let mentType = 1;
    let testMent = "오늘 점심 날씨는?!";
    let testWeather = weather;
    setInterval(() => {
        if(mentType === 1) {
            mentType = 2;
            testMent = "내일 출근 날씨는?!";
            testWeather = weather2;
        } else {
            mentType = 1;
            testMent = "오늘 점심 날씨는?!";
            testWeather = weather;
        }
    }, 1000);

</script>

<aside id="bannerMain" class:moving={$moveIcon || $moveMenu}>
    {#if $banners.calendar.view}
        <BannerSchedule />
    {/if}
    {#if $banners.weather.view}
    <!-- <div class="weather add-shadow"
        in:fade={{duration:500}} out:fade={{duration:200}}>
        <h3>{testMent}</h3>
        <div><img src={testWeather} alt=""></div>
        <h6>Copyright 2024.  all rights reserved.</h6>
    </div> -->
    {/if}
</aside>