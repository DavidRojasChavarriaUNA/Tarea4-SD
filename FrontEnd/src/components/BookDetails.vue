<!-- BookDetails.vue -->
<template>
  <div class="row">
    <div class="eleven column" style="margin-top: 5%">
      <h2>{{title}}</h2>
      <form>
        <div class="row">
          <div class="six columns">
            <label for="titleInput">Title</label>
            <p v-if="show">{{book.title}}</p>
            <input class="u-full-width" type="text" v-model="book.title" v-if="edit || create">
          </div>
          <div class="six columns">
            <label for="authorInput">Author</label>
            <router-link :to="`/author/${book.author_id}`" v-if="show">{{book.author}}</router-link>
            <select class="u-full-width" v-model="selectedAuthor" v-if="edit || create" @change="onSelectAuthor()">
              <option selected :value="null">Select an author</option>
              <option v-for="a in authors" :key="a._id" :value="{ _id: a._id , author: a.author }">
                {{a.author}}
              </option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="six columns">
            <label for="publisherInput">Publisher</label>
            <router-link :to="`/publisher/${book.publisher_id}`" v-if="show">{{book.publisher}}</router-link>
            <select class="u-full-width" v-model="selectedPublisher" v-if="edit || create" @change="onSelectPublisher()">
              <option selected :value="null">Select an publisher</option>
              <option v-for="a in publishers" :key="a._id" :value="{ _id: a._id , publisher: a.publisher }">
                {{a.publisher}}
              </option>
            </select>
          </div>
          <div class="six columns">
            <label for="editionInput">Edition</label>
            <p v-if="show">{{book.edition}}</p>
            <input class="u-full-width" type="text" v-model="book.edition" v-if="edit || create">
          </div>
        </div>
        <div class="row">
          <div class="six columns">
            <label for="copyrightInput">Copyright</label>
            <p v-if="show">{{book.copyright}}</p>
            <input class="u-full-width" type="number" v-model="book.copyright" v-if="edit || create">
          </div>
          <div class="six columns">
            <label for="languageInput">Language</label>
            <p v-if="show">{{book.language}}</p>
            <input class="u-full-width" type="text" v-model="book.language" v-if="edit || create">
          </div>
        </div>
        <div class="row">
          <div class="six columns">
            <label for="languageInput">Pages</label>
            <p v-if="show">{{book.pages}}</p>
            <input class="u-full-width" type="number" v-model="book.pages" v-if="edit || create">
          </div>
        </div>
        <div class="row">
          <router-link class="button button-primary" to="/book">Back</router-link>
          <a v-if='edit' class="button button-primary" style="float: right" v-on:click="updateBook(book._id)">Update</a>
          <a v-if='create' class="button button-primary" style="float: right" v-on:click="createBook()">Create</a>
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
    name: "Book Details",
    props: ['show', 'edit', 'create'],
    data() {
      return {
        title: "Book Data",
        book: {},
        selectedAuthor: null,
        selectedPublisher: null,
        authors: [],
        publishers: []
      }
    },
    mounted() {
      const route = useRoute()
      if (route.params.id != null)
        this.GetBookById(route.params.id);
      else {
        this.book = {
          '_id': Math.floor(Math.random()*100000000),
          'title': '',
          'edition': '',
          'copyright': null,
          'language': '',
          'pages': null, //
          'author': null, //
          'author_id': null, //
          'publisher': null, //
          'publisher_id': null //
        };
      }
      if (this.create || this.edit) {
        this.GetAllAuthors();
        this.GetAllPublishers();
      }
    },
    methods: {
      async GetBookById(id) {
        try {
          const httpResponse = await fetch(`${this.url}/book/${id}`, {
            headers: {
              'Accept': 'application/json'
            },
            credentials: 'include'
          });

          if (httpResponse.status === 200) {
            this.book = await httpResponse.json();
            this.selectedAuthor = {
              _id: this.book.author_id,
              author: this.book.author
            };
            this.selectedPublisher = {
              _id: this.book.publisher_id,
              publisher: this.book.publisher
            };
          } else if (httpResponse.status === 401) {
            this.$router.push('/login');
          }else {
            alert(await httpResponse.text());
            this.$router.push(`/book`);
          }
        } catch (error) {
          console.log(error);
          alert(`An error ocurred geting the book.`);
        }
      },
      async updateBook(id) {
        try {
          const httpResponse = await fetch(`${this.url}/book/${id}`, {
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            method: 'PUT',
            body: JSON.stringify(this.book)
          });
          if (httpResponse.status !== 200)
            alert(await httpResponse.text());
          else{
            alert('The book\'s data was updated succesfully');
            this.$router.push('/book');
          }
        } catch (error) {
          console.log(error);
          alert(`An error ocurred updating the book.`);
        }
      },
      async createBook() {
        try {
          const httpResponse = await fetch(`${this.url}/book/${this.book.id}`, {
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(this.book)
          });
          if (httpResponse.status !== 200)
            alert(await httpResponse.text());
          else{
            alert('The book was created succesfully');
            this.$router.push('/book');
          }
        } catch (error) {
          console.log(error);
          alert(`An error ocurred updating the book.`);
        }
      },
      async GetAllAuthors() {
        try {
          const httpResponse = await fetch(`${this.url}/author`, {
            headers: {
              'Accept': 'application/json'
            },
            credentials: 'include'
          });
          if (httpResponse.status === 200)
            this.authors = await httpResponse.json();
          else {
            this.authors = [];
            alert(await httpResponse.text());
          }
        } catch (error) {
          console.error(error);
          alert(`An error ocurred geting the authors.`);
        }
      },
      async GetAllPublishers() {
        try {
          const httpResponse = await fetch(`${this.url}/publisher`, {
            headers: {
              'Accept': 'application/json'
            },
            credentials: 'include'
          });
          if (httpResponse.status === 200)
            this.publishers = await httpResponse.json();
          else {
            this.publishers = [];
            alert(await httpResponse.text());
          }
        } catch (error) {
          console.error(error);
          alert(`An error ocurred geting the publishers.`);
        }
      },
      onSelectAuthor() {
        this.book.author_id = this.selectedAuthor? this.selectedAuthor._id: null;
        this.book.author = this.selectedAuthor? this.selectedAuthor.author: null;
      },
      onSelectPublisher() {
        this.book.publisher_id = this.selectedPublisher? this.selectedPublisher._id: null;
        this.book.publisher = this.selectedPublisher? this.selectedPublisher.publisher: null;
      }
    }
  };
</script>