<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <v-btn fab accent slot="activator">
      <v-icon>edit</v-icon>
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Book</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divideR>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="title"
                label="Title"
                id="title"
                v-model="editedTitle"
                required
                ></v-text-field>
                <v-text-field
                  name="author"
                  label="Author"
                  id="author"
                  v-model="editedAuthor"
                  required
                  ></v-text-field>
              <v-text-field
                name="description"
                label="Description"
                id="description"
                multi-line
                v-model="editedDescription"
                required
                ></v-text-field>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-btn flat class="blue--text darken-1" @click="editDialog = false">Close</v-btn>
              <v-btn flat class="blue--text darken-1" @click="onSaveChanges">Save</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['book'],
    data () {
      return {
        editDialog: false,
        editedTitle: this.book.title,
        editedAuthor: this.book.author,
        editedDescription: this.book.description
      }
    },
    methods: {
      onSaveChanges () {
        if (this.editedTitle.trim() === '' || this.editedDescription.trim() === '' || this.editedAuthor.trim() === '') {
          return
        }
        this.editDialog = false
        this.$store.dispatch('updateBookData', {
          id: this.book.id,
          title: this.editedTitle,
          author: this.editedAuthor,
          description: this.editedDescription
        })
      }
    }
  }
</script>
