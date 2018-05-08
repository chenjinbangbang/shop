import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
//import { HomePage } from '../home/home';

import { HomePage } from "../home/home";
import { FriendsPage } from "../friends/friends";
import { SearchPage } from "../search/search";
import { StorePage } from "../store/store";
import { PersonalPage } from "../personal/personal";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  //tab1Root = HomePage;
  //tab2Root = AboutPage;
  //tab3Root = ContactPage;

  tab1Root = HomePage;
  tab2Root = FriendsPage;
  tab3Root = SearchPage;
  tab4Root = StorePage;
  tab5Root = PersonalPage;

  constructor() {

  }
}
