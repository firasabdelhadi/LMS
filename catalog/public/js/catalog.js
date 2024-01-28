function addBook() {

    var title = document.getElementById('book-title').value;
    var author = document.getElementById('book-author').value;
    var year = document.getElementById('book-year').value;
    var isbn = document.getElementById('book-isbn').value;

    frappe.call({
        method: 'catalog.www.catalog.add_book',
        args: {
            title: title,
            author: author,
            year: year,
            isbn: isbn
        },
        callback: function(response) {
            alert(response.message);
            location.reload();
        }
    });
}
