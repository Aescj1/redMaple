/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {router} from './../main.js'
import { resolve } from 'path';

//Change to localhost for development
const REST_BASE_URL = 'http://147.87.118.201:3000/api/'

Vue.use(Vuex, axios)

function parseError(err){
  let error = {statusCode: '',
               statusMessage: ''}
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    error.statusCode = err.response.data.error.statusCode
    error.statusMessage = err.response.data.error.message
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    error.statusCode = ''
    error.statusMessage = "The request was made but no response was received from the server"
  } else {
    // Something happened in setting up the request that triggered an Error
    error.statusCode = ''
    error.statusMessage = "Something happened in setting up the request that triggered an Error"
  }
  console.log("This is the parsed error:")
  console.log(error)
  return error;
}

export default new Vuex.Store({
  state:{
    ngs: [],
    pathogen: [],
    locks: [],
    accessToken: null,
    formDialog:'',
    selectedIsolat: [],
    deleteDialog:'',

  },
  actions: {
    //------------------------------------------------------
    // All the user authentication methods
    //------------------------------------------------------
    login (context, credentials){
      return new Promise((resolve, reject) => {
        axios
          .post(REST_BASE_URL + 'Users/login', credentials)
          .then((response) => {
              console.log("User " + credentials.username + " logging in")
              console.log(response)
              context.commit('SET_ACCESSTOKEN', response)
              resolve()
          }).catch((err) => {
            let error = parseError(err)
            reject(error)
          })
      });
      
    },


    login2 (context, credentials){
        return axios
          .post(REST_BASE_URL + 'Users/login', credentials)
          .then((response) => {
              console.log("User " + credentials.username + " logging in")
              console.log(response)
              context.commit('SET_ACCESSTOKEN', response)
              //return "Successfully logged in";
          }).catch((err) => {
            let error = parseError(err)
            throw error
          })
      
    },


    logout (context){
      console.log("logging out..")
      return axios
        .post(REST_BASE_URL + 'Users/logout?access_token=' + this.state.accessToken)
        .then((response) => {
            console.log(response)
            context.commit('KICK')
        }).catch((err) => {
          context.commit('KICK')
        })
    },

    validateAccessToken(context){
      console.log("validating access token..")
      return axios
        .get(REST_BASE_URL + 'AccessTokens/' + this.state.accessToken + '/exists?access_token=' + this.state.accessToken)
        .then((response) => {
          console.log("The access token " + this.state.accessToken + " is valid")
        }).catch((err) => {
          let error = parseError(err)
          throw error
        })
    },
    //------------------------------------------------------
    // All the ngs http methods
    //------------------------------------------------------
    loadNgs (context){
      console.log(REST_BASE_URL + 'ngs?access_token=' + this.state.accessToken)
      return axios
        .get(REST_BASE_URL + 'ngs?access_token=' + this.state.accessToken)
        .then((response) => {
            context.commit('SET_NGS', response)
        }).catch((err) => {
          let error = parseError(err)
          throw error
        })
    },

    loadNgsById (context, id){
      let filter = {where:{id: id}}
      return axios
       .get(REST_BASE_URL + 'ngs/findOne?access_token=' + this.state.accessToken, filter)
       .then((response) => {
        context.commit('PUSH_NGS', response)
       }).catch((err) => {
        let error = parseError(err)
        throw error
      })
    },

    putNgs(context, json){
      return axios
      .put(REST_BASE_URL + 'ngs?access_token=' + this.state.accessToken, json)
      .then((response) => {
        console.log(response)
      }).catch((err) => {
        let error = parseError(err)
        throw error
      })
      
    },

    deleteNgs(context, id){
      return axios
      .delete(REST_BASE_URL + 'ngs/' + id + '?access_token=' + this.state.accessToken)
      .then((response) => {

      }).catch((err) => {
        let error = parseError(err)
        throw error
      })
      
    },
    //------------------------------------------------------
    // All the pathogen http methods
    //------------------------------------------------------
    loadPathogen (context){
      console.log(REST_BASE_URL + 'pathogens?access_token=' + this.state.accessToken)
      return axios
        .get(REST_BASE_URL + 'pathogens?access_token=' + this.state.accessToken)
        .then((response) => {
            context.commit('SET_PATHOGEN', response)
        }).catch((err) => {
          let error = parseError(err)
          throw error
        })
    },

    loadPathogenById (context, id){
      let filter = {where:{id: id}}
      return axios
       .get(REST_BASE_URL + 'pathogens/findOne?access_token=' + this.state.accessToken, filter)
       .then((response) => {
        context.commit('PUSH_PATHOGEN', response)
       }).catch((err) => {
        let error = parseError(err)
        throw error
      })
    },

    putPathogen(context, json){
      return axios
      .put(REST_BASE_URL + 'pathogens?access_token=' + this.state.accessToken, json)
      .then((response) => {
      }).catch((err) => {
        let error = parseError(err)
        throw error
      })
      
    },

    deletePathogen(context, id){
      return axios
      .delete(REST_BASE_URL + 'pathogens/' + id + '?access_token=' + this.state.accessToken)
      .then((response) => {
      }).catch((err) => {
        let error = parseError(err)
        throw error
      })
      
    },

    //------------------------------------------------------
    // All the lock http methods
    //------------------------------------------------------

    requestLock(context, id){
      return axios
      .post(REST_BASE_URL + 'ngs/lockRequest?access_token=' + this.state.accessToken, id)
      .then((response) => {
      }).catch((err) => {
        let error = parseError(err)
        throw error
      })
    },

    requestUnlock(context, id){
      return axios
      .post(REST_BASE_URL + 'ngs/unlockRequest?access_token=' + this.state.accessToken, id)
      .then((response) => {
      }).catch((err) => {
        let error = parseError(err)
        throw error
      })

    },

    //This method is for administrators only
    unlockAll(context){
      return axios
      .post(REST_BASE_URL + 'ngs/unlockAll?access_token=' + this.state.accessToken)
      .then((response) => {
      }).catch((err) => {
        let error = parseError(err)
        throw error
      })

    },


    //------------------------------------------------------
    // All the socket transactions
    //------------------------------------------------------
    socket_clientLocks(context, clientLocks){
      context.commit('SET_LOCKS', clientLocks)

    },

    socket_updateNotify(context, id){
      //TODO: Call action to get the dataset by ID
      console.log("loading id " + id + " ..");
      this.dispatch('loadNgsById', id)
      
    },

    socket_deleteNotify(context, id){
      //TODO: Call action to get the dataset by ID
      console.log("deleting id " + id + " ..");
      this.dispatch('loadNgs')
      
    },

    socket_updateNotifyPathogen(context, id){
      //TODO: Call action to get the dataset by ID
      console.log("loading id " + id + " ..");
      this.dispatch('loadPathogenById', id)
      
    },

    socket_deleteNotifyPathogen(context, id){
      //TODO: Call action to get the dataset by ID
      console.log("deleting id " + id + " ..");
      this.dispatch('loadPathogen')
      
    },

  },
  mutations: {
    initialiseStore(state) {
      console.log("Initializing store..")
      // Check if the ID exists
      if(localStorage.getItem('accessToken') != null) {
        this.state.accessToken = localStorage.getItem('accessToken')
        console.log("The initialized access token is: " + state.accessToken)
      }else{
      console.log("There is no access token saved")
      }
    },

    SET_ACCESSTOKEN(state, response){
      state.accessToken = response.data.id
      localStorage.setItem('accessToken', state.accessToken)
      console.log("User logged in with access token: " + state.accessToken)
    },

    SET_NGS (state, response){
      state.ngs = response.data
      console.log("This is the current ngs array:")
      console.log(state.ngs)
    },

    PUSH_NGS (state, response){
      state.ngs.push(response.data)
      console.log("This is the new ngs array:")
      console.log(state.ngs)

    },

    SET_PATHOGEN (state, response){
      state.pathogen = response.data
      console.log("This is the current pathogen array:")
      console.log(state.pathogen)

    },

    PUSH_PATHOGEN (state, response){
      state.pathogen.push(response.data)
      console.log("This is the new pathogen array:")
      console.log(state.pathogen)

    },

    SET_LOCKS(state, clientLocks){
      state.locks = clientLocks
      console.log("These are the currently locked datasets:")
      console.log(state.locks)
    },

    KICK(){
      this.state.accessToken = null
      localStorage.setItem('accessToken', this.state.accessToken)
      router.push('/')

    },

    SET_SELECTEDISOLAT(state, selectedIsolates){
      state.selectedIsolat =selectedIsolates
    }
  }
}) 












//This can be used but the store import in the main.js has to be altered to {store}
/*
export const store = new Vuex.Store({
    state:{
        ngs:[]
           
    },
    setters:{
    }
})
*/