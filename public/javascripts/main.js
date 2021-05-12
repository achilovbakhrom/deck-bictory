
function toggle(elem) {
    const userId = $(elem).data("id");
    var url = $(elem).prop("checked") ? "/unblock-user" : "/block-user";

    var json = JSON.stringify({ userId });

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onload = function () {
        var users = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.table(users);
        } else {
            console.error(users);
        }
    }
    xhr.send(json);
};

function closeModal() {
    console.log("close")
    $('#add_modal').modal("hide");
    $('#create-form').submit();
}

$(document).ready(function(){

    $(".main-content").scroll(function() {
        let y = $(".main-content").scrollTop();
        if (y >= 600) {
            $(".header-").addClass("header--active")
        } else {
            $(".header-").removeClass("header--active")
        }
    });

    function activeChild(number) {
        for (var i = 1; i < 10; i++) {
            let selector = "ul li:nth-child(" + i + ")";
            $(selector).removeClass("active")
        }
        let activeSelector = "ul li:nth-child(" + number + ")";
        $(activeSelector).addClass("active");
    }

    activeChild(1)

    function defineMenuOrder() {
        let tops = [
            $("#about_bictory").offset().top,
            $("#benefits").offset().top,
            $("#bictory_private").offset().top,
            $("#tokenomics").offset().top,
            $("#team").offset().top,
            $("#roadmap").offset().top,
            $("#fund_usage").offset().top,
            $("#links_resources").offset().top,
            $("#press_releases").offset().top,
        ];
        let foundTop = tops.find(t => t > 10);
        if (foundTop) {
            return tops.indexOf(foundTop)
        } else {
            return tops.length
        }
    }

    $(".main-content").scroll(function() { activeChild(defineMenuOrder()) });

    $("#main-menu > li:nth-child(1)").click(function() { 
        document.querySelector("#about_bictory").scrollIntoView(true)        
    })

    $("#main-menu > li:nth-child(2)").click(function() {
        document.querySelector("#benefits").scrollIntoView(true)
    })

    $("#main-menu > li:nth-child(3)").click(function() {
        document.querySelector("#bictory_private").scrollIntoView(true)
    })

    $("#main-menu > li:nth-child(4)").click(function() {
        document.querySelector("#tokenomics").scrollIntoView(true)
    })

    $("#main-menu > li:nth-child(5)").click(function() {
        document.querySelector("#team").scrollIntoView(true)
    })

    $("#main-menu > li:nth-child(6)").click(function() {
        document.querySelector("#roadmap").scrollIntoView(true)
    })

    $("#main-menu > li:nth-child(7)").click(function() {
        document.querySelector("#fund_usage").scrollIntoView(true)
    })

    $("#main-menu > li:nth-child(8)").click(function() {
        document.querySelector("#links_resources").scrollIntoView(true)
    })

    $("#main-menu > li:nth-child(9)").click(function() {
        document.querySelector("#press_releases").scrollIntoView(true)
    })

    $("#submit").prop('disabled', true);

    $("#checkbox1").change(function() {
        $("#submit").prop('disabled', !$(this).prop("checked"));        
    });

    $("#currency").change(function() {
        let value = $("#value").val();
        let currency = $("#currency").val();
        if (value && currency) {
            let currencyName = currency === 1 ? "USDT" : "USDC";
            $("#convert").val(`${value} ${currencyName} - ${value * 0.6} BT`)
        } else {
            $("#convert").val("")
        }
    })

    $("#value").keyup(function() {
        let value = $(this).val();
        value = isNaN(Number(value)) || !Number(value) ? 1 : Number(value);
        $(this).val(value)
        let currency = $("#currency").val();        
        if (currency) {
            let currencyName = currency === 1 ? "USDT" : "USDC";
            $("#convert").val(`${value} ${currencyName} - ${value * 0.6} BT`)
        } else {
            $("#convert").val("")
        }    
    });

    

    // $(".my-toggle").change(function() {
    //     let id = $(this).data("id");
    //     console.log("userid", id)
    //     $.ajax({
    //         type: "PUT",
    //         contentType: "application/json; charset=utf-8",
    //         url: $(this).prop("checked") ? "/unblock-user" : "/block-user",
    //         data: JSON.stringify({userId: id}),
    //         success: function () {},            
    //         error: function (){},
    //     });
    // })
    
});