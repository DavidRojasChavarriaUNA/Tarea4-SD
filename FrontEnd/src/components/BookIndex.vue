<!-- BookIndex.vue -->
<template>
  <div class="row">
    <div style="margin-top: 5%">
      <h2>{{title}}</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Autor</th>
            <th>Publisher</th>
            <th>Edition</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='book in books' :key="book._id">
            <td>{{book.title}}</td>
            <td>{{book.author}}</td>
            <td>{{book.publisher}}</td>
            <td>{{book.edition}}</td>
            <td>
              <router-link class="button" :to="`/book/show/${book._id}`">Show</router-link>
              &nbsp;
              <router-link class="button" :to="`/book/edit/${book._id}`">Edit</router-link>
              &nbsp;
              <a class="button" v-on:click="deleteBook(book._id)">Erase</a>
            </td>
          </tr>
        </tbody>
      </table>
      <router-link class="button button-primary" to="/book/create">New</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Book Index",
    data() {
      return {
        title: 'Book List',
        books: []
      };
    },
    mounted() {
      this.GetAllBooks()
    },
    methods: {
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
          }else {
            this.books = [];
            alert(await httpResponse.text());
          }
        } catch (error) {
          console.error(error);
          alert(`An error ocurred geting the books.`);
        }
      },
      async deleteBook(id) {
        if (!confirm('Are you sure delete the selected book?'))
          return;
        try {
          const httpResponse = await fetch(`${this.url}/book/${id}`, {
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            method: 'DELETE'
          });

          if (httpResponse.status !== 200)
            alert(await httpResponse.text());
          else if (httpResponse.status === 401) {
            this.$router.push('/login');
          } else {
            alert('The book was deleted succesfully');
            this.GetAllBooks();
          }
        } catch (error) {
          console.error(error);
          alert(`An error ocurred deleting the books.`);
        }
      }
    }
  };
</script>