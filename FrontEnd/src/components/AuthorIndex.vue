<!-- AuthorIndex.vue -->
<template>
  <div class="row">
    <div style="margin-top: 5%">
      <h2>{{title}}</h2>
      <table>
        <thead>
          <tr>
            <th>Autor</th>
            <th>Nationality</th>
            <th>Birth year</th>
            <th>Fields</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='author in authors' :key="author._id">
            <td>{{author.author}}</td>
            <td>{{author.nationality}}</td>
            <td>{{author.birth_year}}</td>
            <td>{{author.fields}}</td>
            <td>
              <router-link class="button" :to="`/author/show/${author._id}`">Show</router-link>
              &nbsp;
              <router-link class="button" :to="`/author/edit/${author._id}`">Edit</router-link>
              &nbsp;
              <a class="button" v-on:click="deleteAuthor(author._id)">Erase</a>
            </td>
          </tr>
        </tbody>
      </table>
      <router-link class="button button-primary" to="/author/create">New</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Author Index",
    data() {
      return {
        title: 'Authors List',
        authors: []
      };
    },
    mounted() {
      this.GetAllAuthors()
    },
    methods: {
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
          else if (httpResponse.status === 401) {
            this.$router.push('/login');
          } else {
            this.authors = [];
            alert(await httpResponse.text());
          }
        } catch (error) {
          console.error(error);
          alert(`An error ocurred geting the authors.`);
        }
      },
      async deleteAuthor(id) {
        if (!confirm('Are you sure delete the selected author?'))
          return;
        try {
          const httpResponse = await fetch(`${this.url}/author/${id}`, {
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
            alert('The author was deleted succesfully');
            this.GetAllAuthors();
          }
        } catch (error) {
          console.error(error);
          alert(`An error ocurred deleting the authors.`);
        }
      }
    }
  };
</script>