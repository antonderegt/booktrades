import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedBooks: [
      {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/New_York_NYC.jpg',
        id: '1',
        title: 'Book in New York',
        date: new Date(),
        author: 'New York',
        description: 'Cool book'
      },
      {
        imageUrl: 'https://static.pexels.com/photos/338515/pexels-photo-338515.jpeg',
        id: '2',
        title: 'Book in Paris',
        date: new Date(),
        author: 'Paris',
        description: 'Best book ever'
      }
    ],
    loadedUser: {
      id: '',
      name: '',
      city: '',
      state: '',
      requestedBooks: {}
    },
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setLoadedBooks (state, payload) {
      state.loadedBooks = payload
    },
    addBook (state, payload) {
      state.loadedBooks.push(payload)
    },
    setLoadedUser (state, payload) {
      state.loadedUser = payload
    },
    setLoadedUserBooks (state, payload) {
      state.loadedUser.requestedBooks = payload
    },
    addUser (state, payload) {
      state.loadedUser.push(payload)
    },
    updateBook (state, payload) {
      const book = state.loadedBooks.find(book => {
        return book.id === payload.id
      })
      if (payload.title) {
        book.title = payload.title
      }
      if (payload.description) {
        book.description = payload.description
      }
      if (payload.date) {
        book.date = payload.date
      }
      if (payload.requestingUser) {
        book.requestingUser = payload.requestingUser
      }
    },
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    loadBooks ({commit}) {
      commit('setLoading', true)
      firebase.database().ref('books').once('value')
        .then((data) => {
          const books = []
          const obj = data.val()
          for (let key in obj) {
            books.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              author: obj[key].author,
              date: obj[key].date,
              imageUrl: obj[key].imageUrl,
              creatorId: obj[key].creatorId,
              requestingUser: obj[key].requestingUser,
              available: obj[key].available
            })
          }
          commit('setLoadedBooks', books)
          commit('setLoading', false)
        })
        .catch((error) => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    loadUserData ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref(`users/${getters.user.id}`).once('value')
        .then((data) => {
          const user = data.val()
          commit('setLoadedUser', user)
          commit('setLoading', false)
        })
        .catch((error) => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    addBook ({commit, getters}, payload) {
      const book = {
        title: payload.title,
        author: payload.author,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id,
        available: true
      }

      let imageUrl
      let key

      firebase.database().ref('books').push(book)
        .then((data) => {
          key = data.key
          return key
        })
        .then(key => {
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          return firebase.storage().ref(`books/${key}.${ext}`).put(payload.image)
        })
        .then(fileData => {
          imageUrl = fileData.metadata.downloadURLs[0]
          return firebase.database().ref('books').child(key).update({imageUrl})
        })
        .then(() => {
          commit('addBook', {
            ...book,
            imageUrl,
            id: key
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    addUser ({commit, getters}, payload) {
      const user = {
        name: payload.name,
        city: payload.city,
        state: payload.state,
        id: getters.user.id,
        requestedBooks: {
          id: getters.user.id,
          numberOfRequestedBooks: 0
        }
      }

      firebase.database().ref(`users/${getters.user.id}`).set(user)
        .then(() => {
          commit('addUser', {
            user
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    updateBookData ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.author) {
        updateObj.author = payload.author
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.date) {
        updateObj.date = payload.date
      }
      if (payload.requestingUser) {
        updateObj.requestingUser = payload.requestingUser
      }
      if (payload.available === false) {
        console.log('updatting:', payload)
        updateObj.available = payload.available
      }
      firebase.database().ref('books').child(payload.id).update(updateObj)
        .then(() => {
          commit('setLoading', false)
          commit('updateBook', payload)
        })
      .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateUserData ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {
        requestedBooks: {}
      }
      if (payload.name) {
        updateObj.name = payload.name
      }
      if (payload.city) {
        updateObj.city = payload.city
      }
      if (payload.state) {
        updateObj.state = payload.state
      }
      if (payload.id) {
        updateObj.id = payload.id
      }
      if (payload.numberOfRequestedBooks) {
        firebase.database().ref(`users/${payload.id}/requestedBooks`).set(payload)
        .then(() => {
          commit('setLoading', false)
          commit('setLoadedUserBooks', payload)
        })
        return
      }
      firebase.database().ref('users').child(payload.id).update(updateObj)
        .then(() => {
          commit('setLoading', false)
          commit('setLoadedUser', updateObj)
        })
      .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredBooks: []
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredBooks: []
            }
            commit('setUser', newUser)
          }
        )
       .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {id: payload.uid, registeredBooks: []})
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
    clearError ({commit}) {
      commit('clearError')
    }
  },
  getters: {
    loadedBooks (state) {
      return state.loadedBooks.sort((bookA, bookB) => {
        return bookA.date > bookB.date
      })
    },
    allBooks (state) {
      return state.loadedBooks
    },
    featuredBooks (state, getters) {
      return getters.loadedBooks.slice(0, 5)
    },
    loadedBook (state) {
      return (bookId) => {
        return state.loadedBooks.find((book) => {
          return book.id === bookId
        })
      }
    },
    loadUserData (state) {
      return state.loadedUser
    },
    user (state) {
      return state.user
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  }
})
