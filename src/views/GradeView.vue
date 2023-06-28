<template>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Add icon library -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <div class ="container">
    <input v-model="student_idField" placeholder="Student ID" @keyup.enter="save()">
    <input v-model="course_idField" placeholder="Kurs ID" @keyup.enter="save()">
    <input v-model="gradeField" placeholder="Note" @keyup.enter="save()">
    <button type="button" class="styled-button" @click="save()">Save</button>
    <input v-model="filterCritStudent" placeholder="filter Students">
    <input v-model="filterCritCourse" placeholder="filter Courses">

  </div>
  <div class ="table-container">
    <table class ="showGrades">
      <thead>
      <tr>
        <th></th>
        <th>Student ID</th>
        <th>Kurs ID</th>
        <th>Note</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="studentGrades.length === 0">
        <td colspan="2">No courses yet</td>
      </tr>
      <tr v-for="studentGrade in myFilterFunc(filterCritStudent, filterCritCourse)" :key="studentGrade.id">
        <td><button class="btn"><i class="fa fa-trash" @click="deleteGrade(studentGrade.student_id.id, studentGrade.course_id.id)" ></i></button></td>
        <td>{{studentGrade.student_id.id}}</td>
        <td>{{studentGrade.course_id.id}}</td>
        <td>{{studentGrade.grade}}</td>
      </tr>
      <tr>
        <td></td>
        <td>{{student_idField}}</td>
        <td>{{course_idField}}</td>
        <td>{{gradeField}}</td>
      </tr>
      </tbody>
    </table>
    <table class = "showCourses">
      <thead>
      <h3>Courses:</h3>

      <tr>
        <th>Course ID</th>
        <th>Name</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="courses.length === 0">
        <td colspan="2">No courses yet</td>
      </tr>
      <tr v-for="course in courses" :key="course.id">
        <td>{{course.id}}</td>
        <td>{{course.name}}</td>
      </tr>
      </tbody>
    </table>
    <table class = "showStudents">
      <thead>
      <h3>Students:</h3>
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
      </tbody>
    </table>
  </div>
</template>

<script>

const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL;
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
      filterCritStudent: '',
      filterCritCourse: ''
    }
  },
  methods: {
    myFilterFunc(critStudent, critCourse) {
      return this.studentGrades.filter(
          it =>
              (critStudent.length < 1 || it.student_id.id == critStudent) &&
              (critCourse.length < 1 || it.course_id.id == critCourse)
      );
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
      const student = this.students.find(s => s.id == this.student_idField);
      const course = this.courses.find(c => c.id == this.course_idField);

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

      fetch(endpointUrl, requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data)
          })
          .catch(error => console.log('error', error))
      location.reload();
    },

    async deleteGrade(student_id, course_id) {

      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }

      fetch(endpointUrl + '/delete/' + student_id + '/' + course_id, requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
          })
          .catch(error => console.log('Error:', error));
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
button:hover {
  background-color: #063822; /* Green */
  color: #fffdfd;
}

button.styled-button:hover {
  background-color: #063822; /* Green */
  color: #fffdfd;
}

button {
  background-color: #ffffff; /* Green */
  border-style: solid;
  border-spacing: 1px;
  color: #000000;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0px;
}


button {
  background-color: #ffffff;
  border-style: solid;
  border-spacing: 1px;
  color: #000000;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
}

input, button.styled-button {
  background-color: #ffffff;
  border-style: solid;
  border-width: 1px;
  border-color: #000000;
  color: #000000;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

button.styled-button {
  cursor: pointer; /* Add a cursor pointer when hovering over the button */
}
.showGrades{
  float: none;
  width: 33.33%;
}

.showCourses{
  float: right;
  margin-right: 10px;
}

.showStudents {
  float: left;
  margin-right: 10px;
}
.table-container {
  clear: both;
}
 .btn {
   background-color: #539f4b;
   border: none;
   color: white;
   padding: 12px 16px;
   font-size: 16px;
   cursor: pointer;
 }

/* Darker background on mouse-over */
.btn:hover {
  background-color: #063822;
}

</style>

