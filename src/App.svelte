<script>
	import { commonService } from './api/index.js';
	import MainMenu from './components/main/mainMenu.svelte';
    import BannerMain from './components/main/bannerMain.svelte';
    import IconMain from './components/main/iconMain.svelte';
    import MainFooter from './components/main/mainFooter.svelte';
    import { onMount } from 'svelte';
	import Login from './components/main/Login.svelte';
	import PopupMain from './components/main/popupMain.svelte';
	import ModalMain from './components/main/modalMain.svelte';
	import { bg_info } from './store/modalSlice';

    document.addEventListener('click', function() {
        // console.log('클릭됐엉');
    });

    let menuOn = false;
    const change_menuOn = (value) => {
        menuOn = value;
    }

    $: bg_style = Object.entries($bg_info).reduce((acc, cur) => {
        if(cur[0] === "background-image") {
            acc += cur[0] + ":url(" + cur[1] + ");";
        } else {
            acc += cur[0] + ":" + cur[1] + ";";
        }
        return acc;
    }, '');
    $: console.log(bg_style);

    // 베너
    /* 
    let banners = {
        calendar: {
            name:"오늘 할일",
            interface: null,
            view:true,
			iconClass:"bi bi-calendar2-check-fill"
        },
        weather: {
            name:"날씨",
			interface: null,
			view:true,
			iconClass:"bi bi-cloud-sun-fill"
        }
    };
     */
    // function change_banners(v) {
    //     console.log(v);
    //     console.log('change_banners');
    //     banners = v;
    // }

    onMount(() => {
        // menuUi.menuOnOff();
        $bg_info = commonService.getBgInfo();
    });
</script>

<div id="wrapper" class="wrapper" style={bg_style}>
    <!-- https://eaintra.exc.co.kr/intro.asp -->
    {#if false}
    <Login />
    {:else}
    <main>
        <IconMain />
    </main>
    <PopupMain />
    <BannerMain/>
    <MainFooter {menuOn} {change_menuOn}/>
    <MainMenu {change_menuOn}/>
    <ModalMain />
    {/if}
</div>

<style>
    main {

    }
</style>