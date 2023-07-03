<template>
  <div class ="container">
    <input v-model="student_idField" placeholder="Student ID" @keyup.enter="save()">
    <input v-model="course_idField" placeholder="Kurs ID" @keyup.enter="save()">
    <input v-model="gradeField" placeholder="Note" @keyup.enter="save()">
    <button type="button" class="styled-button" @click="save()">Save</button>
    <input v-model="filterCritStudent" placeholder="filter Students">
    <input v-model="filterCritCourse" placeholder="filter Courses">
  </div>
  <div class="table-container">
    <table class="showGrades">
      <thead>
      <tr>
        <th>Student ID</th>
        <th>Kurs ID</th>
        <th>Note</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="studentGrades.length === 0">
        <td colspan="4">No courses yet</td>
      </tr>
      <tr v-for="studentGrade in myFilterFunc(filterCritStudent, filterCritCourse)" :key="studentGrade.id">
        <td>{{studentGrade.student_id.id}}</td>
        <td>{{studentGrade.course_id.id}}</td>
        <td>{{studentGrade.grade}}</td>
        <td>
          <button class="btn" @click="deleteGrade(studentGrade.student_id.id, studentGrade.course_id.id)">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
      <tr>
        <td>{{student_idField}}</td>
        <td>{{course_idField}}</td>
        <td>{{gradeField}}</td>
        <td></td>
      </tr>
      </tbody>
    </table>
    <table class="showCourses">
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
      <tr v-for="course in courses" :key="course.id">
        <td>{{course.id}}</td>
        <td>{{course.name}}</td>
      </tr>
      </tbody>
    </table>
    <table class="showStudents">
      <thead>
      <tr>
        <th>Student ID</th>
        <th>Name</th>
        <th>Matrikelnummer</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="students.length === 0">
        <td colspan="3">No students yet</td>
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

    async loadStudents () {
      try {
        const response = await fetch(baseUrl + '/students');
        this.students = await response.json();
      } catch (error) {
        console.log('Error:', error);
      }
    },

    async loadCourses () {
      try {
        const response = await fetch(baseUrl + '/course');
        this.courses = await response.json();
      } catch (error) {
        console.log('Error:', error);
      }
    },

    async loadGrades () {
      try {
        const response = await fetch(endpointUrl);
        this.studentGrades = await response.json();
      } catch (error) {
        console.log('Error:', error);
      }
    },

    resetFields() {
      this.student_idField = '';
      this.course_idField = '';
      this.gradeField = '';
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
      try {
        await this.performDatabaseOperation(endpointUrl, requestOptions);
        this.resetFields();
        await this.loadGrades();
      } catch (error) {
        console.log('Error:', error);
      }
    },

    async deleteGrade(student_id, course_id) {
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      try {
        const deleteUrl = `${endpointUrl}/delete/${student_id}/${course_id}`;
        await this.performDatabaseOperation(deleteUrl, requestOptions);
        await this.loadGrades();
      } catch (error) {
        console.log('Error:', error);
      }
    },

    async performDatabaseOperation(url, requestOptions) {
      return new Promise((resolve, reject) => {
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
              console.log('Success:', data);
              resolve();
            })
            .catch(error => {
              console.log('Error:', error);
              reject(error);
            });
      });
    },

    async setup () {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser()
      }
    }
  },

  async created () {
    await this.setup()
    await this.loadGrades();
    await this.loadStudents();
    await this.loadCourses();
  },

  updated() {
    console.log("UPDATED!")
  }
}
</script>

<style>

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

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  margin-bottom: 20px;
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
  width: 60%;
  order: 2;
  margin-left: 50px;
  margin-right: 50px;
  border: 2px solid #28865b;
  box-sizing: border-box;
  border-radius: 10px;
}

.showCourses{
  width: 20%;
  order: 3;
  border: 2px solid #539f4b;
  box-sizing: border-box;
  border-radius: 10px;
  margin-right: 400px;
  padding-right: 20px;
  padding-left: 20px;
}

.showStudents {
  width: 20%;
  order: 1;
  border: 2px solid #539f4b;
  box-sizing: border-box;
  border-radius: 10px;
  margin-left: 400px;
  padding-right: 20px;
  padding-left: 20px;
}

.table-container {
  display: flex;
}

.btn {
   background-color: #539f4b;
   border: none;
   color: white;
   padding: 6px 9px;
   font-size: 16px;
   cursor: pointer;
   border-radius: 10px;
 }

.btn:hover {
  background-color: #063822;
}

</style>

