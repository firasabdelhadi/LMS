var page;
frappe.pages['catalog'].on_page_load = function(wrapper) {
    page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Book Catalog',
        single_column: true
    });

    // page.add_menu_item('Display Catalog', function() {
    //     displayCatalog();
    // });
    // page.add_button('Display Catalog', function() {
    //     displayCatalog(page);
    // });
    
    //    jQuery
    // Create HTML form for adding a book
    // (onclick) is set to call the _____() function
    $(`<div style="margin-bottom: 60px;">
        <p>Title: <input type="text" id="book-title"></p>
        <p>Author: <input type="text" id="book-author"></p>
        <p>Year: <input type="text" id="book-year"></p>
        <p>ISBN: <input type="text" id="book-isbn"></p>
        <button onclick="addBook()">Add Book</button> 
    </div>`).appendTo(page.main);
        

    $(`<div class="catalog-display" style="margin-bottom: 60px;">
        <button onclick="displayCatalog()">Display Catalog</button>
    </div>`).appendTo(page.main);


    $(`<div style="margin-bottom: 60px;">
        <input type="text" id="book-search" placeholder="Search books...">
        <button onclick="searchBook()">Search</button>
        <div id="search-results"></div>
    </div>`).appendTo(page.main);

    $(`<div style="margin-bottom: 60px;">
        <p>Remove Book:</p>
        <p>ISBN: <input type="text" id="remove-book-isbn"></p>
        <button onclick="removeBook()">Remove Book</button>
    </div>`).appendTo(page.main);

    $(`<div style="margin-bottom: 60px;">
        <p>Update Book:</p>
        <p>ISBN: <input type="text" id="update-book-isbn"></p>
        <p>New Title: <input type="text" id="update-book-title"></p>
        <p>New Author: <input type="text" id="update-book-author"></p>
        <p>New Year: <input type="text" id="update-book-year"></p>
        <button onclick="updateBook()">Update Book</button>
    </div>`).appendTo(page.main);
    
    $(`<div style="margin-bottom: 60px;">
        <input type="text" id="book-search" placeholder="Search books...">
        <button onclick="checkAvailability()">Check Availability</button>
        <div id="check-availability"></div>
    </div>`).appendTo(page.main);
};

function addBook() {
    // var bookData = {
    //     title: $('#book-title').val(),
    //     author: $('#book-author').val(),
    //     year: $('#book-year').val(),
    //     isbn: $('#book-isbn').val()
    // };

    // AJAX request to the server
    //sends the data to the server-side function (py file)
	frappe.call({
        //path to the py file
        method: 'catalog.LMS.add_book',
    //     args: { bookData: bookData },
        args: { 
            //the data fetched from the input fields in the form, which are then passed to the server-side function
            title: $('#book-title').val(),
            author: $('#book-author').val(),
            year: $('#book-year').val(),
            isbn: $('#book-isbn').val()
        },
        callback: function(response) {
            alert(response.message);
        }
    });
}

function displayCatalog() {
    frappe.call({
        method: 'catalog.LMS.display_catalog',
        callback: function(response) {
            var books = response.message; //contains the data returned from the server
            var catalogHtml = '<h3>Catalog:</h3>'; //html to display the catalog
            //iteration
            books.forEach(function(book) {
                catalogHtml += `<p>Title: ${book.title}, Author: ${book.author}, Year: ${book.year}, ISBN: ${book.isbn}</p>`;
            });
            //jQuery finds class catalog-display and sets it with catalogHtml
            $(page.main).find('.catalog-display').html(catalogHtml);
        }
    });
}

function searchBook() {
    var searchTerm = $('#book-search').val();

    frappe.call({
        method: 'catalog.LMS.search_book',
        args: { search_term: searchTerm },
        callback: function(response) {
            var books = response.message;
            var resultsHtml = '<h3>Search Results:</h3>';
            if (books.length === 0) {
                resultsHtml += '<p>No books found.</p>';
            } else {
                books.forEach(book => {
                    resultsHtml += `<p>Title: ${book.title}, Author: ${book.author}, Year: ${book.year}, ISBN: ${book.isbn}</p>`;
                });
            }
            $('#search-results').html(resultsHtml);
        }
    });
}

function removeBook() {
    var isbn = $('#remove-book-isbn').val();

    frappe.call({
        method: 'catalog.LMS.remove_book',
        args: { isbn: isbn },
        callback: function(response) {
            alert(response.message);
        }
    });
}

function updateBook() {
    var isbn = $('#update-book-isbn').val();
    var newTitle = $('#update-book-title').val();
    var newAuthor = $('#update-book-author').val();
    var newYear = $('#update-book-year').val();

    frappe.call({
        method: 'catalog.LMS.update_book',
        args: {
            isbn: isbn,
            new_title: newTitle,
            new_author: newAuthor,
            new_year: newYear
        },
        callback: function(response) {
            alert(response.message);
        }
    });
}

function checkAvailability() {
    var title = $('#book-search').val();

    frappe.call({
        method: 'catalog.LMS.check_availability',
        args: { title: title },
        callback: function(response) {
            var message = response.message;
            $('#check-availability').html('<p>' + message + '</p>');
        }
    });
}

