import frappe

def get_context(context):

    
    context.book = "sample1"
    context.catalog = {"title": 'title', "author": 'author', "year": 'year', "isbn": 'isbn'}
    context.library = [{"title": 'example title 1'},{"title": 'example title 2'}]

    catalog = frappe.get_all('Book', fields=['title', 'author', 'year', 'isbn'])
    context.books = catalog

