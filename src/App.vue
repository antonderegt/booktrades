<template>
  <v-app>
    <v-navigation-drawer v-model="sideNav" temporary>
      <v-list>
        <v-list-tile 
          v-for="item in menuItems" 
          :key="item.title"
          :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
	<v-list-tile v-if="userIsAuthenticated" @click="onLogout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark class="primary">
      <v-toolbar-side-icon 
        @click.stop="sideNav = !sideNav" 
        class="hidden-sm-and-up "></v-toolbar-side-icon>
      <v-toolbar-title><router-link to="/" tag="span" style="cursor: pointer;">DevBook</router-link></v-toolbar-title> 
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn 
          flat
          v-for="item in menuItems"
          :key="item.title" 
          :to="item.link"
        ><v-icon dark left>{{ item.icon }}</v-icon>{{ item.title }}</v-btn>
        <v-btn flat v-if="userIsAuthenticated" @click="onLogout"><v-icon dark left>exit_to_app</v-icon>Logout</v-btn>
      </v-toolbar-items>
     </v-toolbar>
    <main>
      <router-view></router-view> 
    </main>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        sideNav: false
      }
    },
    computed: {
      menuItems () {
        let menuItems = [
          {icon: 'face', title: 'Sign Up', link: '/signup'},
          {icon: 'lock_open', title: 'Sign In', link: '/signin'}
        ]
        if (this.userIsAuthenticated) {
          menuItems = [
            {icon: 'supervisor_account', title: 'View Books', link: '/books'},
            {icon: 'room', title: 'Trade Book', link: '/books/new'},
            {icon: 'person', title: 'Profile', link: '/profile'}
          ]
        }
        return menuItems
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      }
    },
    methods: {
      onLogout () {
        this.$store.dispatch('logout')
      }
    }
  }
</script>

<style lang="stylus">
  @import './stylus/main'
</style>
