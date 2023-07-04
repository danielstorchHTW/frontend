<template>
  <div class ="container">
    <input v-model="nameField" placeholder="Name" @keyup.enter="save()">
    <button type="button" class="styled-button" @click="save()">Save</button>
    <input v-model="filterCrit" placeholder="filter criterion">
  </div>
  <div>
    <table>
      <thead>
      <tr>
        <th>Course ID</th>
        <th>Name</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="courses.length === 0">
        <td colspan="2">No courses yet</td>
      </tr>
      <tr v-for="course in myFilterFunc(filterCrit)" :key="course.id">
        <td>{{course.id}}</td>
        <td>{{course.name}}</td>
        <td><button class="btn"><i class="fa fa-trash" @click="deleteCourse(course.id)" ></i></button></td>
      </tr>
      <tr>
        <td>{{idField}}</td>
        <td>{{nameField}}</td>
        <td></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL;
const endpointUrl = baseUrl + '/course';

export default {
  name: 'DynamicForm',
  data() {
    return {
      courses: [],
      idField: '',
      nameField: '',
      claims: '',
      accessToken: '',
      filterCrit: '',
    };
  },
  methods: {
    myFilterFunc(crit) {
      return this.courses.filter(
          it =>
              crit.length < 1 ||
              it.name.toLowerCase().includes(crit.toLowerCase())
      );
    },

    resetFields() {
      this.nameField = '';
    },

    async save() {
      const data = {
        name: this.nameField,
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
        await this.loadCourses();
      } catch (error) {
        console.log('Error:', error);
      }
    },

    async deleteCourse(id) {
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
      await this.loadCourses();
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

    async loadCourses() {
      try {
        const response = await fetch(endpointUrl);
        this.courses = await response.json();
      } catch (error) {
        console.log('Error:', error);
      }
    },

    async setup() {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser();
      }
    },
  },

  async created() {
    await this.setup();
    await this.loadCourses();
  },

  updated() {
    console.log('UPDATED!');
  },
};
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
  float: none;
  margin-left: 10px;
}

/* Darker background on mouse-over */
.btn:hover {
  background-color: #063822;
}
</style>

