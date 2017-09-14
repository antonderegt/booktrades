<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <v-btn fab accent slot="activator">
      <v-icon>edit</v-icon>
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Profile</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divideR>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="name"
                label="Name"
                id="name"
                v-model="editedName"
                required
                ></v-text-field>
              <v-text-field
                name="city"
                label="City"
                id="city"
                multi-line
                v-model="editedCity"
                required
                ></v-text-field>
                 <v-text-field
                name="state"
                label="State"
                id="state"
                multi-line
                v-model="editedState"
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
    props: ['user'],
    data () {
      return {
        editDialog: false,
        editedName: 'empty' || this.user.name,
        editedCity: 'empty' || this.user.city,
        editedState: 'empty' || this.user.state
      }
    },
    methods: {
      onSaveChanges () {
        if (this.editedName.trim() === '' || this.editedCity.trim() === '' || this.editedState.trim() === '') {
          return
        }
        this.editDialog = false
        this.$store.dispatch('updateUserData', {
          id: this.$store.getters.user.id,
          name: this.editedName,
          city: this.editedCity,
          state: this.editedState
        })
      }
    }
  }
</script>

