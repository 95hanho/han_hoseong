<script>
  import loginImg from '../../assets/img/login_vision_20240613_0857.jpg';
</script>

<div id="login-wrap">
  <div>
    <h1><span>new</span>Expert WintraNet</h1>
    <div><img src={loginImg} alt=""></div>
    <div>
      <form class="login-form">
        <div class="login-input">
          <div class="login-txt">
            <div>
              <input type="text" placeholder="아이디">
              <input type="checkbox" id="id_store"><label for="id_store">아이디 저장</label>
            </div>
            <div><input type="password" placeholder="비밀번호"></div>
          </div>
          <div class="login-submit">
            <button type="submit" class="btn btn-green">로그인</button>
          </div>
        </div>
        <p>3회 이상 패스워드 오류 시 접속에 제한이 있습니다.</p>
        <p>* 제한된 로그인은 1시간 후 자동 해제 됩니다. 그 외 IT전략실로 문의해주세요.</p>
      </form>
    </div>
  </div>

</div>