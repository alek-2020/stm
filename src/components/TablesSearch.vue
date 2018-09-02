<template>
    <input type="text"
           placeholder="Быстрый поиск"
           class="tablesSearch"
           v-model="inputData">
</template>

<script>
export default {
  data() {
    return {
      inputData: ""
    };
  },
  watch: {
    inputData(val) {
      this.$emit("valueChanged", this.inputData);
    }
  }
};
</script>


<style lang="scss">
.tablesSearch {
  height: 35px;
  border-radius: 4px;
  border: solid 1px gray;
  padding: 0 7px;
  flex-shrink: 0;
  font-size: 16px;
  font-family: "Open Sans", sans-serif;
}
</style>


