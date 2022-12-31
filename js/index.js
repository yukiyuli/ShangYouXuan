//作用：需要将所有的DOM元素对象以及相关的资源全部都加载完毕之后，再来实现的事件函数
window.onload = function () {

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
    function bigClassBind(){
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
        //2.设置移入事件
        smallPic.onmouseenter = function(){

            //3. 创建蒙版元素
            var maskDiv = document.createElement('div');
            maskDiv.className = "mask";

            //4.创建大图框元素
            var BigPic = document.createElement('div');
            BigPic.id = "bigPic";

            //5.创建大图片元素
            var BigImg = document.createElement('img');
            BigImg.src = "images/b1.png";

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
                    maskX  = maskMax
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
            smallPic.onmouseleave = function(){

                //让小图框移除蒙版元素
                smallPic.removeChild(maskDiv);

                //让leftTop元素移除大图框
                leftTop.removeChild(BigPic);
            }
        }
    }

}