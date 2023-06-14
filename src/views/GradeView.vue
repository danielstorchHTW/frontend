<template>
  <head>
  </head>
  <div class ="grade">
    <input v-model="student_idField" placeholder="Student ID" @keyup.enter="save()">
    <input v-model="course_idField" placeholder="Kurs ID" @keyup.enter="save()">
    <input v-model="gradeField" placeholder="Note" @keyup.enter="save()">
    <button type="button" @click="save()">Save</button>
    <input v-model="filterCrit" placeholder="filter criterion">
  </div>
  <div>
    <table>
      <thead>
      <tr>
        <th>Bewertungs ID</th>
        <th>Student ID</th>
        <th>Kurs ID</th>
        <th>Note</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="studentGrades.length === 0">
        <td colspan="2">No courses yet</td>
      </tr>
      <tr v-for="studentGrade in studentGrades" :key="studentGrade.id">
        <td>{{studentGrade.id}}</td>
        <td>{{studentGrade.student_id}}</td>
        <td>{{studentGrade.course_id}}</td>
        <td>{{studentGrade.grade}}</td>
      </tr>
      <tr>
        <td>{{idField}}</td>
        <td>{{student_idField}}</td>
        <td>{{course_idField}}</td>
        <td>{{gradeField}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

const baseUrl = 'http://localhost:8080';
const endpointUrl = baseUrl + '/grades';

export default {
  name: 'DynamicForm',
  data () {
    return {
      studentGrades: [],
      idField: '',
      student_idField: '',
      course_idField: '',
      gradeField: '',
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
    loadGrades () {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
        // headers: {
        //   Authorization: 'Bearer ' + this.accessToken
        // }
      }
      fetch(endpointUrl, requestOptions)
          .then(response => response.json())
          .then(result => result.forEach(studentGrade => {
            this.studentGrades.push(studentGrade)
          }))
          .catch(error => console.log('error', error))
    },
    async save () {
      const data = {
        student_id: this.student_idField,
        course_id: this.course_idField,
        grade: this.gradeField
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
    this.loadGrades()
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

