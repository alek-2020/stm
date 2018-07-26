import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/PopupSignIn.vue'
import Table from './components/TableBody.vue'
import NotFoundComponent from './components/404.vue'
import ErrorMessage from './components/PopupError.vue'

// import Login from './App.vue'


Vue.use(Router);

const routes = [
  { path: '*', components: { NotFoundComponent }},
  { path: '*/login', components: { LogReg: Login }},
  { path: '*/registration', components: { LogReg: Login }},
    // { path: '/table/:name', components: 
  //   {
  //     LogReg: Login,
  //     TableContent: Table
  //   }
  // },
  { path: '/error', components: { bigError: ErrorMessage }},
  { path: '/table/:link', components: 
    {
      TableContent: Table
    }
  },

  // { path: '/table/', components: 
  //   {
  //     TableContent: Table
  //   }
  // }



   // { path: '/users/:teamId', component:  Users},
    // { path: '/table/:name/login', component:  Login,

    // },
    // { path: '/table/:name', component:  Table,
    //   children: [
    //     {
    //       path: 'login',
    //       components: {
    //         TableContent: Login
    //       }
    //     }
    //   ]
    // }

  ];


  export default new Router({
    // ruoutes в es6 это routes: routes 
    routes,
    //history убирает хештег в адресе
    mode: 'history'
  });

