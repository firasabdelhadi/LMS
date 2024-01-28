import frappe

def get_context(context):

    books = frappe.get_all('Book', fields=['title', 'author', 'year', 'isbn'])
    context.books = books

@frappe.whitelist(allow_guest=True)
def add_book(title, author, year, isbn):
    doc = frappe.new_doc('Book')
    doc.title = title
    doc.author = author
    doc.year = year
    doc.isbn = isbn
    doc.insert()
    frappe.db.commit()
    return 'Book added successfully'


