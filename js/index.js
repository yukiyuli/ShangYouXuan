//作用：需要将所有的DOM元素对象以及相关的资源全部都加载完毕之后，再来实现的事件函数
window.onload = function () {

    // 声明一个记录点击的缩略图下标
    let bigimgIndex = 0;

    //路径导航的数据渲染
    navPathDataBind();
    function navPathDataBind() {
        /**
         * 思路：
         * 1、先获取路径导航的页面元素（navPath）
         * 2、再来获取所需要的数据（data.js->goodData.path）
         * 3、由于数据是需要动态产生的，那么相应的DOM元素也应该是动态产生的，含义需要根据数据的数量来进行创建DOM元素
         * 4、在遍历数据创建DOM元素的最后一条，只创建a标签，而不创建i标签
         */

        //1.获取页面导航的元素对象
        var navPath = document.querySelector('#wrapper #content .contentMain #navPath');

        //2.获取数据
        var path = goodData.path;

        //3.遍历数据
        for (var i = 0; i < path.length; i++) {
            if (i == path.length - 1) {
                //只需要创建a且没有href属性
                var aNode = document.createElement("a");
                aNode.innerText = path[i].title;
                navPath.appendChild(aNode);
            } else {
                //4.创建a标签
                var aNode = document.createElement("a");
                aNode.href = path[i].url;
                aNode.innerText = path[i].title;

                //5.创建i标签
                var iNode = document.createElement('i');
                iNode.innerText = '/';

                //6.让navPath元素来追加a和i
                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }


        }
    }

    //放大镜的移入、移出效果
    bigClassBind();
    function bigClassBind() {
        /**
         * 思路：
         * 1、获取小图框元素对象，并且设置移入事件(onmouseenter)
         * 2、动态的创建蒙版元素以及大图框和大图片元素
         * 3、移出时(onmouseleave)需要移除蒙版元素和大图框
         */

        //1.获取小图框元素
        var smallPic = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic');
        //获取leftTop元素
        var leftTop = document.querySelector('#wrapper #content .contentMain #center #left #leftTop');
        //获取数据
        var imagessrc = goodData.imagessrc;
        //2.设置移入事件
        smallPic.onmouseenter = function () {

            //3. 创建蒙版元素
            var maskDiv = document.createElement('div');
            maskDiv.className = "mask";

            //4.创建大图框元素
            var BigPic = document.createElement('div');
            BigPic.id = "bigPic";

            //5.创建大图片元素
            var BigImg = document.createElement('img');
            BigImg.src = imagessrc[bigimgIndex].b;

            //6.大图框来追加大图片
            BigPic.appendChild(BigImg);

            //7.让小图框来追加蒙版元素
            smallPic.appendChild(maskDiv);

            //8.让leftTop元素追加大图框
            leftTop.appendChild(BigPic);

            // 设置移动事件
            smallPic.onmousemove = function (event) {
                // (1). 先计算出鼠标在盒子内的坐标
                //event.clientX: 鼠标点距离浏览器左侧X轴的值
                //getBoundingClientRect().left:小图框元素距离浏览器左侧可视left值
                var x = event.clientX - smallPic.getBoundingClientRect().left;
                var y = event.clientY - smallPic.getBoundingClientRect().top;

                // (2) 减去盒子高度 300的一半 是 150 就是我们mask 的最终 left 和top值了
                // (3) mask移动的距离
                var maskX = x - maskDiv.offsetWidth / 2;
                var maskY = y - maskDiv.offsetHeight / 2;

                //遮挡层的最大移动距离
                var maskMax = smallPic.clientWidth - maskDiv.offsetWidth;
                if (maskX <= 0) {
                    maskX = 0;
                } else if (maskX >= maskMax) {
                    maskX = maskMax
                }

                if (maskY <= 0) {
                    maskY = 0;
                } else if (maskY >= maskMax) {
                    maskY = maskMax;
                }

                //设置left和top属性
                maskDiv.style.left = maskX + "px";
                maskDiv.style.top = maskY + "px";

                //大图发生移动
                //确定 bigImg 的left top
                // 大图片的移动距离 = 遮挡层移动距离 * 大图片最大移动距离 / 遮挡层的最大移动距离
                var bigMax = BigImg.offsetWidth - BigPic.clientWidth;

                // 大图片的移动距离 X Y
                var bigX = maskX * bigMax / maskMax;
                var bigY = maskY * bigMax / maskMax;

                BigImg.style.left = -bigX + 'px';
                BigImg.style.top = -bigY + 'px';
            }

            //设置移出事件
            smallPic.onmouseleave = function () {

                //让小图框移除蒙版元素
                smallPic.removeChild(maskDiv);

                //让leftTop元素移除大图框
                leftTop.removeChild(BigPic);
            }
        }
    }

    //动态渲染放大镜缩略图的数据
    thumbnailData();
    function thumbnailData() {
        /* 
        思路：
        1. 获取piclist元素下的ul
        2. 获取data.js文件下的goodData->images src
        3. 遍历数组，根据数组的长度来创建li元素
        4. 让ul追加li元素    
        */

        // 1. 获取piclist元素下的ul
        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul')

        // 2. 获取data.js文件下的goodData->images src
        var imagessrc = goodData.imagessrc;

        // 3. 遍历数组，根据数组的长度来创建li元素 
        for (var i = 0; i < imagessrc.length; i++) {
            // 4. 创建li元素
            var newLi = document.createElement('li');

            // 5. 创建img元素
            var newImg = document.createElement('img');
            newImg.src = imagessrc[i].s;

            // 6. 让li追加img元素
            newLi.appendChild(newImg);

            // 7. 让ul追加li元素 
            ul.appendChild(newLi);

        }
    }

    //点击缩略图的效果
    thumbnailClick();
    function thumbnailClick() {
        /**
        * 思路：
        * 1、获取所有的li元素，并且循环发生点击事件
        * 2、点击缩略图需要确定其下标位置来找到其对应小图路径和大图路径替换现有src的值
        */

        // 1、获取所有的li元素
        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li');

        var smallpicImg = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic img');

        var imagessrc = goodData.imagessrc;

        // 小图路径需要默认和imagessrc的第一个元素小图的路径是一致的
        smallpicImg.src = imagessrc[0].s;

        // 2、循环点击这些li元素
        for (let i = 0; i < liNodes.length; i++) {
            liNodes[i].onclick = function () {
                bigimgIndex = i;

                // 变化小图路径
                smallpicImg.src = imagessrc[i].s;
            }
        }
    }

    // 点击缩略图左右箭头的小图哦
    thumbnaiLeftRightlClick();
    function thumbnaiLeftRightlClick() {
        /**
        * 思路：
        * 1、先获取左右两端的箭头啊扭
        * 2、在获取可视的div以及ul元素和所有的li元素
        * 3、计算（发生起点、步长、总体运动的距离值)
        * 3、然后再发生点击事件
        */

        // 1、先获取左右两端的箭头啊扭
        var pre = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.pre');
        var next = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.next');

        // 2、在获取可视的div以及ul元素和所有的li元素
        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul');
        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li');

        // 3、移动，起始位置为0
        var start = 0;

        // 步长：移动两张图+间距的长度
        var step = (liNodes[0].offsetWidth + 20) * 2;

        // 总体运动的距离值 = ul的宽度 - div框的宽度 = (图片的总数=div中显示的数量) * (li的宽度+20)
        var endPosition = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20);

        // 4、发生事件
        pre.onclick = function () {
            start -= step;
            if (start < 0) {
                start = 0;
            }
            ul.style.left = -start + 'px';
        }

        next.onclick = function () {
            start += step;
            if (start > endPosition) {
                start = endPosition;
            }
            ul.style.left = -start + 'px';
        }

    }

    // 商品详情数据的动态渲染
    rightTopData();
    function rightTopData() {
        /**
        * 思路：
        * 1、查找rightTop元素
        * 2、查找data.js->goodData->goodsDetail
        * 3、建立一个字符串变量，将原来的布局结构贴进来，将所对应的数据放在对应的位置上，重新熏染rightTop元素
        * 3、然后再发生点击事件
        */

        // 1、查找rightTop元素
        var rightTop = document.querySelector('#wrapper #content .contentMain #center .right .rightTop');

        // 2、查找data.js->goodData->goodsDetail
        var goodsDetail = goodData.goodsDetail;

        // 3、创建一个字符窜(双引号，单引号，模版字符串)变量
        // 4、模版字符串替换数据：${变量}
        var s = `        
            <h3>${goodsDetail.title}</h3>     
            <p>${goodsDetail.recommend}</p>
            <div class="priceWrap">
                
                <div class="priceTop">
                    <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                    <div class="price">
                        <span>￥</span>
                        <p>${goodsDetail.price}</p>
                        <i>降价通知</i>
                    </div>
                    <p>
                        <span>累计评价</span>
                        <span>${goodsDetail.evaluateNum}</span>
                    </p>
                </div>
                <div class="priceBottom">
                    <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                    <p>
                        <span>${goodsDetail.promoteSales.type}</span>
                        <span>${goodsDetail.promoteSales.content}</span>
                    </p>
                </div>
            </div>
            
            <div class="support">
                <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
                <p>${goodsDetail.support}</p>
            </div>
            <div class="address">
                <span>配&nbsp;送&nbsp;至</span>
                <p>${goodsDetail.address}</p>
            </div>`;


        // 4、重新渲染rightTop元素  innterText只能识别文本，innerHTML才能识别标签
        rightTop.innerHTML = s;

    }

    // 商品参数数据的动态渲染
    rightBottomData();
    function rightBottomData() {
        /**
        * 思路：
        * 1、查找rightBottom元素对象
        * 2、查找data.js->goodData.goodsDetail.crumbData数据
        * 3、由于数据是一个数组，需要遍历，有一个元素则需要有一个动态的dl元素对象(dt,dd)
        * 4、然后再发生点击事件
        */

        // 1、查找rightBottom元素对象
        var chooseWrap = document.querySelector('#wrapper #content .contentMain #center .right .rightBottom .chooseWrap');

        // 2、查找data.js->goodData.goodsDetail.crumbData数据
        var crumbData = goodData.goodsDetail.crumbData;

        // 3、循环数据
        for (var i = 0; i < crumbData.length; i++) {

            // 4、创建dl元素对象
            var dlNode = document.createElement('dl');

            // 5、穿件dt元素对象
            var dtNODE = document.createElement('dt');
            dtNODE.innerText = crumbData[i].title;

            // 6、追加dt
            dlNode.appendChild(dtNODE);

            // 7、遍历crumbData->Data
            for (var j = 0; j < crumbData[i].data.length; j++) {

                // 创建dd元素
                var ddNode = document.createElement('dd');
                ddNode.innerText = crumbData[i].data[j].type;

                // 让dl追加dd
                dlNode.appendChild(ddNode);
            }

            // 7、让chooseWrap追加dl
            chooseWrap.appendChild(dlNode);
        }

    }

    // 点击商品参数之后的颜色排他效果
    clickddBind();
    function clickddBind() {

        /**
        * 思路：
        * 1、获取所有的dl元素，取其中第一个dl元素下的所有dd先做测试, 
        *    测试完毕之后在对应dl第一行下表的前面再潜逃一个for循环，目的是变换下表
        * 2、循环所有的dd元素并且添加点击事件
        * 3、确定实际发生时间的目标源对象设置其文字颜色为红色，然后给其他所有的元素颜色都充值胃基础颜色(#666)
        * =====================================================================================
        * 
        * 点击dd之后产生的mark标记
        * 思路：
        * 1、先创建一个可以容纳点击的dd元素值的容器（数组），确定数组的起始长度，再砍价一些默认值
        * 2、将点击的dd元素值按照对应下标来写入数组的元素身上
        */

        // 用var定义的变量，for循环是同时进行的，改用let可以解决这个问题

        // 1、找第一个dl下的所有dd元素
        var dlNodes = document.querySelectorAll('#wrapper #content .contentMain #center .right .rightBottom .chooseWrap dl');

        var choose = document.querySelector('#wrapper #content .contentMain #center .right .rightBottom .choose')

        let arr = new Array(dlNodes.length).fill(0);

        for (let i = 0; i < dlNodes.length; i++) {
            let ddNodes = dlNodes[i].querySelectorAll('dd');

            // 2、 遍历当前所有的dd元素
            for (let j = 0; j < ddNodes.length; j++) {

                ddNodes[j].onclick = function () {

                    // 清空choose元素
                    choose.innerHTML = "";

                    for (let k = 0; k < ddNodes.length; k++) {
                        ddNodes[k].style.color = "#666";
                    }
                    // 相同下表的dd元素的字体颜色，在进行覆盖，而其他未点击的元素都是在进行重新设置颜色
                    ddNodes[j].style.color = "red"

                    // 点击哪一个dd元素动态的产生一个新的mark标记元素
                    arr[i] = ddNodes[j].innerText;

                    // 遍历arr数组，将非0元素的值写入到mark标记
                    arr.forEach(function (value) {
                        // 只要是为真的条件，就动态的来创建mark标签
                        if (value) {
                            // 创建div元素
                            let markDiv = document.createElement('div');
                            // 设置class属性
                            markDiv.className = 'mark'
                            markDiv.innerText = value;
                            // 创建a元素
                            let aNode = document.createElement('a');
                            // 设置a元素值
                            aNode.innerText = 'X'
                            // 让div追加a
                            markDiv.appendChild(aNode);

                            // 让choose元素追加div
                            choose.appendChild(markDiv);
                        }
                    })


                }
            }
        }

    }
}

