<template>
     <div class="task-list__header-box">
      <Emoji class="task-list__emoji"
             :taskListIndex="taskListIndex"
             :activeTableIndex="activeTableIndex"
              />
      <transition name="fade">
        <div class="task-list__name-box"
             @dblclick="tableActivation">
          <input class="task-list__name"
                 type="text"
                 :class="{'task-list__name_active':inputActive}"
                 :disabled="!inputActive"
                 ref="listHeaderInput"
                 placeholder="Название списка задач"
                 v-model="name.name"
                 v-show="nameVisible"
                 @focusout='changeListTitle(name.name)'
                 @keyup.enter='changeListTitle(name.name)'>
        </div>
      </transition>
    </div>  
</template>

<script>
import Emoji from "./Emoji";
import { mapState } from "vuex";

export default {
  data: () => {
    return {
      inputActive: false,
      nameVisible: true
    };
  },
  computed: {
    ...mapState(["allTasks", "activeTableIndex", "gradients"])
  },
  methods: {
    fire() {
      return fire;
    },
    tableActivation() {
      let t = this;
      this.inputActive = true;
      window.addEventListener("click", this.checkOuterClick);
    },
    checkOuterClick(el) {
      if (el.target != this.$refs.listHeaderInput) {
        this.inputActive = false;
        window.removeEventListener("click", this.checkOuterClick);
      }
    },
    //Скрытие названия списка при открытом меню
    hideListName(val) {
      if (this.emojiState || this.menuState) {
        this.nameVisible = false;
      } else {
        this.nameVisible = true;
      }
    },
    changeEmojiState(val) {
      this.emojiState = val;
      if (val == true) {
        this.menuState = false;
      }
      this.hideListName(val);
    },
    changeMenuState(val) {
      this.menuState = val;
      if (val == true) {
        this.emojiState = false;
      }
      this.hideListName(val);
    },
    changeListTitle(NewName) {
      const ListId = this.TList.id;
      this.$store.dispatch("changeListTitle", { NewName, ListId });
    }
  },
  props: {
    taskListIndex: Number,
    name: String
  },
  components: {
    Emoji
  }
};
</script>

<style lang="scss">
.task-list {
  &__header-box {
    position: relative;
    width: 100%;
    top: 0;
    height: 60px;
    min-height: 60px;
    display: grid;
    grid-template-columns: max-content auto;
    align-items: center;
    grid-column-gap: 12px;
    padding: 12px;
  }
  &__emoji {
    position: relative;
  }
  &__name {
    border: none;
    background: transparent;
    font-size: 18px;
    color: #1a1919;
    font-weight: 500;
    font-family: "Roboto", sans-serif;
    width: 100%;
    text-overflow: elipsis;
    overflow: hidden;
    padding: 5px;
    border-radius: 4px;
    &_active {
      background: rgba(255, 255, 255, 0.774);
      border: solid 1px rgb(163, 163, 163);
      user-select: unset;
      text-align: left;
    }
  }
  &__name-box {
    z-index: 10;
  }
}
</style>

