<template>
  <div class="app-container" id="app" :class="{ 'dark-mode': darkMode }">
    <div class="container">
      <input v-model="nameField" placeholder="Name" @keyup.enter="save()">
      <input v-model="matrikelnrField" placeholder="Matrikelnummer" @keyup.enter="save()">
      <button type="button" class="styled-button" @click="save()">Save</button>
      <input v-model="filterCrit" placeholder="filter criterion">
    </div>
    <div>
      <table>
        <thead>
        <tr>
          <th>Student ID</th>
          <th>Name</th>
          <th>Matrikelnummer</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="students.length === 0">
          <td colspan="2">No students yet</td>
        </tr>
        <tr v-for="student in myFilterFunc(filterCrit)" :key="student.id">
          <td>{{student.id}}</td>
          <td>{{student.name}}</td>
          <td>{{student.matrikelnr}}</td>
          <td><button class="btn"><i class="fa fa-trash" @click="deleteStudent(student.id)" ></i></button></td>
        </tr>
        <tr>
          <td>{{idField}}</td>
          <td>{{nameField}}</td>
          <td>{{matrikelnrField}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL;
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
      filterCrit: '',
    }
  },
  methods: {
    myFilterFunc (crit) {
      return this.students.filter(
          it => crit.length < 1 ||
              it.name.toLowerCase().includes(crit.toLowerCase()))
    },

    resetFields() {
      this.nameField = '';
      this.matrikelnrField = '';
    },

    async save() {
      const data = {
        name: this.nameField,
        matrikelnr: this.matrikelnrField,
      };
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      try {
        await this.performDatabaseOperation(endpointUrl, requestOptions);
        this.resetFields();
        await this.loadStudents();
      } catch (error) {
        console.log('Error:', error);
      }
    },

    async deleteStudent(id) {
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      try {
        const deleteUrl = `${endpointUrl}/delete/${id}`;
        await this.performDatabaseOperation(deleteUrl, requestOptions);
      } catch (error) {
        console.log('Error:', error);
      }
      await this.loadStudents();
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

    async loadStudents() {
      try {
        const response = await fetch(endpointUrl);
        this.students = await response.json();
      } catch (error) {
        console.log('Error:', error);
      }
    },

    async setup () {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser()
      }
    }
  },

  async created () {
    await this.setup()
    await this.loadStudents()
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
  border: 2px solid #28865b;
  box-sizing: border-box;
  border-radius: 10px;
  padding-right: 30px;
  padding-left: 30px;
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
.btn {
  background-color: #539f4b;
  border: none;
  color: white;
  padding: 6px 9px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 10px;
}

/* Darker background on mouse-over */
.btn:hover {
  background-color: #063822;
}
</style>
