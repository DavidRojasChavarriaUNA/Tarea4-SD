<!-- PublisherDetails.vue -->
<template>
  <div class="row">
    <div class="eleven column" style="margin-top: 5%">
      <h2>{{title}}</h2>
      <form>
        <div class="row">
          <div class="six columns">
            <label for="idInput">Publisher</label>
            <p v-if="show">{{publisher.publisher}}</p>
            <input class="u-full-width" type="text" v-model="publisher.publisher" v-if="edit || create">
          </div>
          <div class="six columns">
            <label for="nationalityInput">Country</label>
            <p v-if="show">{{publisher.country}}</p>
            <input class="u-full-width" type="text" v-model="publisher.country" v-if="edit || create">
          </div>
        </div>
        <div class="row">
          <div class="six columns">
            <label for="birthInput">Founded Year</label>
            <p v-if="show">{{publisher.founded}}</p>
            <input class="u-full-width" type="number" v-model="publisher.founded" v-if="edit || create">
          </div>
          <div class="six columns">
            <label for="fieldsInput">Genere</label>
            <p v-if="show">{{publisher.genere}}</p>
            <input class="u-full-width" type="text" v-model="publisher.genere" v-if="edit || create">
          </div>
        </div>
        <h5>Books</h5>
        <ul>
          <li v-for="book in publisher.books" :key="book.book_id">
            <router-link :to="`/book/show/${book.book_id}`" v-if="show">{{book.title}}</router-link>
            <template v-if='create || edit'>
              {{book.title}}
              <button class="button" @click="RemoveSelectedBook(book.book_id)">Remove</button>
            </template>
          </li>
        </ul>
        <select class="u-full-width" v-model="selectedBook" @change="onSelectBook()" v-if='create || edit'>
          <option selected value="null">Select a book to add it to publisher's books</option>
          <option v-for="b in books" :key="b._id" :value="{ book_id: b._id , title: b.title }">
            {{b.title}}
          </option>
        </select>
        <div class="row">
          <router-link class="button button-primary" to="/publisher">Back</router-link>
          <a v-if='edit' class="button button-primary" style="float: right"
            v-on:click="updatePublisher(publisher._id)">Update</a>
          <a v-if='create' class="button button-primary" style="float: right" v-on:click="createPublisher()">Create</a>
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
    name: "Publisher Details",
    props: ['show', 'edit', 'create'],
    data() {
      return {
        title: "Publisher Data",
        publisher: {},
        selectedBook: null,
        books: [],
      }
    },
    mounted() {
      const route = useRoute()
      if (route.params.id != null)
        this.GetPublisherById(route.params.id);
      else {
        this.publisher = {
          '_id': Math.floor(Math.random() * 100000000),
          'publisher': '',
          'country': '',
          'founded': null,
          'genere': '',
          books: []
        };
      }
      if (this.create || this.edit) {
        this.GetAllBooks();
      }
    },
    methods: {
      async GetPublisherById(id) {
        try {
          const httpResponse = await fetch(`${this.url}/publisher/${id}`, {
            headers: {
              'Accept': 'application/json'
            },
            credentials: 'include'
          });

          if (httpResponse.status === 200) {
            this.publisher = await httpResponse.json();
          } else if (httpResponse.status === 401) {
            this.$router.push('/login');
          } else {
            alert(await httpResponse.text());
            this.$router.push(`/publisher`);
          }
        } catch (error) {
          console.log(error);
          alert(`An error ocurred geting the publisher.`);
        }
      },
      async updatePublisher(id) {
        try {
          const httpResponse = await fetch(`${this.url}/publisher/${id}`, {
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            method: 'PUT',
            body: JSON.stringify(this.publisher)
          });
          if (httpResponse.status !== 200)
            alert(await httpResponse.text());
          else if (httpResponse.status === 401) {
            this.$router.push('/login');
          } else {
            alert('The publisher\'s data was updated succesfully');
            this.$router.push('/publisher');
          }
        } catch (error) {
          console.log(error);
          alert(`An error ocurred updating the publisher.`);
        }
      },
      async createPublisher() {
        try {
          const httpResponse = await fetch(`${this.url}/publisher/${this.publisher._id}`, {
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(this.publisher)
          });
          if (httpResponse.status !== 200)
            alert(await httpResponse.text());
          else if (httpResponse.status === 401) {
            this.$router.push('/login');
          } else {
            alert('The publisher was created succesfully');
            this.$router.push('/publisher');
          }
        } catch (error) {
          console.log(error);
          alert(`An error ocurred updating the publisher.`);
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
        this.publisher.books = this.publisher.books.filter(b => b.book_id !== idBook);
      },
      onSelectBook() {
        if (!this.selectedBook)
          return;

        if (this.publisher.books.findIndex(b => b.book_id === this.selectedBook.book_id) !== -1) {
          alert('The selected book was previously added to publisher\'s books');
          return;
        }
        this.publisher.books.push(this.selectedBook);
        this.selectedBook = null;
      }
    }
  };
</script>