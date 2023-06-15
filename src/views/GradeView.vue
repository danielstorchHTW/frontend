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
      students: [],
      courses: [],
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

    loadStudents () {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      }
      fetch(baseUrl + '/students', requestOptions)
          .then(response => response.json())
          .then(result => result.forEach(student => {
            this.students.push(student)
          }))
          .catch(error => console.log('error', error))
    },

    loadCourses () {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      }
      fetch(baseUrl + '/course', requestOptions)
          .then(response => response.json())
          .then(result => result.forEach(course => {
            this.courses.push(course)
          }))
          .catch(error => console.log('error', error))
    },

    loadGrades () {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      }
      fetch(endpointUrl, requestOptions)
          .then(response => response.json())
          .then(result => result.forEach(studentGrade => {
            this.studentGrades.push(studentGrade)
          }))
          .catch(error => console.log('error', error))
    },

    async save() {
      const student = this.students.find(student => student.id === this.student_idField);
      const course = this.courses.find(course => course.id === this.course_idField);
      if (student === undefined || course === undefined) {
        console.log('Student or course not found');
        return;
      }

      const data = {
        student_id: student,
        course_id: course,
        grade: this.gradeField
      }

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
       }

    // const result = await fetch(endpoint, requestOptions).then(r=>r.json());

      fetch(baseUrl + '/students', requestOptions)
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
    this.loadGrades();
    this.loadStudents(); // Fetch students data
    this.loadCourses(); // Fetch courses data
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

