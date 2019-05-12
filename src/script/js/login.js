(function() {
    class login {
        constructor() {
            this.btn = $('.button');
            this.error = $('#error')
        }
        init() {
            let $this = this;
            this.btn.on('click', function() { //按钮添加点击事件
                let $username = $('.username').val();
                let $password = $('.password').val();
                $.ajax({
                    type: 'post',
                    url: 'http://10.31.163.58/2jieduan/projectname/php/user/login.php',
                    data: {
                        name: $username,
                        pass: $password
                    },
                    success: function(data) {
                        if (!data) {
                            $this.error.html('用户名或密码输入错误')
                            $('.password').val('');
                        } else { //用户名密码无误 存cookie 跳转到首页
                            $this.addcookie('username', $username, 7)
                            location.href = 'http://10.31.163.58/2jieduan/projectname/src/index.html';
                        }
                    }
                })
            })
        }

        //把用户名存在cookie
        addcookie(key, value, day) {
            let date = new Date();
            date.setDate(date.getDate() + day);
            document.cookie = key + '=' + encodeURI(value) + ';expires=' + date;
        }
    }
    new login().init();
})();