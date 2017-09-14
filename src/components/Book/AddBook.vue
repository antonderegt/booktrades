<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h4>Add a new book</h4>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="onAddBook">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="title"
                label="Title"
                id="title"
                v-model="title"
                required></v-text-field>
            </v-flex>
         </v-layout>
         <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="author"
                label="Author"
                id="author"
                v-model="author"
                required></v-text-field>
            </v-flex>
         </v-layout>
         <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn raised @click="onPickFile" class="primary">Upload Image</v-btn>
              <input 
                type="file" 
                style="display: none" 
                ref="fileInput" 
                accept="image/*"
                @change="onFilePicked">
            </v-flex>
         </v-layout>
         <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <img :src="imageUrl" height="150">
            </v-flex>
         </v-layout>
         <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="description"
                label="Description"
                id="description"
                v-model="description"
                multi-line
                required></v-text-field>
            </v-flex>
         </v-layout>
         <v-layout>
           <v-flex xs12 sm6 offset-sm3>
             <v-btn 
               class="primary" 
               :disabled="!formIsValid"
               type="submit">Add Book</v-btn>
           </v-flex>
         </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default{
    data () {
      return {
        title: '',
        author: '',
        imageUrl: '',
        description: '',
        image: null
      }
    },
    computed: {
      formIsValid () {
        return this.title !== '' &&
          this.author !== '' &&
          this.imageUrl !== '' &&
          this.description !== ''
      }
    },
    methods: {
      onAddBook () {
        if (!this.formIsValid) {
          return
        }
        if (!this.image) {
          return
        }
        const bookData = {
          title: this.title,
          author: this.author,
          image: this.image,
          description: this.description,
          date: new Date()
        }
        this.$store.dispatch('addBook', bookData)
        this.$router.push('/books')
      },
      onPickFile () {
        this.$refs.fileInput.click()
      },
      onFilePicked (event) {
        const files = event.target.files
        let filename = files[0].name
        if (filename.lastIndexOf('.') <= 0) {
          return alert('Please add a valid file')
        }
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.imageUrl = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
        this.image = files[0]
      }
    }
  }
</script>
