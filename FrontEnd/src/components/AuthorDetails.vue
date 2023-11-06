<!-- AuthorDetails.vue -->
<template>
  <div class="row">
    <div class="eleven column" style="margin-top: 5%">
      <h2>{{title}}</h2>
      <form>
        <div class="row">
          <div class="six columns">
            <label for="idInput">Author</label>
            <p v-if="show">{{author.author}}</p>
            <input class="u-full-width" type="text" v-model="author.author" v-if="edit || create">
          </div>
          <div class="six columns">
            <label for="nationalityInput">Nationality</label>
            <p v-if="show">{{author.nationality}}</p>
            <input class="u-full-width" type="text" v-model="author.nationality" v-if="edit || create">
          </div>
        </div>
        <div class="row">
          <div class="six columns">
            <label for="birthInput">Birth Year</label>
            <p v-if="show">{{author.birth_year}}</p>
            <input class="u-full-width" type="number" v-model="author.birth_year" v-if="edit || create">
          </div>
          <div class="six columns">
            <label for="fieldsInput">Fields</label>
            <p v-if="show">{{author.fields}}</p>
            <input class="u-full-width" type="text" v-model="author.fields" v-if="edit || create">
          </div>
        </div>
        <h5>Books</h5>
        <ul>
          <li v-for="book in author.books" :key="book.book_id">
            <router-link :to="`/book/show/${book.book_id}`" v-if="show">{{book.title}}</router-link>
            <template v-if='create || edit'>
              {{book.title}}
              <button class="button" @click="RemoveSelectedBook(book.book_id)">Remove</button>
            </template>
          </li>
        </ul>
        <select class="u-full-width" v-model="selectedBook" @change="onSelectBook()" v-if='create || edit'>
          <option selected value="null">Select a book to add it to author's books</option>
          <option v-for="b in books" :key="b._id" :value="{ book_id: b._id , title: b.title }">
            {{b.title}}
          </option>
        </select>
        <div class="row">
          <router-link class="button button-primary" to="/author">Back</router-link>
          <a v-if='edit' class="button button-primary" style="float: right"
            v-on:click="updateAuthor(author._id)">Update</a>
          <a v-if='create' class="button button-primary" style="float: right" v-on:click="createAuthor()">Create</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import {
    useRoute
  } from 'vue-router'

  export default {
    name: "Author Details",
    props: ['show', 'edit', 'create'],
    data() {
      return {
        title: "Author Data",
        author: {},
        selectedBook: null,
        books: [],
      }
    },
    mounted() {
      const route = useRoute()
      if (route.params.id != null)
        this.GetAuthorById(route.params.id);
      else {
        this.author = {
          '_id': Math.floor(Math.random() * 100000000),
          'author': '',
          'nationality': '',
          'birth_year': null,
          'fields': '',
          books: []
        };
      }
      if (this.create || this.edit) {
        this.GetAllBooks();
      }
    },
    methods: {
      async GetAuthorById(id) {
        try {
          const httpResponse = await fetch(`${this.url}/author/${id}`, {
            headers: {
              'Accept': 'application/json'
            },
            credentials: 'include'
          });

          if (httpResponse.status === 200) {
            this.author = await httpResponse.json();
          } else if (httpResponse.status === 401) {
            this.$router.push('/login');
          } else {
            alert(await httpResponse.text());
            this.$router.push(`/author`);
          }
        } catch (error) {
          console.log(error);
          alert(`An error ocurred geting the author.`);
        }
      },
      async updateAuthor(id) {
        try {
          const httpResponse = await fetch(`${this.url}/author/${id}`, {
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            method: 'PUT',
            body: JSON.stringify(this.author)
          });
          if (httpResponse.status !== 200)
            alert(await httpResponse.text());
          else if (httpResponse.status === 401) {
            this.$router.push('/login');
          } else {
            alert('The author\'s data was updated succesfully');
            this.$router.push('/author');
          }
        } catch (error) {
          console.log(error);
          alert(`An error ocurred updating the author.`);
        }
      },
      async createAuthor() {
        try {
          const httpResponse = await fetch(`${this.url}/author/${this.author._id}`, {
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(this.author)
          });
          if (httpResponse.status !== 200)
            alert(await httpResponse.text());
          else if (httpResponse.status === 401) {
            this.$router.push('/login');
          } else {
            alert('The author was created succesfully');
            this.$router.push('/author');
          }
        } catch (error) {
          console.log(error);
          alert(`An error ocurred updating the author.`);
        }
      },
      async GetAllBooks() {
        try {
          const httpResponse = await fetch(`${this.url}/book`, {
            headers: {
              'Accept': 'application/json'
            },
            credentials: 'include'
          });
          if (httpResponse.status === 200)
            this.books = await httpResponse.json();
          else if (httpResponse.status === 401) {
            this.$router.push('/login');
          } else {
            this.books = [];
            alert(await httpResponse.text());
          }
        } catch (error) {
          console.error(error);
          alert(`An error ocurred geting the books.`);
        }
      },
      RemoveSelectedBook(idBook) {
        this.author.books = this.author.books.filter(b => b.book_id !== idBook);
      },
      onSelectBook() {
        if (!this.selectedBook)
          return;

        if (this.author.books.findIndex(b => b.book_id === this.selectedBook.book_id) !== -1) {
          alert('The selected book was previously added to autor\'s books');
          return;
        }
        this.author.books.push(this.selectedBook);
        this.selectedBook = null;
      }
    }
  };
</script>