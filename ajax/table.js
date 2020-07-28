// data table
var info;
var st = 0;
var en = $('select[name=cars] option').filter(':selected').val();
$(document).ready(function main() {
    // var info;



    $.ajax({
        type: "GET",
        url: 'dataset.json',

        success: function (respData) {
            info = respData;


            $(info.data).each(function (i, obj) {
                // console.log(obj[0], " ", obj[1], " ", obj[2], " ", obj[3], " ", obj[4], " ", obj[5]);
                var t = "<tr>" +
                    "<td>" + obj[0] + "</td>" +
                    "<td>" + obj[1] + "</td>" +
                    "<td>" + obj[2] + "</td>" +
                    "<td>" + obj[3] + "</td>" +
                    "<td>" + obj[4] + "</td>" +
                    "<td>" + obj[5] + "</td>" +
                    "</tr>"
                $("#tbody").append(t);

                // return i < 9;
            });

            // show entries----------------------------------------------------------(1)
            $('.select').on('change', function () {
                main();
            });

            // pagination-------------------------------------------------------------(2)
            //how much items per page to show
            var show_per_page = $('select[name=cars] option').filter(':selected').val();
            //getting the amount of elements inside content div
            // var s = $('#tbody').children().size();
            var number_of_items = info.data.length;
            //calculate the number of pages we are going to have
            var number_of_pages = Math.ceil(number_of_items / show_per_page);

            //set the value of our hidden input fields
            $('#current_page').val(0);
            $('#show_per_page').val(show_per_page);
            var cp = $('#current_page').val(0);
            //now when we got all we need for the navigation let's make it '
            // $("#current_v").html("<p>showing" + 1 + " to " + number_of_items + " of " + number_of_items + " entries</p>")
            /*
            what are we going to have in the navigation?
              - link to previous page
              - links to specific pages
              - link to next page
            */
            var navigation_html = '<a class="previous_link" href="javascript:previous();">Prev</a>';
            var current_link = 0;
            $("#current_v").html("<p>showing " + st + " to " + en + " of " + info.data.length + " entries</p>")
            while (number_of_pages > current_link) {
                navigation_html += '<a class="page_link" href="javascript:go_to_page(' + current_link + ')" longdesc="' + current_link + '">' + (current_link + 1) + '</a>';
                current_link++;
            }
            navigation_html += '<a class="next_link" href="javascript:next();">Next</a>';

            $('#page_navigation').html(navigation_html);

            //add active_page class to the first page link
            $('#page_navigation .page_link:first').addClass('active_page');

            //hide all the elements inside content div
            $('#tbody').children().css('display', 'none').addClass('disk');

            //and show the first n (show_per_page) elements
            $('#tbody').children().slice(0, show_per_page).css('display', '');

        },
        error: function (e) {

        }
    });

});

// previous fun
function previous() {

    new_page = parseInt($('#current_page').val()) - 1;
    //if there is an item before the current active link run the function
    if ($('.active_page').prev('.page_link').length == true) {
        go_to_page(new_page);
    }

}
// nxt fun
function next() {
    new_page = parseInt($('#current_page').val()) + 1;
    //if there is an item after the current active link run the function
    if ($('.active_page').next('.page_link').length == true) {
        go_to_page(new_page);
    }

}
// goto page pagination
function go_to_page(page_num) {
    //get the number of items shown per page
    var show_per_page = parseInt($('#show_per_page').val());

    //get the element number where to start the slice from
    start_from = page_num * show_per_page;
    st = start_from
    console.log(start_from, "start");
    //get the element number where to end the slice
    end_on = start_from + show_per_page;
    en = end_on
    console.log(end_on, "end");
    // the current page status throuth p tag -----------------------------------------------------------------(3)
    $("#current_v").html("<p>showing " + st + " to " + en + " of " + info.data.length + " entries</p>")
    //hide all children elements of content div, get specific items and show them

    $('#tbody').children().css('display', 'none').slice(start_from, end_on).css('display', '');

    /*get the page link that has longdesc attribute of the current page and add active_page class to it
    and remove that class from previously active page link*/
    $('.page_link[longdesc=' + page_num + ']').addClass('active_page').siblings('.active_page').removeClass('active_page');

    //update the current page input field
    $('#current_page').val(page_num);
}



// search---------------------------------------------------------------------------(4)
// Search all columns
$('#txt_searchall').keyup(function () {
    // Search Text
    var search = $(this).val();

    // Hide all table tbody rows
    $('table tbody tr').hide();

    // Count total search result
    var len = $('table tbody tr:not(.notfound) td:contains("' + search + '")').length;

    if (len > 0) {
        // Searching text in columns and show match row
        $('table tbody tr:not(.notfound) td:contains("' + search + '")').each(function () {
            $(this).closest('tr').show();
        });
    } else if (len === 0) {


    }
    else {
        $('.notfound').show();
    }

});


// Case-insensitive searching (Note - remove the below script for Case sensitive search )
$.expr[":"].contains = $.expr.createPseudo(function (arg) {
    return function (elem) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

// sorting------------------------------------------------------------------------------(5)
$('th').click(function () {
    var table = $(this).parents('table').eq(0)
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
    this.asc = !this.asc
    if (!this.asc) { rows = rows.reverse() }
    for (var i = 0; i < rows.length; i++) { table.append(rows[i]) }
})
function comparer(index) {
    return function (a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }
}
function getCellValue(row, index) { return $(row).children('td').eq(index).text() }
// sorting end.

// **************************************************************\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\*******************************************


