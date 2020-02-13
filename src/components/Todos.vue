<template>
  <div>
    <card-content>
      <div class="form-row align-items-center">
        <div class="col-auto my-1">
          <select class="custom-select mr-sm-2 my-custom-li" v-model="sort" @change="filter">
            <option value="notSorted">Sort by ..</option>
            <option value="deadline">Deadline</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
        <div class="col-auto my-1" v-if="sort == 'deadline'">
          <select class="custom-select mr-sm-2" v-model="order" @change="filter">
            <option value="asc">ASC</option>
            <option value="desc">DESC</option>
          </select>
        </div>
      </div>

      <hr />
      <div class="pre-scrollable">
        <ul class="list-group list-group-flush" v-if="todos.length == 0">
          <li
            v-if="todos.length == 0"
            class="list-group-item d-flex justify-content-between align-items-center"
          >{{isLoading ? 'Loading . .':todos.length == 0 ? 'No data':''}}</li>
        </ul>
        <ul class="list-group list-group-flush" v-else>
          <transition-group name="list" mode="out-in" tag="p">
            <li
              :key="index"
              class="list-group-item d-flex justify-content-between align-items-center my-custom-li"
              v-for="(todo, index) in (sort == 'notSorted' ? todos.slice():todos_temp)"
            >
              <div class="col-md-1">
                <div class="pretty p-icon p-round p-smooth">
                  <input @change="check($event, todo)" type="checkbox" v-model="todo.done" />
                  <div class="state p-success">
                    <i class="icon fa fa-check"></i>
                    <label></label>
                  </div>
                </div>
              </div>

              <div class="col-md-8">
                <p :class="{ mytext: todo.done }">{{todo.description}}</p>

                <code class="form-text">Deadline: {{deadlineFormat(todo.deadline)}}</code>
              </div>
              <div class="col-md-3">
                <router-link :to="{name: 'edit', params: { todo }}">
                  <button class="btn btn-sm btn-info">
                    <font-awesome-icon icon="pencil-alt" />
                  </button>
                </router-link>
                <button @click="del(todo)" class="btn btn-sm btn-danger">
                  <font-awesome-icon icon="trash" /> 
                </button>
              </div>
            </li>
          </transition-group>
        </ul>
      </div>
    </card-content>
  </div>
</template>

<script>
import CardContent from "./CardContent";
import MyMixin from "../mixins/MyMixin";
export default {
  components: {
    "card-content": CardContent
  },
  mixins: [MyMixin],
  data() {
    return {
      todos_temp: [],
      sort: "notSorted",
      order: "asc"
    };
  },
  computed: {
    todos() {
      return this.$store.state.todos;
    }
  },
  methods: {
    vsort() {
      let sortable = [];
      for (let index = 0; index < this.todos.length; index++) {
        const element = this.todos[index];
        const deadline = new Date(element.deadline).getTime();
        sortable.push([element, deadline]);
      }

      sortable = sortable.sort((a, b) => {
        if (this.order == "asc") {
          return a[1] - b[1];
        }
        return b[1] - a[1];
      });

      sortable.forEach(item => {
        this.todos_temp.push(item[0]);
      });
    },
    filter() {
      this.todos_temp.length = 0;
      switch (this.sort) {
        case "notSorted": {
          // console.log("notSorted");
          break;
        }
        case "deadline": {
          // console.log("deadline");
          this.vsort();
          break;
        }
        case "today": {
          // console.log("today");
          for (let index = 0; index < this.todos.length; index++) {
            const element = this.todos[index];
            if (
              element.deadline.substr(0, 10) ==
              new Date().toISOString().substr(0, 10)
            ) {
              this.todos_temp.push(element);
            }
          }
          break;
        }
        case "tomorrow": {
          // console.log("tomorrow");
          for (let index = 0; index < this.todos.length; index++) {
            const element = this.todos[index];
            let tomorrowDate = new Date();
            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
            tomorrowDate = tomorrowDate.toISOString().substr(0, 10);
            if (element.deadline.substr(0, 10) == tomorrowDate) {
              this.todos_temp.push(element);
            }
          }
          break;
        }
        case "completed": {
          // console.log("completed");
          for (let index = 0; index < this.todos.length; index++) {
            const element = this.todos[index];
            if (element.done) {
              this.todos_temp.push(element);
            }
          }
          break;
        }
        case "incomplete": {
          // console.log("incomplete");
          for (let index = 0; index < this.todos.length; index++) {
            const element = this.todos[index];
            if (!element.done) {
              this.todos_temp.push(element);
            }
          }
          break;
        }
        default:
          break;
      }
    },
    deadlineFormat(value) {
      const todayDate = new Date().toISOString().substr(0, 10);
      let tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      tomorrowDate = tomorrowDate.toISOString().substr(0, 10);

      const date = value.substr(0, 10);
      if (date == todayDate) {
        return "Today";
      } else if (date == tomorrowDate) {
        return "Tomorrow";
      }

      const d = new Date(value);
      const newFormat =
        d.getDate() +
        " " +
        this.$store.state.months[d.getMonth()] +
        " " +
        d.getFullYear();
      return newFormat;
    },
    del(selectedTodo) {
      this.$modal.show("dialog", {
        title: "Are you sure ?",
        text: "Once deleted, you will not be able to revert this!",
        buttons: [
          {
            title: "Close"
          },
          {
            title: "Delete",
            handler: async () => {
              const { success } = await this.deleteTodo(selectedTodo.id);
              if (success) {
                this.toast("Deleted successfully!!", "success", "trash");
                this.$modal.hide("dialog");

                this.todos.find((todo, index) => {
                  if (todo.description === selectedTodo.description) {
                    return this.todos.splice(index, 1);
                  }
                });
              }
            }
          }
        ]
      });
    },
    async check(evt, todo) {
      const form = {
        description: todo.description,
        done: todo.done
      };
      await this.markTodo(todo.id, form);
    },
    deleteTodo(todo_id) {
      return this.$store.dispatch("deleteTodo", { todo_id });
    },
    markTodo(todo_id, form) {
      return this.$store.dispatch("updateTodo", {
        todo_id,
        form
      });
    },
    async getTodos() {
      this.toggleLoading();
      await this.$store.dispatch("getTodos");
      this.toggleLoading();
    }
  },
  mounted() {
    this.getTodos();
  }
};
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter,
.list-leave-to {
  opacity: 0.4;
  float: right;
  transform: translateX(100%);
}
.pre-scrollable {
  max-height: 600px;
  /* overflow-y: scroll; */
}
.mytext {
  text-decoration: line-through;
}
</style>