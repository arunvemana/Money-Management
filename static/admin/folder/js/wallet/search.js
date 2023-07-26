$('#search_form').submit(function(event) {
    event.preventDefault();

    var check = $('#searchdata').val()

    if (check){
        check = check.toLowerCase()
    }
    var searchValue = document.querySelector('input[name="search-param"]').value;
    searchValue = searchValue.toLowerCase()

    var check_1 = $('#filter_name').val()
    const radioButtons = document.getElementsByName("filter");
    let selectedValue = null;
    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            selectedValue = radioButtons[i].value;
            break; // Exit the loop once the selected radio button is found
        }
    }

    if ( check === searchValue && check_1 === selectedValue){

    }
    else{
        get_datas(1);
    }
});


function get_datas(chaek){
    $.ajax({
            url: '/search/',
            method: 'POST',
            data: $('#search_form').serialize(),
            dataType: 'JSON',
            success: function (data) {
                $('[name="search-param"]').focus();
                $('#search_page').css('display', 'block')
                $('#search_page_1').css('display', 'block')
                $('#searchdata').val(data.params)
                $('#filter_name').val(data.filter_name)
                if (data.status === true){
                    var count_1 = 0
                    var count_2 = 0
                    if (chaek === 1){
                        remove_all()
                        for (var i = 0; i < data.data_list.length; i++) {
                            renderTableRows_1(data.data_list[i], data.data_list.length-i)
                        }
                    }
                    for (var i = 0; i < data.data_list.length; i++) {
                        if (data.data_list[i].type.type_name.toLowerCase() === 'transfer'){
                            count_1 += 1
                        }
                        else{
                            count_2 += 1
                        }
                    }

                    if (count_1 >= 1){
                        $('#nodatass_1').css('display', 'none')
                    }
                    else {
                        $('#nodatass_1').css('display', 'block')
                        $('#nodatass_1').css('text-align', 'center')
                    }
                    if (count_2 >= 1){
                        $('#nodatass').css('display', 'none')
                    }
                    else {
                        $('#nodatass').css('display', 'block')
                        $('#nodatass').css('text-align', 'center')
                    }
                    $('#bal-1').val(data.temp_add)
                    $('#bal-2').val(data.temp_sub)

                }
                else{
                    remove_all()
                    $('#bal-1').val(0)
                    $('#bal-2').val(0)
                    $('#nodatass').css('display', 'block')
                    $('#nodatass').css('text-align', 'center')
                    $('#nodatass_1').css('display', 'block')
                    $('#nodatass_1').css('text-align', 'center')
                }
            },

            error: function () {
                alert('Something is Wrong');
            }
        });
}


function renderTableRows_1(dataArray, id) {
    const formattedDate = formatDate(dataArray.date_name);
    const rowHTML = createTableRow_1(dataArray, formattedDate, id)
    const newRow = document.createElement("tr");
    newRow.style.background = rowHTML[1];
    newRow.id = 'tra_'+ dataArray.id;
    newRow.innerHTML = rowHTML[0];
    let tableBody = ''
    if (dataArray.type.type_name.toLowerCase() === 'transfer'){
        tableBody = document.querySelector("#myTable_1 tbody");
    }
    else {
        tableBody = document.querySelector("#myTable tbody");
    }
    tableBody.insertBefore(newRow, tableBody.firstChild);
}


function createTableRow_1(i, formattedDate, id) {
    if (i.type.type_name.toLowerCase() === 'transfer'){
        var searchValue = document.querySelector('input[name="search-param"]').value;
        var filter_name = $('#filter_name').val();
        if (filter_name === 'all'){
            color_ = '#000'
            che = '#a3a6a4';
        }
        else{
            console.log(i.from_account.account_name.toLowerCase() + "  " + i.to_account.account_name.toLowerCase())
            if ( i.from_account.account_name.toLowerCase().includes(searchValue.toLowerCase()) ){
                color_ = '#ff0000'
                che = '#f8cbcb';
            }
            else if ( i.to_account.account_name.toLowerCase().includes(searchValue.toLowerCase()) ){
                color_ = '#000fff'
                che = '#cbf8cb';
            }
            else{
                color_ = '#000'
                che = '#a3a6a4';
            }
        }
        return [(
            '<td id="' + id + '" >' + id + '</td>' +
            '<td>' + formattedDate + '</td>' +
            '<td>' + i.from_account.account_name + '</td>' +
            '<td>' + i.to_account.account_name + '</td>' +
            '<td style="color: '+ color_ +' !important;">' + i.amount + ' ₹</td>' +
            '<td>' + i.note + '</td>' +
            '<td>' +
            '    <a href="javascript:void(0)" onclick="updateModel(' + i.id + ',' + 0 + ')" class="bg-info mr-2">' +
            '        <span class="label label-success">\n' +
            '            Edit\n' +
            '    </span>' +
            '    </a>' +
            '    <a href="javascript:void(0)" onclick="Delete(' + i.id + ',' + id + ',' + 0 + ')" class="bg-info ml-2">' +
            '        <span class="label label-danger">' +
            '            Delete' +
            '        </span>' +
            '    </a>' +
            '</td>'
        ), che]
    }
    else{
        var color_ = ''
        var che = 0;
        if (i.type.type_name.toLowerCase() === 'available' || i.type.type_name.toLowerCase() === 'income' ){
            color_ = '#000fff'
            che = '#cbf8cb';
        }
        else if ( i.type.type_name.toLowerCase() === 'expense' ){
            color_ = '#ff0000'
            che = '#f8cbcb';
        }
        else{
            color_ = '#000'
            che = '#a3a6a4';
        }

        return [(
            '<td id="' + id + '">' + id + '</td>' +
            '<td>' + formattedDate + '</td>' +
            '<td>' + i.category.cat_name + '</td>' +
            '<td>' + i.account.account_name + '</td>' +
            '<td style="color: '+ color_ +' !important;">' + i.amount + ' ₹</td>' +
            '<td>' + i.note + '</td>' +
            '<td>' +
            '    <a href="javascript:void(0)" onclick="updateModel(' + i.id + ',' + 0 + ')" class="bg-info mr-2">' +
            '        <span class="label label-success">\n' +
            '            Edit\n' +
            '    </span>' +
            '    </a>' +
            '    <a href="javascript:void(0)" onclick="Delete(' + i.id + ',' + id + ',' + 0 + ')" class="bg-info ml-2">' +
            '        <span class="label label-danger">' +
            '            Delete' +
            '        </span>' +
            '    </a>' +
            '</td>'
        ), che]
    }
}

function remove_all(){
    const tbodyElements = document.querySelectorAll('tbody');

    // Step 2: Loop through the tbody elements
    tbodyElements.forEach((tbody) => {
        // Step 3: Get the parent (table) element
        const table = tbody.parentElement;

        // Step 4: Move children of tbody to the parent table
        while (tbody.firstChild) {
            tbody.firstChild.remove();
            // table.appendChild(tbody.firstChild.remove());
        }

        // Step 5: Remove the empty tbody element
    });

}

function data_is(){
    const tableBody = document.querySelector("#myTable tbody tr");


    if (tableBody) {
        $('#nodatass').css('display', 'none')
    }
    else{
         $('#nodatass').css('display', 'block')
         $('#nodatass').css('text-align', 'center')
    }
    const tableBody_1 = document.querySelector("#myTable_1 tbody tr");
    console.log(tableBody)
    console.log(tableBody_1)

    if (tableBody_1) {
        $('#nodatass_1').css('display', 'none')
    }
    else{
         $('#nodatass_1').css('display', 'block')
         $('#nodatass_1').css('text-align', 'center')
    }
}