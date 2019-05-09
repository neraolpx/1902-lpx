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

                    $this.spic.attr('src', data.url);
                    $this.bpic.attr('src', data.url);
                    $this.title.html(data.title);
                    $this.price.html(data.price);
                    // 将urls数据转成数组
                    let picarr = data.urls.split(',');

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
})();

// 添加进购物车
;
(function() {
    class gotocart {
        constructor() {
            this.addbtn = $('#addcar');
            // 获取当前的图片sid
            this.id = location.search.substring(1).split('=')[1];
            this.count = $('#count'); //获取输入框
            this.arrsid = [];
            this.arrnum = [];
        }
        init() {
                let $this = this;
                let $sid = this.id;
                this.addbtn.on('click', function() {
                    // 获取当前商品sid
                    $this.cookietogo();
                    // 判断商品cookie是否存在
                    if ($.inArray($sid, $this.arrsid) != -1) { //商品存在 返回索引 只添加数量
                        //取出当前的数量 再加上输入的数量 在存入cookie
                        let num = parseInt($this.arrnum[$.inArray($sid, $this.arrsid)]) + parseInt($this.count.val());
                        $this.arrnum[$.inArray($sid, $this.arrsid)] = num;
                        $this.addcookie('cookienum', $this.arrnum.toString(), 7);
                    } else { //商品不存在 添加sid和数量
                        $this.arrsid.push($sid);
                        $this.addcookie('cookiesid', $this.arrsid.toString(), 7); //sid
                        $this.arrnum.push($this.count.val());
                        $this.addcookie('cookienum', $this.arrnum.toString(), 7); //数量
                    }
                })
            }
            // 获取cooike 判断是否是第一次存储
        cookietogo() {
                if (this.getcookie('cookiesid') && this.getcookie(' cookienum')) { //判断商品是否第一次存储  这里cookienum 浏览器中多了一个空格
                    this.arrsid = this.getcookie('cookiesid').split(',');
                    this.arrnum = this.getcookie(' cookienum').split(',');
                }
                // if (this.getcookie(' cookienum')) {
                //     alert(1)
                // }
            }
            // 添加cookie
        addcookie(key, value, days) {
                let $day = new Date();
                $day.setDate($day.getDate() + days);
                var a = document.cookie = key + '=' + value + ';expires=' + $day;
            }
            // 获取cookie
        getcookie(key) {
                let $arr = document.cookie.split(';');
                for (let i = 0; i < $arr.length; i++) {
                    var na = $arr[i].split('=');
                    if (na[0] == key) {
                        return na[1];
                    }
                }
            }
            // 删除cookie
        delcookie(key) {
            this.addcookie(key, '', -1);
        }
    }
    new gotocart().init();
})();

//按钮点击事件加减要添加购物车的商品数量

;
(function() {
    class btn {
        constructor() {
            this.up = $('#gn-push');
            this.down = $('#gn-del');
            this.count = $('#count');
        }
        init() {
                let $this = this;
                //点击加商品数量
                //点击增加添加的数量
                this.up.on('click', function() {
                    $this.upclick();
                });
                //点击减少加的数量
                this.down.on('click', function() {
                    $this.downclick();
                });
            }
            //加数量
        upclick() {
            let num = this.count.val();
            num++;
            if (num > 99) {
                num = 99;
            }
            this.count.val(num);
        }
        downclick() {
            let num = this.count.val();
            num--;
            if (num < 0) {
                num = 0;
            }
            this.count.val(num);
        }
    }
    new btn().init();
})()