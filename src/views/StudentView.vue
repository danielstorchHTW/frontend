<template>
  <head>
  </head>
  <div>
    <input v-model="nameField" placeholder="Name" @keyup.enter="save()">
    <input v-model="matrikelnrField" placeholder="Matrikelnummer" @keyup.enter="save()">
    <button type="button" @click="save()">Save</button>
    <input v-model="filterCrit" placeholder="filter criterion">
  </div>
  <div>
    <table>
      <thead>
      <tr>
        <th>Student ID</th>
        <th>Name</th>
        <th>Matrikelnummer</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="students.length === 0">
        <td colspan="2">No students yet</td>
      </tr>
      <tr v-for="student in students" :key="student.id">
        <td>{{student.id}}</td>
        <td>{{student.name}}</td>
        <td>{{student.matrikelnr}}</td>
      </tr>
      <tr>
        <td>{{idField}}</td>
        <td>{{nameField}}</td>
        <td>{{matrikelnrField}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

const baseUrl = 'http://localhost:8080';
const endpointUrl = baseUrl + '/students';

export default {
  name: 'DynamicForm',
  data () {
    return {
      students: [],
      idField: '',
      nameField: '',
      matrikelnrField: '',
      claims: '',
      accessToken: '',
      filterCrit: ''
    }
  },
  methods: {
    myFilterFunc (crit) {
      return this.items.filter(
          it => crit.length < 1 ||
              it.name.toLowerCase().includes(crit.toLowerCase()))
    },
    loadStudents () {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
        // headers: {
        //   Authorization: 'Bearer ' + this.accessToken
        // }
      }
      fetch(endpointUrl, requestOptions)
          .then(response => response.json())
          .then(result => result.forEach(student => {
            this.students.push(student)
          }))
          .catch(error => console.log('error', error))
    },
    async save () {
      const data = {
        name: this.nameField,
        matrikelnr: this.matrikelnrField,
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
    this.loadStudents()
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
