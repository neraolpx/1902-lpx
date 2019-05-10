//渲染
(function() {
    class cart {
        constructor() {
            this.goodsbox = $('.mgoods');
            this.goodslist = $('#goodslist');
        }
        init() {
                let $this = this;
                if ($this.getcookie('cookiesid') && $this.getcookie(' cookienum')) {
                    var s = $this.getcookie('cookiesid').split(','); //数组sid
                    var n = $this.getcookie(' cookienum').split(','); //数组num
                    $.each(s, function(i, value) {
                        $this.good(s[i], n[i]);
                    });
                }

                $this.allchoice();
            }
            //渲染商品列表

        // function goodslist(id, count) {
        //     $.ajax({
        //         url: '../php/taobaodata.php', //获取所有的接口数据
        //         dataType: 'json'
        //     }).done(function(data) {
        //         $.each(data, function(index, value) {
        //             if (id == value.sid) { //遍历判断sid和传入的sid是否相同，方便将那条数据设置到渲染的商品列表中。
        //                 var $clonebox = $('.goods-item:hidden').clone(true, true);
        //                 $clonebox.find('.goods-pic').find('img').attr('src', value.url);
        //                 $clonebox.find('.goods-pic').find('img').attr('sid', value.sid);
        //                 $clonebox.find('.goods-d-info').find('a').html(value.titile);
        //                 $clonebox.find('.b-price').find('strong').html(value.price);
        //                 $clonebox.find('.quantity-form').find('input').val(count);
        //                 //计算每个商品的价格。
        //                 $clonebox.find('.b-sum').find('strong').html((value.price * count).toFixed(2)); //toFixed(2)四舍五入 保留两位小数
        //                 $clonebox.css('display', 'block');
        //                 $('.item-list').append($clonebox);
        //                 priceall(); //计算总价的
        //             }
        //         });
        //     })
        // }

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
                console.log($('.mgoods:visible'))
                $('.mgoods:visible').each(function(index, value) { //遍历找到勾选的的盒子  获得里面的商品数量和小计
                        console.log(value)
                        if ($(value).find('input').prop('checked')) {
                            console.log(value);
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
            let $choice = $('.mgoods:visible').find(':checkbox');
            console.log($choice)

            //找到 所有显示商品列表的勾选框
            $achoice.on('change', function() { //事件委托
                    //$('.goods-item:visible').find(':checkbox').prop('checked', $(this).prop('checked'));
                    $('.mgoods:visible').find(':checkbox').prop('checked', $(this).prop('checked')); //把全选的 选择属性附加给 其他选择框
                    $achoice.prop('checked', $(this).prop('checked')); //把全选框的 选择统一；
                    $this.allprice(); //重置价格
                })
                //事件委托

            this.goodslist.on('change', $choice, function() { //事件委托
                if ($('.mgoods:visible').find('input:checkbox').length == $('.mgoods:visible').find('input:checked').size()) {
                    $achoice.prop('checked', true);
                } else {
                    $achoice.prop('checked', false);
                }
                $this.allprice();
            })

            console.log($('.mgoods:visible'))
        }
    }
    new cart().init();
})();