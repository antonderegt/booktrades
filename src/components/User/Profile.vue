<template>
   <v-container>
     <div v-if="loading">
     <v-layout row wrap>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          indeterminate
          class="primary--text"
          :width="7"
          :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
     </div>
     <div v-else>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <v-card-title>
              <h6 class="primary--text">Profile</h6>
              <template>
                <v-spacer></v-spacer>
                <app-edit-user-details-dialog :user="user"></app-edit-user-details-dialog>
              </template>
            </v-card-title>
            <div v-if="userHasProfile">
              <v-card-text>Name: {{user.name}}</v-card-text>
              <v-card-text>City: {{user.city}}</v-card-text>
              <v-card-text>State: {{user.state}}</v-card-text>
            </div>
            <div v-else>
              <v-card-text>Click the edit button to add your details and refresh the page afterwards.</v-card-text>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
      <v-spacer></v-spacer>
      </v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <v-card-title>
              <h6 class="primary--text">Requests</h6>
            </v-card-title>
              <v-card-text>Your books ({{ requests.forUser }} requested): </v-card-text>
              <!-- <v-card-text>Your books</v-card-text> -->
              <v-card v-for="book in yourBooks">
                <v-card-title>{{ book.title }}</v-card-title>
                <v-btn v-if="book.bookIsRequested" @click="onAcceptTrade(book)">Accept Trade</v-btn>
                <v-btn v-if="book.bookIsTraded" disabled>Already Traded</v-btn>
              </v-card>
              <v-card-text>You requested ({{ requests.byUser }}): </v-card-text>
              <!-- <v-card-text>Your requested books</v-card-text> -->
              <v-card v-for="book in yourRequestedBooks">
                <v-card-title class="primary--text">{{ book.title }}</v-card-title>
                <v-card-text v-if="book.tradeAccepted">Trade Accepted!</v-card-text>
                <v-card-text v-else>Trade not yet accepted.</v-card-text>
              </v-card>
          </v-card>
        </v-flex>
      </v-layout>
    </v-layout>
     </div>
   </v-container>
</template>

<script>
  export default {
    computed: {
      user () {
        return this.$store.getters.loadUserData
      },
      yourBooks () {
        let yourBooks = []
        if (this.$store.getters.allBooks) {
          const allBooks = this.$store.getters.allBooks
          const numberOfBooks = Object.keys(allBooks).length
          for (let i = 0; i < numberOfBooks; i++) {
            if (this.user !== null) {
              if (this.user.id === allBooks[i].creatorId) {
                let bookIsRequested = false
                let bookIsTraded = false
                if (allBooks[i].requestingUser !== undefined) {
                  bookIsRequested = true
                }
                if (allBooks[i].available === false) {
                  bookIsTraded = true
                  bookIsRequested = false
                }
                let newBook = {
                  id: allBooks[i].id,
                  title: allBooks[i].title,
                  bookIsRequested,
                  bookIsTraded
                }
                yourBooks.push(newBook)
              }
            }
          }
          return yourBooks
        } else {
          return
        }
      },
      yourRequestedBooks () {
        let yourRequestedBooks = []
        let numberOfBooks = 0

        if (this.user && this.user.requestedBooks) {
          if (this.$store.getters.loadUserData.requestedBooks.numberOfRequestedBooks) {
            numberOfBooks = this.$store.getters.loadUserData.requestedBooks.numberOfRequestedBooks
          }
          for (let i = 0; i < numberOfBooks; i++) {
            let book = this.$store.getters.loadedBook(this.user.requestedBooks[i])
            let newBook = {
              title: book.title,
              tradeAccepted: !book.available
            }
            yourRequestedBooks.push(newBook)
          }
          return yourRequestedBooks
        } else {
          return
        }
      },
      requests () {
        let forUser = 0
        let byUser = 0

        if (this.user && this.$store.loadUserData) {
          if (this.$store.getters.loadUserData.requestedBooks.numberOfRequestedBooks) {
            byUser = this.$store.getters.loadUserData.requestedBooks.numberOfRequestedBooks
          }
          const numberOfBooks = Object.keys(this.$store.getters.loadedBooks).length
          for (let i = 0; i < numberOfBooks; i++) {
            if (this.user.id === this.$store.getters.loadedBooks[i].creatorId && this.$store.getters.loadedBooks[i].requestingUser !== undefined) {
              forUser++
            }
          }
        }

        const req = {byUser, forUser}
        return req
      },
      loading () {
        return this.$store.getters.loading
      },
      userHasProfile () {
        if (this.user) {
          if (this.user.name === '' || this.user.name === undefined) {
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      }
    },
    methods: {
      onAcceptTrade (book) {
        console.log('accepting', book)
        const acceptedTrade = {
          id: book.id,
          available: false
        }
        this.$store.dispatch('updateBookData', acceptedTrade)
      }
    }
  }
</script>
