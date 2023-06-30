<template>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Add icon library -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <div class="app-container" id="app" :class="{ 'dark-mode': darkMode }">
    <div class="topnav">
      <a href="home" class="navvv">Home</a>
      <a href="student" class="navvv">Student</a>
      <a href="course" class="navvv">Course</a>
      <a href="grade" class="navvv">Grade</a>
    </div>
    <router-view/>
    <div class="dark-mode-button-container">
      <button class="dark-mode-button" @click="toggleDarkMode">
        <i v-if="darkMode" class="fa fa-sun-o"></i>
        <i v-else class="fa fa-moon-o"></i>
      </button>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.topnav {
  background-color: #539f4b;
  text-align: center;
  overflow: hidden;
  margin-bottom: 20px;
  padding: 7px;
}

.topnav a {
  color: #f2f2f2;
  text-align: right;
  padding: 14px 30px;
  text-decoration: none;
  font-size: 20px;
}

.topnav a:hover {
  background-color: #063822;
  color: #fafafa;
}

.topnav a.active {
  background-color: #04AA6D;
  color: white;
}

.app-container {
  position: relative;
}

.dark-mode-button-container {
  position: absolute;
  top: 2px;
  right: 10px;
  display: flex;
  align-items: center;
}

.dark-mode-button {
  padding: 8px 16px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dark-mode-button:hover {
  background-color: #4b4b4b;
}

/* Dark Mode Styles */

#app.dark-mode table {
  color: #ffffff;
}

html.dark-mode {
  background-color: #333333;
}

</style>

<script>
export default {
  data() {
    return {
      darkMode: false
    };
  },
  created() {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      this.darkMode = storedDarkMode === 'true';
    }
    if (this.darkMode) {
      document.documentElement.classList.add('dark-mode');
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode.toString());
      document.documentElement.classList.toggle('dark-mode');
    }
  }
};
</script>

<script setup>
</script>
