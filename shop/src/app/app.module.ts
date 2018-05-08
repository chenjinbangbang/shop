import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";

import { AboutPage } from "../pages/about/about";
import { ContactPage } from "../pages/contact/contact";
import { TabsPage } from "../pages/tabs/tabs";

//tabs页面
import { HomePage } from "../pages/home/home";
import { FriendsPage } from "../pages/friends/friends";
import { SearchPage } from "../pages/search/search";
import { StorePage } from "../pages/store/store";
import { PersonalPage } from "../pages/personal/personal";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { ConfigProvider } from "../providers/config/config";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    TabsPage,

    HomePage,
    FriendsPage,
    SearchPage,
    StorePage,
    PersonalPage
  ],
  imports: [BrowserModule, IonicModule.forRoot(MyApp)],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    TabsPage,

    HomePage,
    FriendsPage,
    SearchPage,
    StorePage,
    PersonalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ConfigProvider
  ]
})
export class AppModule {}
