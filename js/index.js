/*
相关设置分离到settings.js
*/
//未中奖人员名单
var remainPerson = allPerson.toString().split("|");
//中奖人员名单
var luckyMan = [];
var timer;//定时器
var times = 1;//抽奖次数,如果不是第一次，不加粗显示领导姓名


$(function () {
    //iconAnimation();
    //开始抽奖
    $("#btnStart").text("開始"+"　（共"+remainPerson.length+"人）");//设置按钮文本为开始
    $("#btnStart").on("click", function () {
        //判断是开始还是结束
        if ($("#btnStart").text().substring(0,2) === "開始") {
            if (!$("#txtNum").val()) {
                showDialog("請輸入中獎人數");
                return false;
            }
            if ($("#txtNum").val() > 49) {
                showDialog("一次最多只能輸入49人");
                return false;
            }
            if ($("#txtNum").val() > remainPerson.length) {
                showDialog("當前抽獎人數大於獎池總人數<br>當前抽獎人數：<b>" + $("#txtNum").val() + "</b>人,獎池人數：<b>" + remainPerson.length + "</b>人");
                return false;
            }
            $("#result").fadeOut("fast");
            //显示动画框，隐藏中奖框
            $("#luckyDrawing").show().next().addClass("hide");
            move();
            $("#btnStart").text("停止");
            $("#bgLuckyDrawEnd").removeClass("bg");
        }
        else {
            //PillarsZhang：剩余人数我加的，这边用了全角空格
            var luckyDrawNum = $("#txtNum").val();
            startLuckDraw();//抽奖开始

            $("#luckyDrawing").fadeOut();
            clearInterval(timer);//停止输入框动画展示
            $("#luckyDrawing").val(luckyMan[luckyMan.length - 1]);//输入框显示最后一个中奖名字
            $("#result").fadeIn().find("div").removeClass().addClass("p" + luckyDrawNum);//隐藏输入框，显示中奖框
            $("#bgLuckyDrawEnd").addClass("bg");//添加中奖背景光辉
            $("#txtNum").attr("placeholder", "輸入中獎人數(" + remainPerson.length + ")");
            $("#btnStart").text("開始"+"　（剩餘"+remainPerson.length+"人）");//设置按钮文本为开始
    }
    });

    $("#btnReset").on("click", function () {
        //确认重置对话框
        var confirmReset = false;
        showConfirm("確認重置嗎？所有已中獎的人會重新回到抽獎池！", function () {
            //熏置未中奖人员名单
            remainPerson = allPerson.toString().split("|");
            //中奖人数框置空
            $("#txtNum").val("").attr("placeholder", "請輸入中獎人數");
            $("#showName").val("");
            //隐藏中奖名单,然后显示抽奖框
            $("#result").fadeOut("normal",function(){
                $("#result").html("<div><font size=\"10\">Ready</font></div>");
                $("#result").fadeIn();
                });//动画效果过渡成准备就绪（PillarsZhang）
            $("#bgLuckyDrawEnd").removeClass("bg");//移除背景光辉
            $("#btnStart").text("開始"+"　（共"+remainPerson.length+"人）");//设置按钮文本为开始
            times++;
            console.log(times);

        });
    });
    $("#btnImport").on("click", function () {
        //确认重置对话框
        var confirmReset = false;
        /*
        showImport("匯入", function () {
            //熏置未中奖人员名单
            remainPerson = "";
            remainPerson = allPerson.toString().split(",");
            console.log(allPerson);
            //中奖人数框置空
            $("#txtNum").val("").attr("placeholder", "請輸入中獎人數");
            $("#showName").val("");
            //隐藏中奖名单,然后显示抽奖框
            $("#result").fadeOut("normal",function(){
                $("#result").html("<div><font size=\"10\">Ready</font></div>");
                $("#result").fadeIn();
                });//动画效果过渡成准备就绪（PillarsZhang）
            $("#bgLuckyDrawEnd").removeClass("bg");//移除背景光辉
            $("#btnStart").text("開始"+"　（共"+remainPerson.length+"人）");//设置按钮文本为开始
            times++;
            console.log(times);
        });
        */
    });     
});

$(document).ready(function () {
    $('#btnImport').click(function () {
        $('#select_file').trigger('click');
    })
    $('#select_file').change(function () {
        importf(this);
    })
})

