<template>
<head>
</head>
<div>
<input v-model="priceField" placeholder="Price" @keyup.enter="save()">
<button type="button" @click="save()">Save</button>
<input v-model="filterCrit" placeholder="filter criterion">
</div>
<div>
<table>
  <thead>
  <tr>
    <th>students</th>
    <th>matrikelnummer</th>
  </tr>
  </thead>
  <tbody>
  <tr v-if="students.length === 0">
    <td colspan="2">No students yet</td>
  </tr>
  <tr v-for="student in students" :key="student.id">
    <td>{{student.students}}</td>
    <td>{{student.matrikelnr}}</td>
    <td>{{student.id}}</td>

  </tr>
  <tr>
    <td>{{ name }}</td>
    <td>{{ matnr }}</td>
  </tr>
  </tbody>
</table>
</div>
</template>

<script>
export default {
  name: 'DynamicForm',
  data () {
    return {
      students: [],
      studentName: '',
      matnr: '',
      claims: '',
    }
  },
  methods: {
    myFilterFunc (crit) {
      return this.items.filter(
          it => crit.length < 1 ||
              it.name.toLowerCase().includes(crit.toLowerCase()))
    },
    loadStudents () {
      const baseUrl = 'http://localhost:8080/students'
      const endpoint = baseUrl
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
        // headers: {
        //   Authorization: 'Bearer ' + this.accessToken
        // }
      }
      fetch(endpoint, requestOptions)
          .then(response => response.json())
          .then(result => result.forEach(student => {
            this.students.push(student)
          }))
          .catch(error => console.log('error', error))
    },
    save () {
      const baseUrl = 'http://localhost:8080'
      const endpoint = baseUrl + '/students'
      const data = {
        name: this.name,
        matrikelnr: this.matnr,
      }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Authorization: 'Bearer ' + this.accessToken
        },
        body: JSON.stringify(data)
      }
      fetch(endpoint, requestOptions)
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