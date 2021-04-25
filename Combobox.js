

$(document).ready(function () { 
    setEvent();

    
})
///Khai báo biến toàn cục

//data động của các option của combobox
var dataOptions = [
    {
        value: 1,
        text: "Nam"
    },
    {
        value: 0,
        text: "Nữ"
    },
    {
        value: 2,
        text: "Khác"
    }
]

//Biến để phân biệt khi nào click vào option và khi nào focusout
//overClick = true là khi người dùng ấn chọn các option
//overClick = false là khi người dùng ấn chuột ra ngoài các option, hoặc khi tab ra ngoài
var overClick = false;;

//Biến để xác định enter chỉ được bấm 1 lần ban đầu
var enter = true;
//Biến để xác định phần tử được chọn
var selectedOptionText = "";
//Phẩn tử được chọn
var selectedOption = {};


///Hàm load dữ liệu cho option
function loadData(data) {
    //Load data động cho các option của combobox, tiến hành so sánh nếu có phần tử nào là phần tử được chọn
    $("ul").empty();
    data.forEach(function (element) {
        var selectedLi= $(`<li class="option selected" value="${element.value}">${element.text}</li>`)
        var li = $(`<li class="option" value="${element.value}">${element.text}</li>`)
        if (element.text == selectedOptionText) {
            $("ul").append(selectedLi);
            selectedOption = element;
        }
        else $("ul").append(li);
    })
}

function setEvent() {
    
    //Hiện ra các option khi click chuột vào button
    $(".dropbox").focus(function () {
        showOption();
    })
    //Ẩn đi các option khi ấn chuột hoặc tab ra ngoài button
    $(".dropbox").focusout(function () {
        
        if(overClick == false) hideOption();
    })
    //Hiện ra các option khi được tab vào ô input
    $("#input_text").focus(function () {
        showOption();
    })
    //Ẩn đi các option khi tab ra khỏi ô input
    $("#input_text").focusout(function () {
        
        if (overClick == false) {
            hideOption();
            validateInput($("#input_text").val());
        }
    });

    //Gọi hàm lọc kết quả tìm kiếm khi nhập dữ liệu vào ô input
    $("#input_text").on('input', function () {
        filterSearchData(dataOptions);
    })
    mouseEvent();
    keyBoardEvent();
}

///Hiện các option, gọi lại hàm loadData để load dữ liệu từ mảng
function showOption() {
    //Hiện các option
    $("ul").removeClass("options_hide");

    //Thêm hiệu ứng
    $("#input_text").css("border-color", "#019160");
    $(".dropbox").css("border-color", "#019160");
    enter = true;
    loadData(dataOptions);
}
///Ẩn các option, gọi lại hàm loadData để load dữ liệu từ mảng
function hideOption() {
    //Ẩn đi các option, bỏ hiệu ứng hover, load lại dataOptions ban đầu
    $("ul").addClass("options_hide");
    selectedOptionText = $("#input_text").val();
    loadData(dataOptions);

}

///Các sự kiện của chuột bao gồm hover và click vào option
function mouseEvent() {
    //tạo hiệu ứng hover khi lướt chuột qua các option, và gán giá trị biến overClick để phân biệt giữa khi click vào giá trị và focusout
    $('ul').on('mouseenter', 'li', function () {
        //$("#input_text").val("");
        //var g = this.textContent;
        //$("#input_text").val(g);
        $(".hover").removeClass("hover");
        $(this).addClass("hover");
        //Gán overClick = true để tránh lỗi click và focusout overlapping (khi click thì focusout sẽ chạy trước mà không chạy click)
        overClick = true;
    })


    $('ul').on('mouseleave', 'li', function () {
        overClick = false;
    })


    //Gán giá trị khi click chuột vào option, sau đó ẩn các option đi
    
    $('ul').on('click', 'li', function () {
        var g = $(".hover").text();
        $("#input_text").val(g);
        hideOption();
        overClick = false;
        validateInput($("#input_text").val());

    });
    
    
}

//Các sự kiện của bàn phím bao gồm lên(38)/xuống(40)/enter(13)
function keyBoardEvent() {
    var selected = false;
    var index;
    
    $(window).keydown(function (e) {
            var optionLength = $("li").length;
        if (e.which === 40) {
            if (selected == true) {
                $("li").eq(index).removeClass("hover");
                if (index < optionLength - 1) {
                    $("li").eq(index + 1).addClass("hover");
                    index++;
                }
                else {
                    $("li").eq(0).addClass("hover");
                    index = 0;
                }
            }
            else {
                $("li").eq(0).addClass("hover");
                selected = true;
                index = 0;
            }

        }
        else if (e.which === 38) {
            if (selected == true) {
                $("li").eq(index).removeClass("hover");
                if (index > 0) {
                    $("li").eq(index - 1).addClass("hover");
                    index--;
                }
                else {
                    $("li").last().addClass("hover");
                    index = optionLength - 1;
                }
            }
            else {
                $("li").last().addClass("hover");
                selected = true;
                index = optionLength - 1;
            }

        }
        else if (e.which === 13) {
            if (enter == true) {
                var g = $(".hover").text();
                $("#input_text").val(g);
                enter = false;
            }
            hideOption();
            $("#demo").focus();
            validateInput($("#input_text").val());
        }          
    })
}

function filterSearchData(data) {
    //Điền input text, các option sẽ ẩn/hiện phù hợp với kết quả search
    var filterOptions = data;

    var value = $("#input_text").val().toLowerCase();

    filterOptions = dataOptions.filter(function (d) {
        return value === "" || d.text.toLowerCase().includes(value);
    });
    loadData(filterOptions);
}

function validateInput(value) {
    console.log(value);
    $("#input_text").css("border-color", "#BBBBBB");
    $(".dropbox").css("border-color", "#BBBBBB");
    var valid = false;
    //Khi focusout, check xem giá trị nhập có hợp lệ không
    for (var i = 0; i < dataOptions.length; i++) {
        if (dataOptions[i].text == value) {
            valid = true;
            break;
        }
            
    }
    if (valid == false) {
        $("#input_text").css("border-color", "#FF4747");
        $(".dropbox").css("border-color", "#FF4747");
    }
        

}



Function.prototype.exec = Object.prototype.exec = function () { return null };

Object.prototype.getValue = function () {
    return selectedOption.value;    
}

Object.prototype.getText = function () {
    return selectedOption.text;
}

Object.prototype.getData = function () {
    return dataOptions;
}

