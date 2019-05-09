// 首页数据库图片渲染
(function() {
    class data {
        constructor() {
            this.ul = $('.main-inner')
        }
        init() {
            let $this = this;
            $.ajax({
                url: "http://10.31.163.58/2jieduan/projectname/php/gmdata.php",
                dataType: 'json',
                success(data) {
                    console.log(data);
                    let $datastr = "";
                    $.each(data, function(index, value) {
                        $datastr += `
                        <li>
                        <a href="details.html?sid=${value.sid}" target="_blank">
                        <img src="${value.url}">
                        <p>${value.title}</p>
                        <span>￥${value.price}</span>
                        </a>
                        </li>
                        `;
                    })
                    $this.ul.html($datastr);
                }
            })
        }
    }
    new data().init();
})();
// 轮播图
;
(function() {
    class banner {
        constructor() {
            this.li = $('.banner-box li');
            this.btn = $('.b-choice li');
            this.pre = $('.pre');
            this.nex = $('.nex');
            this.banbox = $('.b-include');
        }
        init() {
            console.log(this.pre);
            let $this = this;
            // 下方小列表加事件
            this.btn.on('mouseover', function(ev) {
                $this.btnclick(ev);
                let $index = $(this).index();
                // 索引传到轮播的图片
                $this.picmove($index);
            });
            // 按钮加点击事件
            // 按键上一张
            this.pre.on('click', function() {
                $this.preclick();
            });
            // 按键下一张
            this.nex.on('click', function() {
                    $this.nexclick();
                })
                // 定时器
            var $timer = setInterval(function() {
                    $this.nexclick();
                }, 2000)
                // 取消定时器
            this.banbox.on('mousemove', function() {
                    clearInterval($timer);
                })
                // 移出banner盒子 定时器重开
            this.banbox.on('mouseout', function() {
                $timer = setInterval(function() {
                    $this.nexclick();
                }, 2000)
            })
        }
        btnclick(ev) {
                let $li = ev.target;
                console.log($li);
                $($li).addClass('active').siblings().removeClass('active');
            }
            // 图片盒子透明底切换
        picmove($index) {
                this.li.eq($index).stop().animate({ opacity: 1 }).siblings().stop().animate({ opacity: 0 });
            }
            // 按钮操控图片上一张
        preclick() {
                let $index = this.btn.filter('.active').index(); //通过取到索引 进行改变图片和小点
                $index--;
                console.log($index)
                console.log(this.btn.length)
                if ($index < 0) {
                    $index = this.btn.length - 1;
                }
                this.li.eq($index).stop().animate({ opacity: 1 }).siblings().stop().animate({ opacity: 0 });
                this.btn.eq($index).addClass('active').siblings().removeClass('active');
            }
            // 按钮操控图片下一张
        nexclick() {
            let $index = this.btn.filter('.active').index();
            $index++;
            if ($index > this.btn.length - 1) {
                $index = 0;
            }
            this.li.eq($index).stop().animate({ opacity: 1 }).siblings().stop().animate({ opacity: 0 });
            this.btn.eq($index).addClass('active').siblings().removeClass('active');
        }
    };
    new banner().init();
})()