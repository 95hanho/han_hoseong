import $ from "jquery";

//
export const initCalcWidthHeight = () => {
	return {
		colLeng: Math.ceil($(window).width() / 120),
		rowLeng: Math.ceil(($(window).height() - 58) / 120),
	};
};
export const dragRel = {};
export const folderUi = {
	curSideScr: 0,
	curTboScr: 0,
	scrSideMoveIndex: null,
	scrTboMoveIndex: null,
	// 폴더 열린거 밖에 클릭인지
	folderOutClick(target) {
		if (!$(target).closest(".icon-child").length) return true;
		return false;
	},
	// 폴더 열었을 때 왼쪽이나 오른쪽으로 넘치는거 계산
	folderPosition(target) {
		let curWidth = $(window).width();
		let forderMaxLeft = $(target).offset().left + 240;
		let curHeight = $(window).height() - 58;
		let forderMaxTop = $(target).offset().top + 240;
		let overWidth = curWidth < forderMaxLeft;
		let overHeight = curHeight < forderMaxTop;
		if (!overWidth && !overHeight) {
			if (forderMaxTop <= 270) return 5;
			else return 1;
		} else if (overWidth && !overHeight) {
			if (forderMaxTop <= 270) return 6;
			else return 2;
		} else if (!overWidth && overHeight) return 3;
		else if (overWidth && overHeight) return 4;
	},
	// 아이콘 스크롤 이동버튼 보일지말지 통합
	maxScrollCalc(overCol, overRow) {
		if (!overCol) {
			$("#iconsScr .left").css("visibility", "hidden");
			$("#iconsScr .right").css("visibility", "hidden");
		} else folderUi.iconSideScrShowHide();
		if (!overRow) {
			$("#iconsScr .top").css("visibility", "hidden");
			$("#iconsScr .bottom").css("visibility", "hidden");
		} else folderUi.iconTboScrShowHide();
	},
	// 아이콘 왼쪽오른쪽 이동버튼 보일지말지
	iconSideScrShowHide() {
		let curLeft = $(".wrapper").scrollLeft();
		// let scrollableWidth = $(".wrapper")[0].scrollWidth;
		let scrollableWidth = $("#iconsWrap")[0].scrollWidth;
		// let scrollableWidth = $("#iconsWrap")[0].scrollWidth;
		let clientWidth = $(".wrapper").width();
		let maxScrollWidth = scrollableWidth - clientWidth;
		if (curLeft <= 0) {
			clearInterval(folderUi.scrSideMoveIndex);
			$("#iconsScr .left").css("visibility", "hidden");
		} else {
			$("#iconsScr .left").css("visibility", "visible");
		}
		if (curLeft + 1 >= maxScrollWidth) {
			clearInterval(folderUi.scrSideMoveIndex);
			$("#iconsScr .right").css("visibility", "hidden");
		} else {
			$("#iconsScr .right").css("visibility", "visible");
		}
	},
	// 아이콘 위아래 이동버튼 보일지말지
	iconTboScrShowHide() {
		let curTop = $(".wrapper").scrollTop();
		let scrollableHeight = $(".wrapper")[0].scrollHeight;
		let clientHeight = $(".wrapper").height();
		let maxScrollHeight = scrollableHeight - clientHeight;
		if (curTop <= 0) {
			clearInterval(folderUi.scrTboMoveIndex);
			$("#iconsScr .top").css("visibility", "hidden");
		} else {
			$("#iconsScr .top").css("visibility", "visible");
		}
		if (curTop + 1 >= maxScrollHeight) {
			clearInterval(folderUi.scrTboMoveIndex);
			$("#iconsScr .bottom").css("visibility", "hidden");
		} else {
			$("#iconsScr .bottom").css("visibility", "visible");
		}
	},
	// 아이콘드래그하면서 좌우스크롤
	scrSideMove(leftOn) {
		clearInterval(this.scrSideMoveIndex);
		this.scrSideMoveIndex = setInterval(() => {
			$(".wrapper").scrollLeft(leftOn ? this.curSideScr - 10 : this.curSideScr + 10);
			this.curSideScr = $(".wrapper").scrollLeft();
		}, 30);
		return this.scrSideMoveIndex;
	},
	// 클릭하면 좌우스크롤
	clickSideScr(leftOn) {
		let add = ($(window).width() / 2) * (leftOn ? -1 : 1);
		$(".wrapper").animate(
			{
				scrollLeft: $(".wrapper").scrollLeft() + add,
			},
			500
		);
	},
	// 아이콘드래그하면서 위아래스크롤
	scrTboMove(topOn) {
		clearInterval(this.scrTboMoveIndex);
		this.scrTboMoveIndex = setInterval(() => {
			$(".wrapper").scrollTop(topOn ? this.curTboScr - 10 : this.curTboScr + 10);
			this.curTboScr = $(".wrapper").scrollTop();
		}, 30);
		return this.scrTboMoveIndex;
	},
	// 클릭하면 위아래스크롤
	clickTboScr(topOn) {
		let add = ($(window).height() / 2) * (topOn ? -1 : 1);
		$(".wrapper").animate(
			{
				scrollTop: $(".wrapper").scrollTop() + add,
			},
			500
		);
	},
};
export const menuUi = {
	menuOnOff(close) {
		if (!close && !$("#mainMenu").hasClass("on")) {
			$("#mainMenu").addClass("on");
			return true;
		} else {
			$("#mainMenu").removeClass("on");
			return false;
		}
	},
};
export const pageUi = {
	pageBlockScrView(v) {
		let scrLeft = $("#mainFooter .current-url>div").scrollLeft();
		let scrWidth = $("#mainFooter .current-url>div").width();
		let pagesWidth = $("#mainFooter .page-block-wrap").width();
		let leftBtn = $("#mainFooter .current-url .left");
		let rightBtn = $("#mainFooter .current-url .right");
		if (scrWidth && pagesWidth) {
			if (scrWidth < pagesWidth) {
				leftBtn.show();
				rightBtn.show();
			}
			if (scrLeft === 0) {
				leftBtn.hide();
			}
			if (scrLeft > pagesWidth - scrWidth - 10) {
				rightBtn.hide();
			}
		} else {
			leftBtn.hide();
			rightBtn.hide();
		}
	},
	pageBlockMoveLeft() {
		let ele = $("#mainFooter .current-url>div");
		let scrWidth = $("#mainFooter .current-url>div").width();
		let leftBtn = $("#mainFooter .current-url .left");
		let rightBtn = $("#mainFooter .current-url .right");
		ele.animate(
			{
				scrollLeft: ele.scrollLeft() - scrWidth / 2,
			},
			500,
			function () {
				rightBtn.show();
				if (ele.scrollLeft() === 0) {
					leftBtn.hide();
				}
			}
		);
	},
	pageBlockMoveRight() {
		let ele = $("#mainFooter .current-url>div");
		let scrWidth = $("#mainFooter .current-url>div").width();
		let pagesWidth = $("#mainFooter .page-block-wrap").width();
		let leftBtn = $("#mainFooter .current-url .left");
		let rightBtn = $("#mainFooter .current-url .right");
		ele.animate(
			{
				scrollLeft: ele.scrollLeft() + scrWidth / 2,
			},
			500,
			function () {
				leftBtn.show();
				if (ele.scrollLeft() > pagesWidth - scrWidth - 10) {
					rightBtn.hide();
				}
			}
		);
	},
};
export const modalUI = {
	// 모달창 오픈
	open(target) {
		$(target).removeClass("delay").show().addClass("active");
	},
	// 모달창 닫기
	close(target) {
		if (!$(target).hasClass("active")) $(target).hide();
		else {
			$(target).removeClass("active").addClass("delay");
			setTimeout(() => {
				$(target).hide();
			}, 300);
		}
	},
};
