<script>
	import { fade } from 'svelte/transition';

</script>

<!-- 알람팝업 -->
<div class="app-popup alert-space" 
in:fade={{duration: 500}} out:fade={{duration: 200}}>
	<div class="title">
		<span>알람</span>
		<button><i class="bi bi-gear-fill"></i></button>
	</div>
	<div class="list">
		<button class="pin">
			<div>
				<i class="bi bi-pin-angle c_red"></i>
			</div>
			<div class="content">
				<h2 class="c_red">긴급!</h2>
				<h3>메시지제목제목제목지제</h3>
				<h4>메시지내용메시지내용메시지내용</h4>
				<h5>2024-04-04 오전 9:30:04</h5>
			</div>
		</button>
		<button>
			<div>
				<i class="bi bi-envelope"></i>
			</div>
			<div class="content">
				<h3>메시지제목제목제목지제</h3>
				<h4>메시지내용메시지내용메시지내용</h4>
				<h5>2024-04-04 오전 9:30:04</h5>
			</div>
		</button>
		<button>
			<div>
				<i class="bi bi-envelope"></i>
			</div>
			<div class="content">
				<h3>넘치는메시지제목제목제목지제목제목제목지제목제목제목지제목제목제목</h3>
				<h4>넘치는메시지내용메시지내용메시지내용메시지내용메시지내용메시지내용메시지내용메시지내용메시지내용메시지내용메시지내용</h4>
				<h5>2024-04-04 오전 9:30:04</h5>
			</div>
		</button>
		<button>
			<div>
				<i class="bi bi-envelope"></i>
			</div>
			<div class="content">
				<h4>이미지o제목x 메시지내용내용내용</h4>
				<h5>2024-04-04 오전 9:30:04</h5>
			</div>
		</button>
		<button class="noImg">
			<div class="content">
				<h3>이미지x제목o 메시지제목</h3>
				<h4>이미지x제목o 메시지내용내용내용</h4>
				<h5>2024-04-04 오전 9:30:04</h5>
			</div>
		</button>
		<button class="noImg">
			<div class="content">
				<h4>이미지x제목x 메시지내용내용내용</h4>
				<h5>2024-04-04 오전 9:30:04</h5>
			</div>
		</button>
		<button class="noImg">
			<div class="content">
				<h4>반복반복</h4>
				<h5>2024-04-04 오전 9:30:04</h5>
			</div>
		</button>
		<button class="noImg">
			<div class="content">
				<h4>반복반복</h4>
				<h5>2024-04-04 오전 9:30:04</h5>
			</div>
		</button>
		<button class="noImg">
			<div class="content">
				<h4>반복반복</h4>
				<h5>2024-04-04 오전 9:30:04</h5>
			</div>
		</button>
		<button class="noImg">
			<div class="content">
				<h4>반복반복</h4>
				<h5>2024-04-04 오전 9:30:04</h5>
			</div>
		</button>
	</div>
</div>