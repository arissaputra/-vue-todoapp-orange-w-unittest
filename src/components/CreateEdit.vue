<template>
  <div>
    <card-content>
      <form @submit.prevent="onSubmit" enctype="multipart/form-data">
        <div class="form-group">
          <label :class="{'text-danger': $v.form.description.$error}">Description</label>
          <textarea
            :class="{'is-invalid': $v.form.description.$error}"
            class="form-control"
            rows="5"
            v-model="$v.form.description.$model"
            placeholder="Write the description here . ."
          ></textarea>
          <template v-if="$v.form.description.$error">
            <div class="invalid-feedback" v-if="!$v.form.description.required">Field is required</div>
            <div
              class="invalid-feedback"
              v-if="!$v.form.description.minLength"
            >Description must have at least {{$v.form.description.$params.minLength.min}} letters.</div>
            <div
              class="invalid-feedback"
              v-if="!$v.form.description.maxLength"
            >Description max length is {{$v.form.description.$params.maxLength.max}} letters.</div>
          </template>
        </div>
        <div class="form-group">
          <label :class="{'text-danger': $v.form.deadline.$error}">Deadline</label>
          <datepicker
            bootstrap-styling
            v-model="$v.form.deadline.$model"
            placeholder="Set up deadline"
          ></datepicker>
          <template v-if="$v.form.deadline.$error">
            <div
              class="invalid-feedback"
              style="display: block"
              v-if="!$v.form.deadline.required"
            >Field is required</div>
            <div
              class="invalid-feedback"
              style="display: block"
              v-if="!$v.form.deadline.minValue"
            >Date should not be in the past</div>
          </template>
        </div>
        <div class="form-group" v-if="todo">
          <label for="exampleFormControlFile1">Snapshot</label>
          <input
            accept="image/x-png, image/gif, image/jpeg"
            type="file"
            v-if="imageAccepted"
            class="form-control-file"
            ref="file"
            v-on:change="handleFileUpload()"
          />
          <img class="img-thumbnail my-img" :src="imagePreview" v-show="showPreview" />
          <img
            class="img-thumbnail my-img"
            :src="todo ? todo.snapshot:''"
            v-show="todo && todo.snapshot && !showPreview"
          />
        </div>
        <div>
          <button
            :disabled="$v.$anyError || isLoading"
            type="submit"
            class="btn btn-primary float-right"
          >
            <font-awesome-icon :icon="!isLoading ? 'save':'spinner'" :spin="isLoading" />
            {{isLoading ? ' Submitting':' Save'}}
          </button>
          <button @click="eraseForm" type="button" class="btn btn-danger">
            <font-awesome-icon icon="eraser" />Erase Form
          </button>
        </div>
      </form>
    </card-content>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { validationMixin } from "vuelidate";
import MyMixin from "../mixins/MyMixin";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import CardContent from "./CardContent";

export default {
  components: {
    Datepicker,
    "card-content": CardContent
  },
  mixins: [validationMixin, MyMixin],
  validations: {
    form: {
      description: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(30)
      },
      deadline: {
        required,
        minValue: value => {
          let date = new Date();
          date.setDate(date.getDate() - 1);
          return value > date;
        }
      }
    }
  },
  props: ["todo"],
  watch: {
    todo() {
      if (!this.todo) {
        this.eraseForm();
      }
    }
  },
  data() {
    return {
      showPreview: false,
      imagePreview: "",
      imageAccepted: true,
      snapshot: null,

      form: {
        description: null,
        deadline: null
      }
    };
  },
  methods: {
    handleFileUpload() {
      const MAX_FILE_SIZE = 100; //kb
      this.snapshot = this.$refs.file.files[0];
      const size_kb = Math.ceil(this.snapshot.size / 1024);

      if (size_kb > MAX_FILE_SIZE) {
        this.toast(`Max File size is ${MAX_FILE_SIZE} kb`, "error", "warning");
        return this.removeSnapshot();
      }

      let reader = new FileReader();
      reader.addEventListener(
        "load",
        function() {
          this.showPreview = true;
          this.imagePreview = reader.result;
        }.bind(this),
        false
      );
      if (this.snapshot) {
        /*
          Ensure the file is an image file.
        */
        if (/\.(jpe?g|png)$/i.test(this.snapshot.name)) {
          /*
            Fire the readAsDataURL method which will read the file in and
            upon completion fire a 'load' event which we will listen to and
            display the image in the preview.
          */
          reader.readAsDataURL(this.snapshot);
        } else {
          this.toast("Only accept image type !!", "error", "warning");
          this.removeSnapshot();
        }
      }
    },
    uploadSnapshot() {
      let formData = new FormData();
      formData.append("snapshot", this.snapshot);
      return this.$store.dispatch("uploadSnapshot", {
        todo_id: this.todo.id,
        formData
      });
    },
    updateTodo() {
      return this.$store.dispatch("updateTodo", {
        todo_id: this.todo.id,
        form: this.form
      });
    },
    storeTodo() {
      return this.$store.dispatch("storeTodo", {
        form: this.form
      });
    },
    popUpResult(success, msg) {
      if (success) {
        this.toast("Todo saved successfully!!", "success", "save");
        this.eraseForm();
      } else {
        this.toast(msg, "error", "warning")
      }
    },
    async onSubmit() {
      this.$v.$touch();
      this.toggleLoading();
      if (!this.$v.$invalid) {
        if (this.todo) {
          if (this.snapshot) {
            await this.uploadSnapshot();
            
          }
          const { success, msg } = await this.updateTodo();
          this.popUpResult(success, msg);

          this.$router.push("/");
        } else {
          const { success, msg } = await this.storeTodo();
          this.popUpResult(success, msg);
        }

        return this.toggleLoading();
      }
      // console.log("validation error");
      this.toggleLoading();
    },
    removeSnapshot() {
      this.snapshot = null;
      this.showPreview = false;
      this.imageAccepted = false;
      this.$nextTick(() => {
        this.imageAccepted = true;
      });
    },
    eraseForm() {
      this.form.description = null;
      this.form.deadline = null;
      this.removeSnapshot();
      this.$v.$reset();
    }
  },
  mounted() {
    if (this.todo) {
      this.form.description = this.todo.description;
      this.form.deadline = new Date(this.todo.deadline);
    }
  }
};
</script>

<style>
input[readonly] {
  background-color: white !important;
}
.my-img {
  max-width: 100%;
  max-height: 400px;
}
</style>