//抽奖主程序
function startLuckDraw() {
    //抽奖人数
    var luckyDrawNum = $("#txtNum").val();
    if (luckyDrawNum > remainPerson.length) {
        alert("抽獎人數大於獎池人數！請修改人数。或者點重置開始新一輪抽獎！");
        return false;
    }
    //随机中奖人
    var randomPerson = getRandomArrayElements(remainPerson, luckyDrawNum);
    var tempHtml = "";
    $.each(randomPerson, function (i, person) {
        if (leaderArr.indexOf(person) > -1 && times == 1) {
            tempHtml += "<span><b>" + person + "</b></span>";
        }
        else {
            tempHtml += "<span>" + person + "</span>";
        }
    });
    $("#result>div").html(tempHtml);
    //剩余人数剔除已中奖名单
    remainPerson = remainPerson.delete(randomPerson);
    //中奖人员
    luckyMan = luckyMan.concat(randomPerson);
    //设置抽奖人数框数字为空

    if (setEmptyPerson) { $("#txtNum").val("");};
    /*
    PillarsZhang补充：有时候不需要每次都把人数框清空
    根据需求来吧，在settings.js里改
    */

}

//参考这篇文章：http://www.html-js.com/article/JS-rookie-rookie-learned-to-fly-in-a-moving-frame-beating-figures
//跳动的数字
function move() {
    var $showName = $("#showName"); //显示内容的input的ID
    var interTime = 30;//设置间隔时间
    timer = setInterval(function () {
        var i = GetRandomNum(0, remainPerson.length);
        $showName.val(remainPerson[i]);//输入框赋值
    }, interTime);
}

//顶上的小图标，随机动画
function iconAnimation() {
    var interTime = 200;//设置间隔时间
    var $icon = $("#iconDiv>span");
    var arrAnimatoin = ["bounce", "flash", "pulse", "rubberBand", "shake", "swing", "wobble", "tada"];
    var timer2 = setInterval(function () {
        var i = GetRandomNum(0, $icon.length);
        var j = GetRandomNum(0, arrAnimatoin.length);
        //console.log("i:" + i + ",j:" + j);
        $($icon[i]).removeClass().stop().addClass("animated " + arrAnimatoin[j]);//输入框赋值
    }, interTime);

}
function importf(obj) {//匯入
    var wb;//讀取完成的資料
    var rABS = false; //是否將檔案讀取為二進位制字串

    if (!obj.files) {
        return;
    }
    var f = obj.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var data = e.target.result;
        if (rABS) {
            wb = XLSX.read(btoa(fixdata(data)), {//手動轉化
                type: 'base64'
            });
        } else {
            wb = XLSX.read(data, {
                type: 'binary'
            });
        }
        console.log("READ");
        // 獲取 EXCEL json資料
        var jsondata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        var column = [];
        var data = [column];
        for (var key in jsondata[0]) {
            data[0].push(key);
        }
        for (var i = 0; i < jsondata.length; i++) {
            var row = [];
            data.push(row);
            for (var key in jsondata[i]) {
                data[i + 1].push(jsondata[i][key]);
            }
        }
        console.log(data);

        allPerson = ConvertExcel(data);

        remainPerson = "";
        remainPerson = allPerson.toString().split("|");
        console.log(allPerson);
        //中奖人数框置空
        $("#txtNum").val("").attr("placeholder", "請輸入中獎人數");
        $("#showName").val("");
        //隐藏中奖名单,然后显示抽奖框
        $("#result").fadeOut("normal",function(){
            $("#result").html("<div><font size=\"10\">Ready</font></div>");
            $("#result").fadeIn();
            });//动画效果过渡成准备就绪（PillarsZhang）
        $("#bgLuckyDrawEnd").removeClass("bg");//移除背景光辉
        $("#btnStart").text("開始"+"　（共"+remainPerson.length+"人）");//设置按钮文本为开始
        times++;
        console.log(times);
    };
    if (rABS) {
        reader.readAsArrayBuffer(f);
    } else {
        reader.readAsBinaryString(f);
    }
}

function fixdata(data) { //檔案流轉BinaryString
    var o = "",
        l = 0,
        w = 10240;
    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
}

function ConvertExcel(data) {
    var CombineString = "";
    var RawData;
    console.log("ConvertExcel");
    for (var raw = 1; raw < data.length; raw++) {
        console.log(raw);
        RawData = "";
        for (var column = 0; column < data[raw].length; column++) {
            console.log(data[raw][column]);
            if (RawData == "") {
                RawData = data[raw][column];
            } else {
                RawData = RawData + " - " + data[raw][column];
            }
        }

        if (CombineString == "") {
            CombineString = RawData;
        } else {
            CombineString = CombineString + "|" + RawData;
        }
        console.log(CombineString);
    }

    return CombineString;
}