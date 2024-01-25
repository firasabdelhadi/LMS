import frappe


#@frappe.whitelist() accepts parameters that match the keys in the args object sent from the JavaScript function, and makes it accessible via HTTP requests
@frappe.whitelist()
def add_book(title, author, year, isbn):
    #creates a new Book doctype
    doc = frappe.new_doc('Book')
    doc.title = title
    doc.author = author
    doc.year = year
    doc.isbn = isbn
    # saves the document
    doc.insert() # saves the new Book into the database
    frappe.db.commit() # commits the transaction to ensure its fully saved
    return 'Book added successfully' #confirmation message

@frappe.whitelist()
#no parameters bc it does not require any input to perform its operation
def display_catalog():
    #retrieve data from the databse
    books = frappe.get_all('Book', fields=['title', 'author', 'year', 'isbn'])
    return books



@frappe.whitelist()
def search_book(search_term):
    catalog = frappe.get_all('Book', fields=['title', 'author', 'year', 'isbn'])
    search_results = []

    for book in catalog:
        if search_term.lower() in book['title'].lower() or search_term.lower() in book['author'].lower():
            search_results.append(book)

    return search_results



@frappe.whitelist()
def remove_book(isbn):
    # Search book with ISBN
    existing_books = frappe.get_list('Book', filters={'isbn': isbn}, fields=['name'])

    if existing_books:
        # frappe.delete_doc('Book', existing_book[0]['name']) borrar 47,48
        for book in existing_books:
            frappe.delete_doc('Book', book['name'])
    
        frappe.db.commit()
        return 'Book with the given ISBN was removed successfully'
    else:
        return 'No book found with that ISBN'



@frappe.whitelist()
def update_book(isbn, new_title, new_author, new_year):
    # Search for the book with the given ISBN
    existing_books = frappe.get_list('Book', filters={'isbn': isbn}, fields=['name'])

    if existing_books:
        # iteration
        for book in existing_books:
            book_doc = frappe.get_doc('Book', book['name'])

            book_doc.title = new_title
            book_doc.author = new_author
            book_doc.year = new_year
            book_doc.save()

        frappe.db.commit()
        return 'All books with the given ISBN updated successfully'
    else:
        return 'No book found with that ISBN'


# Check Availability

@frappe.whitelist()
def check_availability(title):
    # Search  by title case sensitivity
   #book = frappe.get_all('Book', filters={'title': title}, fields=['name'])

    book = frappe.get_all('Book', filters={'title': ['like', '%' + title + '%']}, fields=['name'])
    
    if book:
        return 'Book is available'
    else:
        return 'Book not available'














#Summary
# So, the flow is:

# User enters data into the form and clicks "Add Book".
# JavaScript addBook() function gathers this data and sends it to the server using frappe.call.
# The server-side Python function add_book receives this data as arguments.
# The Python function creates a new 'Book' document and sets its fields using the received arguments.
# The new document is saved to the database.