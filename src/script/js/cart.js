//渲染
(function() {
    class cart {
        constructor() {
            this.goodsbox = $('.mgoods');
            this.goodslist = $('#goodslist');
            this.arrsid = []; //商品sid的数组
            this.arrnum = []; //商品数量的数组
        }
        init() {
            let $this = this;
            //获取cookie 渲染
            if ($this.getcookie('cookiesid') && $this.getcookie(' cookienum')) {
                var s = $this.getcookie('cookiesid').split(','); //数组sid
                var n = $this.getcookie(' cookienum').split(','); //数组num
                $.each(s, function(i, value) {
                    $this.good(s[i], n[i]);
                });
            }
            //按键点击添加商品数量
            $this.inputadd();
            //按键点击减少商品数量
            $this.inputreduce();
            //输入数字改变商品数量
            $this.inputchange();
            //全选框操作
            $this.allchoice();

            //删除单个商品列表
            $this.delonegoods();

            //删除选中的商品列表
            $this.delallgoods();
        }

        //渲染商品列表
        good(id, count) {
            let $this = this;
            $.ajax({
                url: "http://10.31.163.58/2jieduan/projectname/php/gmdata.php",
                dataType: 'json',
                success(data) {
                    $.each(data, function(index, value) {
                        if (id == value.sid) { //判断传入的ID与取到的是否相同
                            var $clonebox = $this.goodsbox.clone(true, true);
                            $clonebox.find('img').attr('src', value.url);
                            $clonebox.find('img').attr('sid', value.sid); //将图片添加自定义属性sid 方便后续存cookie
                            $clonebox.find('.goodsname').find('p').html(value.title);
                            $clonebox.find('.price').find('span').html(value.price);
                            $clonebox.find('.goodsnum').find('input').val(count);
                            //计算小计
                            $clonebox.find('.allprice').find('span').html((value.price * count).toFixed(2));
                            //显示盒子
                            $clonebox.css('display', 'block');
                            $this.goodslist.append($clonebox);
                        }
                    })
                }
            })
        }

        //获取cookie
        getcookie(key) {
            let $arr = document.cookie.split(';');
            for (let i = 0; i < $arr.length; i++) {
                var na = $arr[i].split('=');
                if (na[0] == key) {
                    return na[1];
                }
            }
        }

        //计算总价 总数量 必须是选中的 并且要是显示出来的克隆盒子
        allprice() {
            let $sum = 0;
            let $count = 0;
            $('.mgoods:visible').each(function(index, value) { //遍历找到勾选的的盒子  获得里面的商品数量和小计
                    if ($(value).find('input').prop('checked')) {
                        $sum += parseInt($(value).find('.cl-r').find('.goodsnum').find('input').val()); //遍历加起来的小计之和
                        $count += parseFloat($(value).find('.allprice').find('span').html()); //遍历加起来的商品数量之和
                    }
                })
                // console.log($aprice);
                // console.log($count);
            $('.js_ced').find('em').html($sum);
            $('.js_price').find('span').html('￥' + $count.toFixed(2)); //总价保留两位小数 
        }

        //全选
        allchoice() {
            //获取 全选框
            let $this = this;
            let $achoice = $('.achoice');
            let $choice = $('.mgoods:visible').find(':checkbox'); //存变量 留作事件委托用

            //找到 所有显示商品列表的勾选框
            $achoice.on('change', function() { //在事件内取到渲染的数据
                $('.mgoods:visible').find(':checkbox').prop('checked', $(this).prop('checked')); //把全选的 选择属性附加给 其他选择框
                $achoice.prop('checked', $(this).prop('checked')); //把全选框的 选择统一；
                $this.allprice(); //重置价格
            })

            //事件委托
            this.goodslist.on('change', $choice, function() { //事件委托
                //判断勾选框是否是全部勾选 通过勾选框length 和被勾选的框的length做比对
                if ($('.mgoods:visible').find('input:checkbox').length == $('.mgoods:visible').find('input:checked').size()) {
                    $achoice.prop('checked', true);
                } else {
                    $achoice.prop('checked', false);
                }
                $this.allprice();
            })
        }

        //数量改变后每一个商品的小计
        oneprice(obj) {
            let $price = parseFloat(obj.parents('.mgoods').find('.price span').html()); //商品单价
            let $goodsnum = parseInt(obj.parents('.mgoods').find('.g-num').val());
            return ($price * $goodsnum).toFixed(2); //该商品返回小计
        }

        //点击+商品数量
        inputadd() {
            let $this = this;
            $('.g-up').on('click', function() {
                let $count = $(this).parents('.mgoods').find('.g-num').val();
                $count++;
                if ($count >= 99) {
                    $count = 99;
                }
                $(this).parents('.mgoods').find('.g-num').val($count); //赋值回去
                $(this).parents('.mgoods').find('.allprice').find('span').html($this.oneprice($(this)));
                $this.allprice(); //重新计算总计
                $this.setcookie($(this)); //将改变的数量重新添加到cookie
            })
        }

        //点击-商品数量
        inputreduce() {
            let $this = this;
            $('.g-dowm').on('click', function() {
                let $count = $(this).parents('.mgoods').find('.g-num').val();
                $count--;
                if ($count <= 0) {
                    $count = 1;
                }
                $(this).parents('.mgoods').find('.g-num').val($count); //赋值回去
                $(this).parents('.mgoods').find('.allprice').find('span').html($this.oneprice($(this)));
                $this.allprice(); //重新计算总计
                $this.setcookie($(this)); //将改变的数量重新添加到cookie
            })
        }

        //输入数字改变商品数量 和商品小计
        inputchange() {
            let $this = this;
            $('.g-num').on('input', function() {
                let $reg = /^\d+$/g; //正则判断输入必须是数字
                let $num = parseInt($(this).val());
                //判断并规定输入的数字范围
                if ($reg.test($num)) { //输入是数字
                    if ($num >= 99) {
                        $(this).val(99);
                    } else if ($num <= 0) {
                        $(this).val(1);
                    }
                } else { //输入不是数字 则判定为数量1
                    $(this).val(1);
                }
                $(this).parents('.mgoods').find('.allprice span').html($this.oneprice($(this))); //改变小计
                $this.allprice();
                $this.setcookie($(this));
            });
        }

        //将改变的数量 存入cookie

        //提前获取cookie里面id和num
        cookietogo() {
            if (this.getcookie('cookiesid') && this.getcookie(' cookienum')) { //判断商品是否第一次存储  这里cookienum 浏览器中多了一个空格
                this.arrsid = this.getcookie('cookiesid').split(',');
                this.arrnum = this.getcookie(' cookienum').split(',');
            }
        }

        //添加cookie
        addcookie(key, value, days) {
            let $day = new Date();
            $day.setDate($day.getDate() + days);
            var a = document.cookie = key + '=' + value + ';expires=' + $day;
        }

        //存入改变的cookie
        setcookie(obj) {
            this.cookietogo();
            let $index = obj.parents('.mgoods').find('img').attr('sid');
            this.arrnum[$.inArray($index, this.arrsid)] = obj.parents('.mgoods').find('.g-num').val();
            this.addcookie('cookienum', this.arrnum.toString(), 7);
        }

        //删除cookie 商品列表
        //删除cookie
        delgoodscookie(sid) {
            let $index = -1;
            $.each(this.arrsid, function(index, value) {
                if (sid == value) {
                    $index = index; //如果传入的sid找到 赋值这个sid的对应索引
                }
            });
            this.arrsid.splice($index, 1); //删除对应索引的sid
            this.arrnum.splice($index, 1); //删除对应索引的num
            this.addcookie('cookiesid', this.arrsid.toString(), 7); //添加覆盖cookie
            this.addcookie('cookienum', this.arrnum.toString(), 7);
        }

        //删除单个商品列表
        //删除单个商品的函数(委托)
        delonegoods() {
            let $this = this;
            this.goodslist.on('click', '.del', function() {
                $this.cookietogo(); //提前获取cookie里面id和num 下面删除用
                if (confirm('你确定要删除么？')) {
                    $(this).parents('.mgoods').remove(); //通过当前点击的元素找到整个一行列表，删除
                }
                $this.delgoodscookie($(this).parents('.mgoods').find('img').attr('sid'));
                $this.allprice();
            })
        }

        //删除选中的商品列表
        delallgoods() {
            let $this = this;
            $('.js_del a').on('click', function() {
                $this.cookietogo();
                if (confirm('你确定要删除选中的么')) {
                    $('.mgoods:visible').each(function() {
                        if ($(this).find('.cho2').is(':checked')) { //如果勾选
                            $(this).remove();
                            $this.delgoodscookie($(this).find('img').attr('sid'));
                        }
                    });
                    $this.allprice();
                }
            });
        }
    }
    new cart().init();
})();