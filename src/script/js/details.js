// 获取id 对应数据库找到对应的sid 渲染图片列表

(function() {
    class piclist {
        constructor() {
            this.id = location.search.substring(1).split('=')[1];
            this.list = $("#list ul");
            this.spic = $("#spic img");
            this.bpic = $("#bpic");
            this.title = $(".cg-title");
            this.price = $(".cg-price span");
        }
        init() {
            let $this = this;
            $.ajax({
                url: "http://10.31.163.58/2jieduan/projectname/php/details.php",
                data: {
                    sid: $this.id
                },
                dataType: 'json',
                success(data) {
                    console.log(data);
                    $this.spic.attr('src', data.url);
                    $this.bpic.attr('src', data.url);
                    $this.title.html(data.title);
                    $this.price.html(data.price);
                    // 将urls数据转成数组
                    let picarr = data.urls.split(',');
                    console.log(picarr);
                    let $datastr = "";
                    // 遍历拼接进列表
                    $.each(picarr, function(index, value) {
                        $datastr += `
                        <li><img src="${value}"></li>
                        `
                    })
                    $this.list.html($datastr);
                }
            })
        }
    }
    new piclist().init();
})();


// 放大镜效果
;
(function() {
    class glass {
        constructor() {
            this.sf = $('#sf');
            this.bf = $('#bf');
            this.spic = $('#spic');
            this.bpic = $('#bpic');
            this.list = $('#list ul');
            this.right = $('#right');
            this.left = $('#left');
            this.num = 6; //显示六张
        }
        init() {
            //鼠标移入移出小图 小方和大方显示与隐藏
            let $this = this;
            this.spic.hover(function() {
                    $this.over();
                },
                function() {
                    $this.out();
                });
            // li添加点击事件
            this.list.on('click', 'li', function() {
                $this.liclick(this);
            });


            // 列表右键点击事件
            this.right.on('click', function() {
                $this.rclick();
            });
            // 列表左键点击事件
            this.left.on('click', function() {
                $this.lclick();
            })
        }
        over() {
                let $this = this;
                // 显示大小方
                this.sf.css('visibility', 'visible');
                this.bf.css('visibility', 'visible');
                // 计算小方的尺寸
                this.sf.width(this.spic.width() * this.bf.width() / this.bpic.width());
                this.sf.height(this.spic.height() * this.bf.height() / this.bpic.height());
                // 给小图盒子加鼠标移动事件
                this.spic.on('mousemove', function(ev) {
                    $this.move(ev);
                })
            }
            // 鼠标移出小图的盒子 大小方消失
        out() {
                this.sf.css('visibility', 'hidden');
                this.bf.css('visibility', 'hidden');
            }
            // 小方鼠标移动事件
        move(ev) {
                let $l = ev.pageX - this.spic.offset().left - this.sf.width() / 2;
                let $t = ev.pageY - this.spic.offset().top - this.sf.height() / 2;
                // 限制小方的移动范围 要在小图盒子内移动
                if ($l <= 0) {
                    $l = 0;
                } else if ($l >= this.spic.width() - this.sf.width()) {
                    $l = this.spic.width() - this.sf.width();
                }
                if ($t <= 0) {
                    $t = 0;
                } else if ($t >= this.spic.height() - this.sf.height()) {
                    $t = this.spic.height() - this.sf.height();
                }
                // 幅值给小方偏移高度和水平
                this.sf.css({
                    top: $t,
                    left: $l
                });
                // 大图偏移度等于负的小方偏移度乘以比例  比例等于大图除以小图
                this.bpic.css({
                    top: -(this.bpic.width() / this.spic.width()) * $t,
                    left: -(this.bpic.width() / this.spic.width()) * $l,
                })
            }
            // li点击事件
        liclick(li) {
                let $url = $(li).find('img').attr('src');
                this.spic.find('img').attr('src', $url);
                this.bpic.attr('src', $url);
            }
            // 列表右键点击事件
        rclick() {
                let $li = $('#list ul li');
                let $liwidth = $li.outerWidth(true);
                if ($li.length > this.num) {
                    this.num++;

                    if ($li.length == this.num) { //此时图片列表运动到最后一个
                        this.right.css('color', '#fff')
                    }
                    this.list.animate({
                        left: -(this.num - 6) * $liwidth
                    })
                }
            }
            // 列表左键点击事件
        lclick() {
            let $li = $('#list ul li');
            let $liwidth = $li.outerWidth(true);
            if (this.num > 6) {
                this.num--;

                this.list.animate({
                    left: -(this.num - 6) * $liwidth
                })
            }
        }
    }
    new glass().init();
})()