<!-- PublisherIndex.vue -->
<template>
  <div class="row">
    <div style="margin-top: 5%">
      <h2>{{title}}</h2>
      <table>
        <thead>
          <tr>
            <th>Publisher</th>
            <th>Country</th>
            <th>Founded year</th>
            <th>Genere</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='publisher in publishers' :key="publisher._id">
            <td>{{publisher.publisher}}</td>
            <td>{{publisher.country}}</td>
            <td>{{publisher.founded}}</td>
            <td>{{publisher.genere}}</td>
            <td>
              <router-link class="button" :to="`/publisher/show/${publisher._id}`">Show</router-link>
              &nbsp;
              <router-link class="button" :to="`/publisher/edit/${publisher._id}`">Edit</router-link>
              &nbsp;
              <a class="button" v-on:click="deletePublisher(publisher._id)">Erase</a>
            </td>
          </tr>
        </tbody>
      </table>
      <router-link class="button button-primary" to="/publisher/create">New</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Publisher Index",
    data() {
      return {
        title: 'Publishers List',
        publishers: []
      };
    },
    mounted() {
      this.GetAllPublishers()
    },
    methods: {
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
          else if (httpResponse.status === 401) {
            this.$router.push('/login');
          } else {
            this.publishers = [];
            alert(await httpResponse.text());
          }
        } catch (error) {
          console.error(error);
          alert(`An error ocurred geting the publishers.`);
        }
      },
      async deletePublisher(id) {
        if (!confirm('Are you sure delete the selected publisher?'))
          return;
        try {
          const httpResponse = await fetch(`${this.url}/publisher/${id}`, {
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
            alert('The publisher was deleted succesfully');
            this.GetAllPublishers();
          }
        } catch (error) {
          console.error(error);
          alert(`An error ocurred deleting the publishers.`);
        }
      }
    }
  };
</script>