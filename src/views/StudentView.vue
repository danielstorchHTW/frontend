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

import {flushPromises} from "@vue/test-utils";

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
      darkMode: false
    }
  },
  methods: {
    myFilterFunc (crit) {
      return this.students.filter(
          it => crit.length < 1 ||
              it.name.toLowerCase().includes(crit.toLowerCase()))
    },

    async save () {
      const data = {
        name: this.nameField,
        matrikelnr: this.matrikelnrField
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
      this.resetFields();
      await this.loadStudents();

     // location.reload();
    },
    async loadStudents() {
      this.students = []; // Zurücksetzen der Studentenliste
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      try {
        // Künstliche Verzögerung von 2 Sekunden einführen
        await new Promise((resolve) => {
          setTimeout(resolve, 400);
        });

        const response = await fetch(endpointUrl, requestOptions);
        const result = await response.json();
        this.students = result;
      } catch (error) {
        console.log('error', error);
      }
    },
    resetFields() {
      this.nameField = '';
      this.matrikelnrField = '';
      this.filterCrit = '';
    },

    async deleteStudent(id) {

      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }

      fetch(endpointUrl + '/delete/' + id, requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
          })
          .catch(error => console.log('Error:', error));
      await flushPromises();
     // location.reload();
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
  padding: 10px 0px;
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
