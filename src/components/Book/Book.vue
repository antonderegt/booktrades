<template>
  <v-container>
    <v-layout row wrap v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          indeterminate
          class="primary--text"
          :width="7"
          :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h5 class="primary--text">{{ book.title }}</h5>
            <h6 v-if="!book.available">&nbsp;NOT AVAILABLE</h6>
            <template v-if="userIsCreator">
              <v-spacer></v-spacer>
              <app-edit-book-details-dialog :book="book"></app-edit-book-details-dialog>
            </template>
          </v-card-title>
          <v-card-media
            :src="book.imageUrl"
            height="400"
            ></v-card-media>
            <v-card-text>
              <div class="info--text">Author: {{ book.author }}</div>
              <div>Posted: {{ book.date | date }}</div>
              <div>Description: {{ book.description }}</div>
            </v-card-text>
            <v-card-actions v-if="book.available && !userIsCreator">
              <v-spacer></v-spacer>
              <v-btn :disabled="!bookIsAlreadyRequested" v-if="!userIsRequestingUser" class="primary" @click="onRequestBook">Request</v-btn>
              <v-btn v-else class="primary" @click="onUnrequestBook">Unrequest</v-btn>
            </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ['id'],
  computed: {
    book () {
      return this.$store.getters.loadedBook(this.id)
    },
    bookIsAlreadyRequested () {
      return this.book.requestingUser === undefined
    },
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    },
    userIsCreator () {
      if (!this.userIsAuthenticated) {
        return false
      }
      return this.$store.getters.user.id === this.book.creatorId
    },
    userIsRequestingUser () {
      return this.book.requestingUser === this.$store.getters.user.id
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    onRequestBook () {
      const requestBook = {
        id: this.id,
        requestingUser: this.$store.getters.user.id
      }

      let requestedBooksGetter = {}
      let objectLength = 3

      if (this.$store.getters.loadUserData === null) {
        this.$router.push('/profile')
        return
      } else if (this.$store.getters.loadUserData.requestedBooks === undefined) {
        requestedBooksGetter = {
          id: this.$store.getters.user.id,
          numberOfRequestedBooks: 1
        }
      } else {
        requestedBooksGetter = this.$store.getters.loadUserData.requestedBooks
      }

      objectLength = Object.keys(requestedBooksGetter).length - 2
      if (objectLength < 0) {
        objectLength = 0
      }

      const newBook = {
        id: this.$store.getters.user.id,
        [objectLength]: this.id
      }

      const numberOfRequests = {
        numberOfRequestedBooks: ++objectLength
      }

      const requestedBooks = Object.assign({}, requestedBooksGetter, newBook, numberOfRequests)

      this.$store.dispatch('updateBookData', requestBook)
      this.$store.dispatch('updateUserData', requestedBooks)
    },
    onUnrequestBook () {
      alert('Feature not yet available...')
    }
  }
}
</script>
