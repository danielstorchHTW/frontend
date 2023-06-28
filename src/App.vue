<template>
  <div class="topnav">
    <a href="frontend" class="navvv">Home</a>
    <a href="student" class="navvv">Student</a>
    <a href="course" class="navvv">Course</a>
    <a href="grade" class="navvv">Grade</a>
  </div>

  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/* Add a black background color to the top navigation */
.topnav {
  background-color: #539f4b;
  text-align: center;
  overflow: hidden;
}

/* Style the links inside the navigation bar */
.topnav a {
  color: #f2f2f2;
  text-align: right;
  padding: 14px 30px;
  text-decoration: none;
  font-size:20px;
}


/* Change the color of links on hover */
.topnav a:hover {
  background-color: #063822;
  color: #fafafa;
}

/* Add a color to the active/current link */
.topnav a.active {
  background-color: #04AA6D;
  color: white;
}
</style>
<script setup>
</script>