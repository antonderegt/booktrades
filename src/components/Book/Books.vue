<template>
  <v-container>
    <v-layout row wrap v-for="book in books" :key="book.id" class="mb-2">
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-card class="info">
          <v-container fluid>
              <v-layout row>
                <v-flex xs5 sm4 md3>
                  <v-card-media
                    :src="book.imageUrl"
                    height="130"
                    ></v-card-media>
                </v-flex>
                <v-flex xs7 sm8 md9>
                  <v-card-title primary-title>
                    <div>
                      <h5 class="white--text mb-0">{{ book.title }}</h5>
                      <div>{{ book.date | date }}</div>
                    </div>
                  </v-card-title>
                  <v-card-actions>
                    <v-btn flat :to="`/books/${book.id}`"><v-icon left light>arrow_forward</v-icon>View Book</v-btn>
                  </v-card-actions>
                </v-flex>
              </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    books () {
      return this.$store.getters.loadedBooks
    }
  }
}
</script>
