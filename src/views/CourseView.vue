<template>
  <head>
  </head>
  <div class ="course">
    <input v-model="nameField" placeholder="Name" @keyup.enter="save()">
    <button type="button" @click="save()">Save</button>
    <input v-model="filterCrit" placeholder="filter criterion">
  </div>
  <div>
    <table>
      <thead>
      <tr>
        <th>Course ID</th>
        <th>Name</th>

      </tr>
      </thead>
      <tbody>
      <tr v-if="courses.length === 0">
        <td colspan="2">No courses yet</td>
      </tr>
      <tr v-for="course in myFilterFunc(filterCrit)" :key="course.id">
        <td>{{course.id}}</td>
        <td>{{course.name}}</td>
      </tr>
      <tr>
        <td>{{idField}}</td>
        <td>{{nameField}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

const baseUrl = 'http://localhost:8080';
const endpointUrl = baseUrl + '/course';

export default {
  name: 'DynamicForm',
  data () {
    return {
      courses: [],
      idField: '',
      nameField: '',
      claims: '',
      accessToken: '',
      filterCrit: ''
    }
  },
  methods: {
    myFilterFunc (crit) {
      return this.courses.filter(
          it => crit.length < 1 ||
              it.name.toLowerCase().includes(crit.toLowerCase()))
    },
    loadCourses () {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
        // headers: {
        //   Authorization: 'Bearer ' + this.accessToken
        // }
      }
      fetch(endpointUrl, requestOptions)
          .then(response => response.json())
          .then(result => result.forEach(course => {
            this.courses.push(course)
          }))
          .catch(error => console.log('error', error))
    },
    async save () {
      const data = {
        name: this.nameField,
      }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Authorization: 'Bearer ' + this.accessToken
        },
        body: JSON.stringify(data)
      }

      // const result = await fetch(endpoint, requestOptions).then(r=>r.json());

      fetch(endpointUrl, requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data)
          })
          .catch(error => console.log('error', error))
    },
    async setup () {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser()
        // this.accessToken = await this.$auth.getAccessToken()
      }
    }
  },
  async created () {
    await this.setup()
    this.loadCourses()
  },
  mounted () {
  },
  updated() {
    console.log("UPDATED!")
  }
}
</script>

<style scoped>
table {
  margin-left: auto;
  margin-right: auto;
}
button {
  color: blue;
}
</style>

