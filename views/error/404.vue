<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <p>抱歉，页面不存在</p>
      <RouterLink to="/" class="home-link">
        返回首页
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
}

.content {
  text-align: center;
}

h1 {
  font-size: 6em;
  color: #2196F3;
  margin: 0;
  line-height: 1;
}

p {
  font-size: 1.5em;
  color: #666;
  margin: 20px 0;
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  background: #2196F3;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
}

.home-link:hover {
  background: #1976D2;
}
</style> 