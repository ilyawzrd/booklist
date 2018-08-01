class Book {
  constructor(title, author, publ) {
    this.title = title;
    this.author = author;
    this.publ = publ;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');
    const row = document.createElement('tr');
    row.innerHTML = `<td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.publ}</td>
    <td><a href="#" class="delete">X<a></td>`;
    list.appendChild(row);
  }

  showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('publ').value = '';
  }

}

class Store {

  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(function (book) {
      const ui = new UI;
      ui.addBookToList(book);
    });

  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(publ) {
    const books = Store.getBooks();
    books.forEach(function (book, index) {
      if (book.publ === publ) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listeners for adding a book
document.getElementById('book-form').addEventListener('submit', function (e) {
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    publ = document.getElementById('publ').value

  const book = new Book(title, author, publ);

  const ui = new UI();
  //Validation
  if (title === '' || author === '' || publ === '') {
    // Error alert
    ui.showAlert('Заполните все поля', 'error')
  }
  else {
    ui.addBookToList(book);
    // Add to LS
    Store.addBook(book);
    ui.showAlert('Книга добавлена!', 'success');
    ui.clearFields()
  }

  e.preventDefault();
});


document.getElementById('book-list').addEventListener('click', function (e) {
  const ui = new UI();
  ui.deleteBook(e.target);
  // Remove from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  ui.showAlert('Книга удалена!', 'success')
  e.preventDefault();
})